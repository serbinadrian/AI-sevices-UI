import React from "react";
import ReactDOM from 'react-dom';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";
import Slider from "@material-ui/core/Slider";
import OutlinedTextArea from "../../common/OutlinedTextArea";

import HoverIcon from "../../standardComponents/HoverIcon";
import FileUploader from "../../common/FileUploader";

import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { singingZH } from "./singing_pb_service";

const initialUserInput = {
  data: new ArrayBuffer(),
  uploadedFile: null,
  isValid: {
    validMeta: false,
    validMIDI: false,
    validFileExtension: false
  },
  text_content: "",
  maxTextLength: 1000,
  maxFileSize: 4194304, //4mb 
  normalize: 0.25,
  supportedFileExtensions: /(\.mid)$/i
};

class ChineseFemaleSinging extends React.Component {
  constructor(props) {
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);
    this.changeSlider = this.changeSlider.bind(this);

    this.state = {
      ...initialUserInput,
      users_guide: "https://github.com/iktina/Chinese-Female-Singing",
      code_repo: "https://github.com/iktina/Chinese-Female-Singing",
      reference: "https://github.com/iktina/Chinese-Female-Singing",
      response: undefined,
      data: undefined
    };
  }

  changeSlider(elementName, value) {
    this.setState({
      [elementName]: value,
    });
  }

  setValidationStatus(key, valid) {
    this.state.isValid[key] = valid;
  }

  handleValidation() {
    const alertBoxHolder = document.querySelector('#alert-box-holder');
    if (!this.state.isValid.validMeta || !this.state.isValid.validMIDI) {
      const alertBox = (
        <p style={{
          color: "#212121",
          marginTop: "5px",
          borderColor: "#E67381",
          borderWidth: "1px",
          padding: "10px",
          background: "#FDE5E8",
          borderRadius: "4px",
          borderStyle: "solid",
          fontSize: "16px"
        }}>
          Please provide a <b>.mid</b> file <b>up to 4 mb </b> in size!
        </p>);

      ReactDOM.render(alertBox, alertBoxHolder);
    }
    else {
      ReactDOM.render("", alertBoxHolder);
    }
  }

  validateExtension(filename) {
    const { supportedFileExtensions } = this.state;
    return supportedFileExtensions.exec(filename) ? true : false;
  }

  validateFileExtension(file) {

    let isValidFileExtension = this.validateExtension(file.name);

    if (!isValidFileExtension) {
      this.handleValidation();
    }

    this.setState({
      isValid: {
        validFileExtension: isValidFileExtension
      }
    });
  }

  validateFileSize(size) {
    const { maxFileSize } = this.state;
    return size < maxFileSize && size > 0 ? true : false;
  }

  validate(file) {

    let isFileSizeValid = false;

    if (this.state.isValid.validMIDI) {
      try {
        isFileSizeValid = this.validateFileSize(file.size);
      }
      catch (error) {
        console.error(error);
      }
    }

    this.setState({
      isValid: {
        validMeta: isFileSizeValid
      }
    });

    this.handleValidation();
  }

  handleFileUpload(files) {

    if (files.length) {
      this.setState({ data: new ArrayBuffer(), uploadedFile: null });
      const fileReader = new FileReader();
      this.validateFileExtension(files[0]);
      fileReader.readAsArrayBuffer(files[0]);
      fileReader.onload = () => {
        if (this.state.isValid.validFileExtension) {
          let data = new Uint8Array(fileReader.result);
          this.setState({ data, uploadedFile: files[0] });
          this.validate(files[0]);
        }
      };
    }
    else {
      this.handleValidation();
    }
  }

  handleFormUpdate(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  canBeInvoked() {
    return this.state.data != undefined && this.state.isValid.validMeta && this.state.text_content != "";
  }

  submitAction() {
    const { data, text_content, normalize } = this.state;
    const methodDescriptor = singingZH["singingZH"];
    const request = new methodDescriptor.requestType();

    request.setText(text_content);
    request.setMidiFile(data);
    request.setNormalize(normalize);

    console.log(request);

    const props = {
      request,
      onEnd: response => {
        const { message, status, statusMessage } = response;
        if (status !== 0) {
          throw new Error(statusMessage);
        }
        this.setState({//flag
          response: { status: "success", data: message.getOutputAudio() },
        });
      },
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  renderForm() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Grid container direction="column" justify="center" spacing={2}>
          <Grid item xs={12} container justify="center" style={{ textAlign: "center" }}>
            <FileUploader
              name="data"
              type="file"
              uploadedFiles={this.state.uploadedFile}
              handleFileUpload={this.handleFileUpload}
              setValidationStatus={valid => this.setValidationStatus("validMIDI", valid)}
              fileAccept=".mid"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} className={classes.progressBarContainer}>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <InfoIcon className={classes.infoIcon} />
              <span className={classes.title}>Normalize</span>
            </Grid>

            <Grid item xs={12} sm={12} md={9} lg={9} className={classes.sliderContainer}>
              <span className={classes.startEndNumber}>0</span>
              <Slider
                name="normalize"
                value={this.state.normalize}
                max={0.6}
                min={0}
                aria-labelledby="discrete-slider-always"
                step={0.01}
                valueLabelDisplay="on"
                onChange={(e, val) => this.changeSlider("normalize", val)}
              />
              <span className={classes.startEndNumber}>0.6</span>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{ textAlign: "left" }}>
            <OutlinedTextArea
              id="text_content"
              name="text_content"
              label="Text to sing"
              fullWidth={true}
              value={this.state.text_content}
              rows={8}
              charLimit={this.state.maxTextLength}
              helperTxt={this.state.text_content.length + " / " + this.state.maxTextLength + " char "}
              onChange={this.handleFormUpdate}
            />
          </Grid>


          <Grid item xs container justify="flex-end">
            <Grid item>
              <HoverIcon text="View code on Github" href={this.state.code_repo}>
                <SvgIcon>
                  <path
                    d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z"
                  />
                </SvgIcon>
              </HoverIcon>
            </Grid>
            <Grid item>
              <HoverIcon text="User's guide" href={this.state.users_guide}>
                <InfoIcon />
              </HoverIcon>
            </Grid>
            <Grid item>
              <HoverIcon text="View original project" href={this.state.reference}>
                <SvgIcon>
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 11.701c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701zm6 0c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701z" />
                </SvgIcon>
              </HoverIcon>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={this.submitAction} disabled={!this.canBeInvoked()}>
              Invoke
            </Button>
          </Grid>
          <Grid item xs={12} style={{ textAlign: "center" }} id={"alert-box-holder"}>

          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  componentDidUpdate() {
    if (this.props.isComplete) {
      console.log(this.state.response.data);
      var blob = new Blob([this.state.response.data], { type: "audio/wav" });
      var ac = document.getElementById("audio-container");
      ac.innerHTML = "";
      var audio = document.createElement("audio");
      audio.setAttribute("controls", "");

      var audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      audio.style.height = "50px";
      audio.style.width = "100%";
      ac.appendChild(audio);
    }
  }

  renderComplete() {
    return (
      <div>
        <p style={{
          padding: "0 10px",
          fontSize: "18px",
          fontWeight: "600",
          margin: "0"
        }}>Text to sing:</p>

        <Grid item xs={12} container justify="center" style={{ textAlign: "center" }}>
          <OutlinedTextArea
            id="serviceInput"
            name="serviceInput"
            fullWidth={true}
            value={this.state.text_content}
            rows={5}
          />
        </Grid>

        <p style={{
          padding: "0 10px",
          fontSize: "18px",
          fontWeight: "600",
          margin: "0"
        }}>Output:</p>

        <div>
          <div id="audio-container"/>
        </div>

      </div>);
  }


  render() {
    if (this.props.isComplete) return <div>{this.renderComplete()}</div>;
    else {
      return <div>{this.renderForm()}</div>;
    }
  }
}

export default withStyles(useStyles)(ChineseFemaleSinging);
