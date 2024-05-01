import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import HoverIcon from "../../standardComponents/HoverIcon";
import FileUploader from "../../common/FileUploader";
import AlertBox, { alertTypes } from "../../../../components/common/AlertBox";
import { MODEL, BLOCKS, LABELS } from "./metadata";
import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { SLR } from "./spoken_language_recognition_pb_service";

const { rangeRestrictions, valueRestrictions } = MODEL.restrictions;
// const onlyWavFiletypeRegex = new RegExp(
//   valueRestrictions.ONLY_WAV_FILETYPE_REGEX.value
// );

const EMPTY_STRING = "";
const OK_CODE = 0;
const DURATION = "duration";
const SIZE = "size";
const HASHTAG = "#";

class SpokenLanguageRecognition extends React.Component {
  constructor(props) {
    super(props);
    const { state } = MODEL;
    this.submitAction = this.submitAction.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);

    this.state = state;
  }

  clearUploadedFile() {
    this.setState({
      data: undefined,
      uploadedFile: undefined,
    });
  }

  clearErrors() {
    this.setState({
      status: {
        errors: new Map(),
        isAllRequirementsMet: false,
      },
    });
  }

  getErrorMessageByKey(errorKey) {
    const { errors } = LABELS;
    return errors[errorKey];
  }

  canBeInvoked() {
    const { status, data } = this.state;
    return status.isAllRequirementsMet && !!data;
  }

  isOk(status) {
    return status === OK_CODE;
  }

  //if you need to check if the audio format is wav
  // getValidationMeta() {
  //   const errorKey = valueRestrictions.ONLY_WAV_FILETYPE_REGEX.errorKey;

  //   return {
  //     regex: onlyWavFiletypeRegex,
  //     errorKey: errorKey,
  //   };
  // }

  // isValidExtension(regex, filename) {
  //   return regex.exec(filename);
  // }

  // validateFileExtension(file) {
  //   const { errors } = this.state.status;
  //   const { regex, errorKey } = this.getValidationMeta();

  //   let isAllRequirementsMet = true;

  //   if (!this.isValidExtension(regex, file.name)) {
  //     const errorMessage = this.getErrorMessageByKey(errorKey);
  //     errors.set(errorKey, errorMessage);
  //   } else {
  //     errors.delete(errorKey);
  //   }

  //   if (errors.size > 0) {
  //     isAllRequirementsMet = false;
  //   }

  //   this.setState({
  //     status: {
  //       errors: errors,
  //       isAllRequirementsMet: isAllRequirementsMet,
  //     },
  //   });
  // }

  validateFileParameters(file, parameter) {
    const { FILE_RESTRICTIONS } = rangeRestrictions;
    const { errors } = this.state.status;

    const errorKeyParameterMax =
      valueRestrictions.PRAMETER_MORE_THAN_MAX[parameter];
    const errorKeyParameterLessThanMin =
      valueRestrictions.PARAMETER_LESS_THAN_ZERO[parameter];

    const isParameterMoreThanMax =
      file[parameter] > FILE_RESTRICTIONS.MAX_RESTRICTION[parameter];
    const isParameterLessThanMin = file[parameter] < 0;

    let isAllRequirementsMet = true;

    if (isParameterMoreThanMax) {
      const errorMessage = this.getErrorMessageByKey(errorKeyParameterMax);
      errors.set(errorKeyParameterMax, errorMessage);
    }
    if (isParameterLessThanMin) {
      const errorMessage = this.getErrorMessageByKey(
        errorKeyParameterLessThanMin
      );
      errors.set(errorKeyParameterLessThanMin, errorMessage);
    }
    if (errors.size > 0) {
      isAllRequirementsMet = false;
    }

    this.setState({
      status: {
        errors: errors,
        isAllRequirementsMet: isAllRequirementsMet,
      },
    });
  }

  validateAudio(file, audio) {
    this.clearErrors();
    this.validateFileParameters(audio, DURATION);
    this.validateFileParameters(file, SIZE);
  }

  createAudioElement(blob, file) {
    const { AUDIO_INPUT } = BLOCKS.inputBlocks;
    const { classes } = this.props;

    let audioContainer = document.querySelector(
      HASHTAG + AUDIO_INPUT.containerID
    );
    let audio = document.createElement(AUDIO_INPUT.createElement);
    let audioURL = window.URL.createObjectURL(blob);

    audio.setAttribute(AUDIO_INPUT.elementAttributeName, EMPTY_STRING);
    audio.src = audioURL;
    audio.id = AUDIO_INPUT.elementID;
    audio.classList.add(classes.audioElement);
    audioContainer.innerHTML = EMPTY_STRING;
    audioContainer.appendChild(audio);

    audio.addEventListener(AUDIO_INPUT.eventListener, () => {
      this.validateAudio(file, audio);
    });
  }

  handleFileUpload(files) {
    const { AUDIO_INPUT } = BLOCKS.inputBlocks;

    this.clearUploadedFile();

    if (files.length) {
      this.setState({ data: new ArrayBuffer() });
      const fileReader = new FileReader();

      fileReader.readAsArrayBuffer(files[0]);

      fileReader.onload = () => {
        let data = new Uint8Array(fileReader.result);
        let blob = new Blob([data], { type: AUDIO_INPUT.blobType });
        this.createAudioElement(blob, files[0]);

        this.setState({
          data,
          uploadedFile: files[0],
        });
      };
    }
  }

  parseResponse(response) {
    const { message, status, statusMessage } = response;

    if (!this.isOk(status)) {
      throw new Error(statusMessage);
    }

    this.setState({
      response: message.getLabel(),
    });
  }

  submitAction() {
    const { data } = this.state;
    const { METHOD } = MODEL.service;

    const methodDescriptor = SLR[METHOD];
    const request = new methodDescriptor.requestType();

    request.setData(data);

    const props = {
      request,
      onEnd: (response) => this.parseResponse(response),
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  renderInfoBlock() {
    const { classes } = this.props;
    const { informationLinks } = MODEL;
    const { informationBlocks } = BLOCKS;
    const { labels } = LABELS;

    const links = Object.values(informationBlocks);

    return (
      <Grid item xs container justify="flex-end">
        {links.map((link) => (
          <Grid item key={link.linkKey}>
            <HoverIcon
              className={classes.infoBlock}
              text={labels[link.labelKey]}
              href={informationLinks[link.linkKey]}
            >
              <SvgIcon>
                <path d={link.svgPath} />
              </SvgIcon>
            </HoverIcon>
          </Grid>
        ))}
      </Grid>
    );
  }

  renderInvokeButton() {
    const { classes } = this.props;
    const { labels } = LABELS;

    return (
      <Grid item xs={12} className={classes.invokeButton}>
        <Button
          variant="contained"
          color="primary"
          onClick={this.submitAction}
          disabled={!this.canBeInvoked()}
        >
          {labels.INVOKE_BUTTON}
        </Button>
      </Grid>
    );
  }

  renderValidationStatusBlocks(errors) {
    const { classes } = this.props;
    const errorKeysArray = Array.from(errors.keys());

    return (
      <Grid item xs={12} container className={classes.alertsContainer}>
        {errorKeysArray.map((arrayErrorKey) => (
          <AlertBox
            type={alertTypes.ERROR}
            message={errors.get(arrayErrorKey)}
            className={classes.alertMessage}
            key={arrayErrorKey}
          />
        ))}
      </Grid>
    );
  }

  renderFileUploader() {
    const { FILE_UPLOADER_INPUT, AUDIO_INPUT } = BLOCKS.inputBlocks;
    const { classes } = this.props;

    return (
      <Grid
        item
        xs={12}
        container
        justify="center"
        className={classes.serviceAudioInput}
      >
        <FileUploader
          className={classes.fileUploader}
          name={FILE_UPLOADER_INPUT.name}
          type={FILE_UPLOADER_INPUT.type}
          uploadedFiles={this.state.uploadedFile}
          handleFileUpload={this.handleFileUpload}
          multiple={FILE_UPLOADER_INPUT.isMultiple}
          setValidationStatus={(valid) =>
            console.log("FileUploader valid is", valid)
          }
          fileAccept={FILE_UPLOADER_INPUT.fileAccept}
        />
        <Grid item xs={12}>
          <div id={AUDIO_INPUT.containerID}></div>
        </Grid>
      </Grid>
    );
  }

  renderAudio() {
    const { AUDIO_OUTPUT } = BLOCKS.outputBlocks;
    const { classes } = this.props;

    let blob = new Blob([this.state.data], { type: AUDIO_OUTPUT.blobType });
    let audioURL = window.URL.createObjectURL(blob);

    return (
      <Grid item xs={12} container justify="center">
        <div className={classes.audioContainer}>
          <audio
            controls
            src={audioURL}
            className={classes.audioElement}
          ></audio>
        </div>
      </Grid>
    );
  }

  renderServiceInput() {
    const { errors } = this.state.status;
    return (
      <Grid container direction="column" justify="center">
        {this.renderFileUploader()}
        {this.renderInfoBlock()}
        {this.renderInvokeButton()}
        {errors.size ? this.renderValidationStatusBlocks(errors) : null}
      </Grid>
    );
  }

  renderOutputLine() {
    const { classes } = this.props;
    const { response } = this.state;
    const { SERVICE_OUTPUT } = LABELS.labels;

    return (
      <Grid
        className={classes.outputLine}
        item
        xs={12}
        container
        justify="flex-start"
        key={response}
      >
        <Grid item xs={3}>
          {SERVICE_OUTPUT}
        </Grid>
        <Grid className={classes.responseCategory} item xs={9}>
          {response}
        </Grid>
      </Grid>
    );
  }

  renderServiceOutput() {
    return (
      <Grid container direction="column" justify="center">
        {this.renderAudio()}
        {this.renderOutputLine()}
        {this.renderInfoBlock()}
      </Grid>
    );
  }

  render() {
    if (!this.props.isComplete) {
      return this.renderServiceInput();
    } else {
      return this.renderServiceOutput();
    }
  }
}

export default withStyles(useStyles)(SpokenLanguageRecognition);
