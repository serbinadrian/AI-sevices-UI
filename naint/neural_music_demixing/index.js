import React from "react";
import ReactDOM from 'react-dom';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";
import OutlinedDropDown from "../../common/OutlinedDropdown";

import HoverIcon from "../../standardComponents/HoverIcon";
import FileUploader from "../../common/FileUploader";

import { demixing } from "./demixing_pb_service";

const initialUserInput = {
  uploadedFile: null,
  audioArr: [],
  isValid: {
    validMeta: false,
    validWAV: false,
    validFileExtension: false
  },
  parametersList: [
    {
      label: "All",
      value: "all"
    },
    {
      label: "Drums",
      value: "drums"
    },
    {
      label: "Bass",
      value: "bass"
    },
    {
      label: "Vocals",
      value: "vocals"
    },
    {
      label: "Other sounds",
      value: "other"
    }],
  maxDuration: 270, //seconds
  maxFileSize: 41943040, //40mb
  sounds: "all",
  isFileUploaded: false,
  isDataRead: false,
  isOutputAudiosRendered: false,
  isInitialAudioRendered: false,
  supportedFileExtensions: /(\.wav)$/i
};

export default class NeuralMusicDemixing extends React.Component {
  constructor(props) {
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleParameterChange = this.handleParameterChange.bind(this);

    this.state = {
      ...initialUserInput,
      users_guide: "https://github.com/iktina/Neural-Music-Demixing",
      code_repo: "https://github.com/iktina/Neural-Music-Demixing",
      reference: "https://github.com/iktina/Neural-Music-Demixing",
      response: undefined,
      data: undefined
    };
  }

  handleParameterChange(event) {
    let selectedOption = event.target.value
    this.setState({
      sounds: selectedOption
    });
  }

  setValidationStatus(key, valid) {
    this.state.isValid[key] = valid;
  }

