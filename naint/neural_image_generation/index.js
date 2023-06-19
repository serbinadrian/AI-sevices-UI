import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import Slider from "@material-ui/core/Slider";
import HoverIcon from "../../standardComponents/HoverIcon";
import OutlinedTextArea from "../../common/OutlinedTextArea";
import OutlinedDropDown from "../../common/OutlinedDropdown";
import AlertBox, { alertTypes } from "../../../../components/common/AlertBox";
import { image_generation } from "./neural_image_generation_pb_service";
import { MODEL, BLOCKS, LABELS } from "./metadata";
import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";

const { rangeRestrictions, valueRestrictions } = MODEL.restrictions;
const onlyLatinsRegex = new RegExp(valueRestrictions.ONLY_LATINS_REGEX.value);

const EMPTY_STRING = "";
const OK_CODE = 0;
const SPACE = " ";
const SPACED_SLASH = " / ";

const outlinedTextAreaAdditionalProps = {
  HELPER: "helperTxt",
  ON_CHANGE: "onChange",
  CHAR_LIMIT: "charLimit",
};

const IMAGE_CONTAINER_CLASS = "image-container";

class NeuralImageGeneration extends React.Component {
  constructor(props) {
    const { state } = MODEL;
    super(props);

    this.submitAction = this.submitAction.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.inputMaxLengthHelperFunction = this.inputMaxLengthHelperFunction.bind(
      this
    );
    this.handleDropDownParameterChange = this.handleDropDownParameterChange.bind(
      this
    );
    this.downloadImage = this.downloadImage.bind(this);

    this.state = state;
  }

  getErrorMessageByKey(errorKey) {
    const { errors } = LABELS;

    return errors[errorKey];
  }

  getValidationMeta() {
    const errorKey = valueRestrictions.ONLY_LATINS_REGEX.errorKey;

    return {
      regex: onlyLatinsRegex,
      errorKey: errorKey,
    };
  }

  isValidInput(regex, text) {
    return regex.exec(text);
  }

