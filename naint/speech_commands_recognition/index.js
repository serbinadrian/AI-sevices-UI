import React from "react";
import ReactDOM from 'react-dom';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";

import HoverIcon from "../../standardComponents/HoverIcon";
import FileUploader from "../../common/FileUploader";

import { SCR } from "./scr_pb_service";

const initialUserInput = {
  data: new ArrayBuffer(),
  uploadedFile: null,
  isValid: {
    validMeta: false,
    validWAV: false,
    validFileExtension: false,
    optimalDuration: false
  },
  optimalDuration: 5,//seconds
  maxFileSize: 4194304, //4mb 
  maxDuration: 60, //seconds
  supportedFileExtensions: /(\.wav)$/i
};

export default class SpeechCommandsRecognition extends React.Component {
  constructor(props) {
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);

    this.state = {
      ...initialUserInput,
      users_guide: "https://github.com/iktina/speech-commands-recognition",
      code_repo: "https://github.com/iktina/speech-commands-recognition",
      reference: "https://github.com/iktina/speech-commands-recognition",
      response: undefined,
      data: undefined
    };
  }

  setValidationStatus(key, valid) {
    this.state.isValid[key] = valid;
  }

  clearFlags() {
    this.state.isValid.validMeta = false;
    this.state.isValid.validFileExtension = false;
    this.state.isValid.optimalDuration = false;
  }

  handleValidation() {
    const alertBoxHolder = document.querySelector('#alert-box-holder');
    if (this.state.isValid.validMeta && !this.state.isValid.optimalDuration) {
      const alertBox = (
      <p style={{
          color: "#212121",
          marginTop: "5px",
          borderColor: "#F18D5A",
          borderWidth: "1px",
          padding: "10px",
          background: "#FDF3E5",
          borderRadius: "4px",
          borderStyle: "solid",
          fontSize: "16px"
        }}>
        The optimal audio duration is <b>1-5 seconds</b>!
      </p>);

      ReactDOM.render(alertBox, alertBoxHolder);
    }
    else if (!this.state.isValid.validMeta || !this.state.isValid.validWAV) {
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
        Please provide a <b>.wav</b> file <b>up to 60 seconds</b> long and <b>up to 4 mb </b> in size!
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

  validateDuration(duration) {
    const { maxDuration } = this.state;
    return duration < maxDuration && duration > 0 ? true : false;
  }

  validateOptimalDuration(duration) {
    const { optimalDuration } = this.state;
    return duration > optimalDuration ? false : true;
  }

  validateAudio(file, duration) {

    let isFileSizeValid = false;
    let isDurationValid = false;
    let isOptimalDuration = false;

    if (this.state.isValid.validWAV) {
      try {
        isFileSizeValid = this.validateFileSize(file.size);
        isDurationValid = this.validateDuration(duration);
        isOptimalDuration = this.validateOptimalDuration(duration);
      }
      catch (error) {
        console.error(error);
      }
    }

    this.setState({
      isValid: {
        validMeta: isFileSizeValid && isDurationValid,
        optimalDuration: isOptimalDuration
      }
    });

    this.handleValidation();
  }

  handleFileUpload(files) {

    this.clearFlags();

    if (files.length) {

      this.setState({ data: new ArrayBuffer(), uploadedFile: null });

      const fileReader = new FileReader();

      this.validateFileExtension(files[0]);
      fileReader.readAsArrayBuffer(files[0]);

      fileReader.onload = () => {

        if (this.state.isValid.validFileExtension) {
          let duration = -1;
          let data = new Uint8Array(fileReader.result);
          let blob = new Blob([data], { type: "audio/wav" });
          let audioContainer = document.querySelector("#audio-container");
          let audio = document.createElement("audio");
          let audioURL = window.URL.createObjectURL(blob);

          audio.setAttribute("controls", "");
          audio.src = audioURL;
          audio.style.height = "50px";
          audio.style.width = "100%";
          audio.id = "audio-element";
          audioContainer.innerHTML = "";
          audioContainer.appendChild(audio);


          this.setState({ data, uploadedFile: files[0] });
          audio.addEventListener('loadedmetadata', () => {
            duration = audio.duration;
            this.validateAudio(files[0], duration);
          });
        }
      };
    }
    else {
      this.handleValidation();
    }
  }

  canBeInvoked() {
    return this.state.data != undefined && this.state.isValid.validMeta ? true : false;
  }

  submitAction() {
    const { data } = this.state;
    const methodDescriptor = SCR["sc2t"];
    const request = new methodDescriptor.requestType();

    request.setData(data);

    const props = {
      request,
      onEnd: response => {
        const { message, status, statusMessage } = response;
        if (status !== 0) {
          throw new Error(statusMessage);
        }
        this.setState({
          ...initialUserInput,
          response: { status: "success", text: message.getResults() },
        });
      },
    };
    this.props.serviceClient.unary(methodDescriptor, props);
  }

  renderForm() {
    return (
      <React.Fragment>
        <Grid container direction="column" justify="center" spacing={2}>
          <Grid item xs={12} container justify="center" style={{ textAlign: "center" }}>
            <FileUploader
              name="data"
              type="file"
              uploadedFiles={this.state.uploadedFile}
              handleFileUpload={this.handleFileUpload}
              setValidationStatus={valid => this.setValidationStatus("validWAV", valid)}
              fileAccept=".wav"
            />
          </Grid>

          <Grid item xs={12} style={{ textAlign: "center" }}>
            <div id="audio-container" className="col-md-3 col-lg-2">
              <audio controls style={{ height: "50px", width: "100%", fontSize: "13px", marginBottom: "5px" }}>
                <source id="asrAudio" src="" type="audio/wav" />
              </audio>
            </div>
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

  renderComplete() {
    return (
      <div style={{ background: "#F8F8F8", padding: "24px" }}>
        <h4> Results</h4>
        <div style={{ padding: "10px 10px 0 10px", fontSize: "14px", color: "#9b9b9b" }}>
          <div style={{ padding: "10px 0" }}>
            Response from service is:
            <div
              style={{
                color: "#212121",
                marginTop: "5px",
                padding: "10px",
                background: "#f1f1f1",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            >
              Recognized command is <b>{this.state.response.text}</b>
            </div>
          </div>
        </div>
      </div>
    );
  }


  render() {
    if (this.props.isComplete) return <div>{this.renderComplete()}</div>;
    else {
      return <div>{this.renderForm()}</div>;
    }
  }
}