  handleValidation() {
    const alertBoxHolder = document.querySelector('#alert-box-holder');
    if (!this.state.isValid.validMeta || !this.state.isValid.validWAV) {
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
          Please provide a <b>.wav</b> file <b>up to 270 seconds</b> long and <b>up to 40 mb </b> in size!
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

  validate(file, duration) {

    let isFileSizeValid = false;
    let isDurationValid = false;

    if (this.state.isValid.validWAV) {
      try {
        isFileSizeValid = this.validateFileSize(file.size);
        isDurationValid = this.validateDuration(duration);
      }
      catch (error) {
        console.error(error);
      }
    }

    this.setState({
      isValid: {
        validMeta: isFileSizeValid && isDurationValid
      }
    });

    this.handleValidation();
  }

  handleFileUpload(files) {
    this.setState({
      isFileUploaded: false,
      isInitialAudioRendered: false,
    });
    document.getElementById("initial-audio-container").innerHTML = "";
    if (files.length) {
      this.setState({
        data: new ArrayBuffer(),
        uploadedFile: null
      });
      const fileReader = new FileReader();
      this.validateFileExtension(files[0]);
      fileReader.readAsArrayBuffer(files[0]);
      fileReader.onload = () => {
        if (this.state.isValid.validFileExtension) {
          let duration = -1;
          let data = new Uint8Array(fileReader.result);
          let blob = new Blob([data], { type: "audio/wav" });
          let audio = document.createElement("audio");
          let audioURL = window.URL.createObjectURL(blob);
          audio.src = audioURL;
          this.setState({ data, uploadedFile: files[0] });     
          audio.addEventListener('loadedmetadata', () => {
            duration = audio.duration;
            this.validate(files[0], duration);
            if(this.state.isValid.validMeta){
              this.setState({
                isFileUploaded: true
              });
            }
          });
        }
      };
    }
    else {
      this.handleValidation();
    }
  }

  canBeInvoked() {
    return this.state.data != undefined && this.state.isValid.validMeta;
  }

  submitAction() {
    const { data, sounds } = this.state;
    const methodDescriptor = demixing["demixing"];
    const request = new methodDescriptor.requestType();

    request.setAudioFile(data);
    request.setSounds(sounds);

    const props = {
      request,
      onEnd: response => {
        const { message, status, statusMessage } = response;
        if (status !== 0) {
          throw new Error(statusMessage);
        }
        JSON.parse(message.getDemixedAudio(), (key, value) => {
          var audio = document.createElement("audio");
          audio.setAttribute("controls", "");
          var audioURL = "data:audio/wav;base64," + value;
          audio.src = audioURL;
          audio.style.height = "50px";
          audio.style.width = "100%";
          this.state.audioArr[key] = audio;
        });
        this.setState({
          isDataRead: true
        });
      },
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  renderForm() {
    return (
      <React.Fragment>
        <Grid container spacing={2} justify="flex-start">
          <Grid item xs={8} container spacing={2}>
            <Grid item xs>
              <OutlinedDropDown
                id="params"
                name="params"
                label="Sounds"
                fullWidth={true}
                list={this.state.parametersList}
                value={this.state.sounds}
                onChange={this.handleParameterChange}
              />
            </Grid>
            <Grid item xs style={{ paddingRight: 0 }}>
            </Grid>
          </Grid>
        </Grid>
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

          <Grid id="initial-audio-container" item>
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
    if (this.state.isFileUploaded && !this.state.isInitialAudioRendered) {
      var varInitialContainer = document.getElementById("initial-audio-container");
      this.renderAudio(varInitialContainer, true);
      this.state.isInitialAudioRendered = true;
    }
    if (this.props.isComplete && this.state.isDataRead && !this.state.isOutputAudiosRendered) {
      var container = document.getElementById("audio-container");
      this.renderAudioTitle(container, "Initial audio");
      this.renderOutputAudios(container);
      this.state.isOutputAudiosRendered = true;
    }
  }

  renderAudioTitle(container, titleText) {
    let title = document.createElement("p");
    title.innerText = titleText;
    title.style.padding = "0 10px";
    title.style.fontSize = "18px";
    title.style.fontWeight = "600";
    title.style.margin = "0";
    container.appendChild(title);
  }

  renderOutputAudios(container) {
    this.renderAudio(container, true);
    switch (this.state.sounds) {
      case "all":
        this.renderAudioTitle(container, "Drums")
        this.renderAudio(container, false, "drums");
        this.renderAudioTitle(container, "Bass")
        this.renderAudio(container, false, "bass");
        this.renderAudioTitle(container, "Vocals")
        this.renderAudio(container, false, "vocals");
        this.renderAudioTitle(container, "Other sounds")
        this.renderAudio(container, false, "other");
        break;
      case "drums":
        this.renderAudioTitle(container, "Drums")
        this.renderAudio(container, false, "drums");
        this.renderAudioTitle(container, "Other sounds")
        this.renderAudio(container, false, "no_drums");
        break;
      case "bass":
        this.renderAudioTitle(container, "Bass")
        this.renderAudio(container, false, "bass");
        this.renderAudioTitle(container, "Other sounds")
        this.renderAudio(container, false, "no_bass");
        break;
      case "vocals":
        this.renderAudioTitle(container, "Vocals")
        this.renderAudio(container, false, "vocals");
        this.renderAudioTitle(container, "Other sounds")
        this.renderAudio(container, false, "no_vocals");
        break;
      case "other":
        this.renderAudioTitle(container, "Drums, Bass, Vocals")
        this.renderAudio(container, false, "no_other");
        this.renderAudioTitle(container, "Other sounds");
        this.renderAudio(container, false, "other");
        break;
    }
  }

  renderAudio(container, isInitialAudio, key = -1) {
    var data;
    var audio;
    if (isInitialAudio) {
      data = new Uint8Array(this.state.data);
      var data = new Uint8Array(this.state.data);
      var blob = new Blob([data], { type: "audio/wav" });
      var audioURL = window.URL.createObjectURL(blob);
      audio = document.createElement("audio")
      audio.setAttribute("controls", "");
      audio.src = audioURL;
      audio.style.height = "50px";
      audio.style.width = "100%";
    } else {
      audio = this.state.audioArr[key];
    }

    container.appendChild(audio);
  }


  render() {
    if (this.props.isComplete) {
      return <div id="audio-container" />;
    }
    else {
      return <div>{this.renderForm()}</div>;
    }
  }
}