  validateInput(targetValue) {
    const { errors } = this.state.status;
    const { regex, errorKey } = this.getValidationMeta();

    let isAllRequirementsMet = true;

    if (!this.isValidInput(regex, targetValue)) {
      const errorMessage = this.getErrorMessageByKey(errorKey);
      errors.set(errorKey, errorMessage);
    } else {
      errors.delete(errorKey);
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

  canBeInvoked() {
    const {
      status,
      textInputValue,
      selectedModelParameter,    
    } = this.state;
    const { isAllRequirementsMet } = status;

    let configurationsRequest = selectedModelParameter;

    return (
      configurationsRequest &&
      isAllRequirementsMet &&
      textInputValue !== EMPTY_STRING
    );
  }

  isOk(status) {
    return status === OK_CODE;
  }

  changeSlider(elementName, value) {
    this.setState({
      [elementName]: value,
    });
  }

  handleTextInput(event) {
    const targetName = event.target.name;
    const targetValue = event.target.value;

    this.validateInput(targetValue);

    this.setState({
      [targetName]: targetValue,
    });
  }

  handleDropDownParameterChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  componentDidUpdate() {
    const { response } = this.state;

    if (this.props.isComplete) {
      const images = JSON.parse(response.data)?.images;
      const imageContainer = document.getElementById(IMAGE_CONTAINER_CLASS);

      for (let i = 0; i < images.length; i++) {
        const byteCharacters = atob(images[i]);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpg" });

        const picture = document.createElement("img");

        const imageFrame = this.createImageContainer(i);
        const openImageInNewTabButton = this.createImageInNewTabButton();
        const downloadImageButton = this.createDownloadButton();

        openImageInNewTabButton.addEventListener("click", this.openImageInNewTab);
        downloadImageButton.addEventListener("click", this.downloadImage);        

        picture.id = IMAGE_CONTAINER_CLASS + i;
        picture.src = window.URL.createObjectURL(blob);

        imageFrame.appendChild(picture);        
        imageFrame.appendChild(openImageInNewTabButton);
        imageFrame.appendChild(downloadImageButton);
        imageContainer.appendChild(imageFrame);
      }
    }
  }

  parseResponse(response) {
    const { message, status, statusMessage } = response;
    if (!this.isOk(status)) {
      throw new Error(statusMessage);
    }

    this.setState({
      response: {
        data: message.getImage1(),
      },
    });
  }

  submitAction() {
    const { textInputValue } = this.state;
    const { service } = MODEL;

    const methodDescriptor = image_generation[service.METHOD];
    const request = new methodDescriptor.requestType();

    request.setSentence(textInputValue);
    request.setModel(this.state.selectedModelParameter);    
    if (!this.isSelectedModelMinDalle()) {      
      request.setSeedval(this.state.seed);
      request.setNImages(this.state.n_images);
      request.setSteps(this.state.steps);
      request.setPromptStyle(this.state.selectedStyleParameter);
    }

    const props = {
      request,
      onEnd: (response) => this.parseResponse(response),
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  inputMaxLengthHelperFunction(textLengthValue, restrictionKey) {
    const { labels } = LABELS;

    return (
      textLengthValue +
      SPACED_SLASH +
      rangeRestrictions[restrictionKey].max +
      SPACE +
      labels.CHARS
    );
  }

  createHandleConfiguration(meta) {
    const { handleFunctionKey, helperFunctionKey, rangeRestrictionKey } = meta;

    let InputHandlerConfiguration = {};

    if (this[helperFunctionKey]) {
      //helper is const string for single render and it have to be constructed before used -> call()
      InputHandlerConfiguration[outlinedTextAreaAdditionalProps.HELPER] = this[
        helperFunctionKey
      ].call(this, this.state[meta.stateKey].length, rangeRestrictionKey);
    }
    if (this[handleFunctionKey]) {
      InputHandlerConfiguration[
        outlinedTextAreaAdditionalProps.ON_CHANGE
      ] = this[handleFunctionKey];
    }
    if (rangeRestrictions[meta.rangeRestrictionKey].max) {
      InputHandlerConfiguration[outlinedTextAreaAdditionalProps.CHAR_LIMIT] =
        rangeRestrictions[meta.rangeRestrictionKey].max;
    }
    return InputHandlerConfiguration;
  }

  renderTextArea(meta) {
    const { labels } = LABELS;

    let InputHandlerConfiguration = [];

    if (meta.edit) {
      InputHandlerConfiguration = this.createHandleConfiguration(meta);
    }

    return (
      <Grid item xs={12} container justify="center">
        <OutlinedTextArea
          fullWidth={true}
          id={meta.id}
          name={meta.name}
          rows={meta.rows}
          label={labels[meta.labelKey]}
          value={this.state[meta.stateKey]}
          {...InputHandlerConfiguration}
        />
      </Grid>
    );
  }

  renderDropDown(meta, handleChangeParameters) {
    const { labels } = LABELS;

    return (
      <Grid item xs={5} container>
        <OutlinedDropDown
          fullWidth={true}
          id={meta.id}
          name={meta.name}
          label={labels[meta.labelKey]}
          list={this.state[meta.parametersListKey]}
          value={this.state[meta.stateKey]}
          onChange={handleChangeParameters}
        />
      </Grid>
    );
  }

  isSelectedModelMinDalle() {
    return (
      this.state.selectedModelParameter === this.state.modelValues.minDalleValue
    );
  }

  renderSlider(sliderParameterKey) {
    const { classes } = this.props;
    const { labels } = LABELS;
    const { diffusionSliderRestrictions } = MODEL.restrictions;

    const sliderParameter = diffusionSliderRestrictions[sliderParameterKey];

    return (
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        className={classes.progressBarContainer}
        key={sliderParameterKey}
      >
        <Grid item xs={12} sm={12} md={2} lg={2}>
          <span className={classes.sliderTitle}>
            {labels[sliderParameterKey]}
          </span>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={10}
          lg={10}
          className={classes.sliderContainer}
        >
          <span className={classes.startEndNumber}>{sliderParameter.min}</span>
          <Slider
            name="modelSeed"
            value={this.state[sliderParameter.stateKey]}
            max={sliderParameter.max}
            min={Number(sliderParameter.min)}
            aria-labelledby="discrete-slider-always"
            step={sliderParameter.step}
            valueLabelDisplay="on"
            onChange={(e, value) =>
              this.changeSlider(sliderParameter.stateKey, value)
            }
          />
          <span className={classes.startEndNumber}>{sliderParameter.max}</span>
        </Grid>
      </Grid>
    );
  }

  renderSliders() {
    const { diffusionSliderRestrictions } = MODEL.restrictions;

    const sliderParamsKeys = Object.keys(diffusionSliderRestrictions);
    return sliderParamsKeys.map((sliderParameterKey) =>
      this.renderSlider(sliderParameterKey)
    );
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

  renderStyleConfigurationBlock(isNotVisible) {
    const { inputBlocks } = BLOCKS;
    if (isNotVisible) {
      return;
    }
    return (
      <React.Fragment>
        {this.renderDropDown(
          inputBlocks.DROP_DOWN_STYLE_PARAMETRS,
          this.handleDropDownParameterChange
        )}
        {this.renderSliders()}
      </React.Fragment>
    );
  }

  openImageInNewTab( event ) {        
    const image = new Image();
    image.src = event.currentTarget.parentNode.firstChild.src;
    const windowOpen = window.open("");
    windowOpen.document.write(image.outerHTML);
  }

  downloadImage( event ) {
    const {selectedModelParameter, steps, n_images, seed} = this.state;

    if (!window.Blob) {
      alert("Your legacy browser does not support this action.");
      return;
    }
    
    let additionalImageName = selectedModelParameter;
    if(!this.isSelectedModelMinDalle()) {
      additionalImageName += `_${seed}_${n_images}_${steps}`;
    }
    const link = document.createElement("a");
    link.href =  event.currentTarget.parentNode.firstChild.src;
    link.download = `NaintImageGenerationService_${additionalImageName}`;
    link.click();
  }

  createImageContainer(index) {
    const { classes } = this.props;
    const container = document.createElement("div");

    container.index = index;
    container.classList.add(classes.imageContainer);
    return container;
  }

  createImageInNewTabButton() {
    const { labels } = LABELS;
    const { classes } = this.props;

    const openImageInNewTabButton = document.createElement("a");
    openImageInNewTabButton.innerHTML = labels.OPEN_IMAGE_BUTTON;
    openImageInNewTabButton.classList.add(classes.newTabImageButton);
    return openImageInNewTabButton;
  }

  createDownloadButton() {
    const { labels } = LABELS;
    const { classes } = this.props;
    const downloadButton = document.createElement("a");

    downloadButton.innerHTML = labels.DOWNLOAD_BUTTON;
    downloadButton.classList.add(classes.newTabImageButton);
    downloadButton.classList.add(classes.downloadButton);
    return downloadButton;
  }

  renderServiceInput() {
    const { inputBlocks } = BLOCKS;
    const { errors } = this.state.status;

    return (
      <Grid container direction="column" justify="center">
        {this.renderDropDown(
          inputBlocks.DROP_DOWN_MODEL_PARAMETRS,
          this.handleDropDownParameterChange
        )}
        {this.renderTextArea(inputBlocks.TEXT_INPUT)}
        {this.renderStyleConfigurationBlock(this.isSelectedModelMinDalle())}
        {this.renderInfoBlock()}
        {this.renderInvokeButton()}
        {errors.size ? this.renderValidationStatusBlocks(errors) : null}
      </Grid>
    );
  }

  renderImageBlock() {
    const { classes } = this.props;

    return (
      <Grid
        container
        id={IMAGE_CONTAINER_CLASS}
        className={classes.imagesContainer}
      ></Grid>
    );
  }

  renderServiceParameters() {
    const { labels } = LABELS;
    const { USER_STYLE_PARAMETERS_INPUT } = BLOCKS.outputBlocks;
    const { classes } = this.props;

    const modelParameterValue = this.state[
      USER_STYLE_PARAMETERS_INPUT.modelParameterKey
    ];

    return (
      <Grid container>
        <Grid item className={classes.generationParameters}>
          {labels[modelParameterValue]}
        </Grid>
        {this.renderStyleParametrs()}
      </Grid>
    );
  }

  renderStyleParametrs() {
    const { labels } = LABELS;
    const { USER_STYLE_PARAMETERS_INPUT } = BLOCKS.outputBlocks;
    const { classes } = this.props;

    if (!this.isSelectedModelMinDalle()) {
      return (
        <React.Fragment>
          <Grid item className={classes.generationParameters}>
            {this.state[USER_STYLE_PARAMETERS_INPUT.styleParameterKey]}
          </Grid>
          {USER_STYLE_PARAMETERS_INPUT.sliderParameterKeys.map((key) => (
            <Grid item key={key} className={classes.generationParameters}>
              {labels[key.toUpperCase()]} {this.state[key]}
            </Grid>
          ))}
        </React.Fragment>
      );
    }
  }

  renderServiceOutput() {
    const { response } = this.state;
    const { outputBlocks } = BLOCKS;
    const { status } = LABELS;

    if (!response) {
      return <h4>{status.NO_RESPONSE}</h4>;
    }

    return (
      <Grid container direction="column" justify="center">
        {this.renderTextArea(outputBlocks.USER_TEXT_INPUT)}
        {this.renderServiceParameters()}
        {this.renderImageBlock()}
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

export default withStyles(useStyles)(NeuralImageGeneration);
