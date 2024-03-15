import React from "react";
import ReactDOM from "react-dom";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FileUploader from "../../common/FileUploader";
import FormControl from "@material-ui/core/FormControl";
import HoverIcon from "../../standardComponents/HoverIcon";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { splitter } from "./splitter_pb_service";

const initialUserInput = {
    uploadedFile: null,
    audioMap: [],
    isFilePresent: false,
    isValid: {
        validMeta: false,
        validFileExtension: false,
    },
    parametersList: [
        {
            label: "Guitar",
            value: "guitar",
        },
        {
            label: "Piano",
            value: "piano",
        },
        {
            label: "Vocals",
            value: "vocals",
        },
        {
            label: "Drums",
            value: "drums",
        },
        {
            label: "Bass",
            value: "bass",
        },
        {
            label: "Other sounds",
            value: "other",
        },
    ],
    maxDuration: 270, //seconds
    maxFileSize: 10485760, //10mb
    sounds: [],
    isFileUploaded: false,
    isDataRead: false,
    isOutputAudiosRendered: false,
    isInitialAudioRendered: false,
    supportedFileExtensions: /(\.mp3)$/i,
};

export default class NeuralMusicDemixing extends React.Component {
    constructor(props) {
        super(props);
        this.selectAll = this.selectAll.bind(this);
        this.parseOutput = this.parseOutput.bind(this);
        this.submitAction = this.submitAction.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleParameterChange = this.handleParameterChange.bind(this);
        this.setValidationStatus = this.setValidationStatus.bind(this);

        this.state = {
            ...initialUserInput,
            users_guide: "https://github.com/iktina/Neural-Music-Demixing",
            code_repo: "https://github.com/iktina/Neural-Music-Demixing",
            reference: "https://github.com/iktina/Neural-Music-Demixing",
            response: undefined,
            data: undefined,
        };
    }

    handleParameterChange(event) {
        const { sounds } = this.state;
        const selectedOption = event.target.value;
        if (sounds.includes(selectedOption)) {
            const result = sounds.filter((item) => item !== selectedOption);
            this.setState({
                sounds: result,
            });
        } else {
            sounds.push(selectedOption);
            this.setState({
                sounds: sounds,
            });
        }
    }

    setValidationStatus(status) {
        // this.setState({
        //   isFilePresent: status,
        // });
    }

    createAlertBox() {
        return (
            <p
                style={{
                    color: "#212121",
                    marginTop: "5px",
                    borderColor: "#E67381",
                    borderWidth: "1px",
                    padding: "10px",
                    background: "#FDE5E8",
                    borderRadius: "4px",
                    borderStyle: "solid",
                    fontSize: "16px",
                }}
            >
                Please provide a <b>.mp3</b> file{" "}
                <b>up to {this.state.maxDuration} seconds</b> long and{" "}
                <b>up to {this.state.maxFileSize / 1048576} mb </b> in size!
            </p>
        );
    }

    handleValidation() {
        const alertBoxHolder = document.querySelector("#alert-box-holder");
        if (!this.state.isValid.validMeta) {
            const alertBox = this.createAlertBox();
            ReactDOM.render(alertBox, alertBoxHolder);
            return;
        }
        ReactDOM.render("", alertBoxHolder);
    }

    validateFileExtension(file) {
        const { supportedFileExtensions, isValid } = this.state;

        const isValidFileExtension = !!file && supportedFileExtensions.test(file.name);

        if (!isValidFileExtension) {
            this.handleValidation();
        }
        isValid.validFileExtension = isValidFileExtension;

        this.setState({
            isValid: isValid,
        });
    }

    validateFileSize(size) {
        const { maxFileSize } = this.state;
        return size < maxFileSize && size > 0;
    }

    validateDuration(duration) {
        const { maxDuration } = this.state;
        return duration < maxDuration && duration > 0;
    }

    validate(file, duration) {
        try {
            const { isValid } = this.state;
            isValid.validMeta =
                this.validateFileSize(file.size) &&
                this.validateDuration(duration);

            this.setState({
                isValid,
            });

            this.handleValidation();
        } catch (error) {
            console.error(error);
        }
    }

    resetFileUploader() {
        document.getElementById("initial-audio-container").innerHTML = "";
        this.setState({
            isFileUploaded: false,
            isInitialAudioRendered: false,
            data: new ArrayBuffer(),
            uploadedFile: null,
        });
    }

    handleFileUpload(files) {
        this.resetFileUploader();

        if (!files.length) {
            this.handleValidation();
        }
        
        this.validateFileExtension(files[0]);
        const { isValid } = this.state;
        if (!isValid.validFileExtension) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(files[0]);
        fileReader.onload = () => {
            let duration = -1;
            const { audio, data } = this.createAudio(fileReader.result);
            this.setState({ data: data, uploadedFile: files[0] });
            audio.addEventListener("loadedmetadata", () => {
                duration = audio.duration;
                this.validate(files[0], duration);
                if (!isValid.validMeta) {
                    return;
                }
                this.setState({
                    isFileUploaded: true,
                });
            });
        };
    }

    canBeInvoked() {
        const { data, isValid, sounds } = this.state;
        return data !== undefined && isValid.validMeta && sounds?.length > 0;
    }

    parseOutput(response) {
        const { message, status, statusMessage } = response;

        if (status !== 0) {
            throw new Error(statusMessage);
        }
        this.setState({
            isDataRead: true,
            audioMap: message.getAudiomapMap().map_,
        });
    }

    submitAction() {
        const { data, sounds } = this.state;
        const methodDescriptor = splitter["SendAudio"];
        const request = new methodDescriptor.requestType();

        request.setAudioData(data);
        request.setSelectedTagsList(sounds);

        const props = {
            request,
            onEnd: this.parseOutput,
        };

        this.props.serviceClient.unary(methodDescriptor, props);
    }

    renderAudioUploader() {
        return (
            <Grid
                item
                xs={12}
                container
                justify="center"
                style={{ textAlign: "center" }}
            >
                <FileUploader
                    name="data"
                    type="file"
                    uploadedFiles={this.state.uploadedFile}
                    handleFileUpload={this.handleFileUpload}
                    setValidationStatus={this.setValidationStatus}
                    fileAccept=".mp3"
                />
            </Grid>
        );
    }

    renderInitialAudioContainer() {
        return <Grid id="initial-audio-container" item></Grid>;
    }

    selectAll() {
        const { parametersList } = this.state;
        const sounds = parametersList.map((parameter) => parameter.value);
        this.setState({
            sounds: sounds,
        });
    }

    clearSelection() {
        this.setState({
            sounds: [],
        });
    }

    renderSelectAll() {
        const { sounds, parametersList } = this.state;
        const buttonSettings = {
            action: "selectAll",
            text: "Select all",
            color: "primary",
        };

        if (sounds.length === parametersList.length) {
            buttonSettings.action = "clearSelection";
            buttonSettings.text = "Clear selection";
            buttonSettings.color = "secondary";
        }

        return (
            <Button
                color={buttonSettings.color}
                onClick={() => this[buttonSettings.action]()}
            >
                {buttonSettings.text}
            </Button>
        );
    }

    renderSoundOutputPicker() {
        const { sounds } = this.state;

        return (
            <Grid item>
                <h3>Sounds: {this.renderSelectAll()}</h3>
                <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                        {this.state.parametersList.map((parameter) => (
                            <FormControlLabel
                                key={parameter.value}
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={sounds.includes(
                                            parameter.value
                                        )}
                                    />
                                }
                                onChangeCapture={this.handleParameterChange}
                                value={parameter.value}
                                label={parameter.label}
                                labelPlacement="bottom"
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </Grid>
        );
    }

    renderGithubLinks() {
        return (
            <Grid item xs container justify="flex-end">
                <Grid item>
                    <HoverIcon
                        text="View code on Github"
                        href={this.state.code_repo}
                    >
                        <SvgIcon>
                            <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
                        </SvgIcon>
                    </HoverIcon>
                </Grid>
                <Grid item>
                    <HoverIcon
                        text="User's guide"
                        href={this.state.users_guide}
                    >
                        <InfoIcon />
                    </HoverIcon>
                </Grid>
                <Grid item>
                    <HoverIcon
                        text="View original project"
                        href={this.state.reference}
                    >
                        <SvgIcon>
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 11.701c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701zm6 0c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701z" />
                        </SvgIcon>
                    </HoverIcon>
                </Grid>
            </Grid>
        );
    }

    renderInvokeButton() {
        return (
            <Grid item xs={12} style={{ textAlign: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.submitAction}
                    disabled={!this.canBeInvoked()}
                >
                    Invoke
                </Button>
            </Grid>
        );
    }

    renderAlertBoxHolder() {
        return (
            <Grid
                item
                xs={12}
                style={{ textAlign: "center" }}
                id={"alert-box-holder"}
            ></Grid>
        );
    }

    renderForm() {
        const { isInitialAudioRendered } = this.state;
        return (
            <Grid container direction="column" spacing={2}>
                {this.renderAudioUploader()}
                {this.renderInitialAudioContainer()}
                {isInitialAudioRendered && this.renderSoundOutputPicker()}
                {this.renderGithubLinks()}
                {this.renderInvokeButton()}
                {this.renderAlertBoxHolder()}
            </Grid>
        );
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    componentDidUpdate() {
        if (this.state.isFileUploaded && !this.state.isInitialAudioRendered) {
            const initialAudioContainer = document.getElementById(
                "initial-audio-container"
            );
            initialAudioContainer.innerHTML = "";
            this.renderInitialAudio(initialAudioContainer);
            this.setState({
                isInitialAudioRendered: true,
            });
        }
        if (
            this.props.isComplete &&
            this.state.isDataRead &&
            !this.state.isOutputAudiosRendered
        ) {
            const container = document.getElementById("audio-container");
            container.innerHTML = "";
            this.renderInitialAudio(container);
            this.renderOutputAudios(container);
            this.setState({
                isOutputAudiosRendered: true,
            });
        }
    }

    renderOutputAudios(container) {
        const { audioMap } = this.state;

        if (!audioMap) {
            throw new Error("Something went wrong...");
        }

        const soundKeys = Object.keys(audioMap);

        soundKeys.forEach((soundKey) => {
            const { audio } = this.createAudio(audioMap[soundKey].value);
            this.renderAudioTitle(
                container,
                this.capitalizeFirstLetter(audioMap[soundKey].key)
            );
            this.renderAudio(container, audio);
        });
    }

    createAudio(source, type = "audio/mp3") {
        const audioData = new Uint8Array(source);
        const audioBlob = new Blob([audioData], { type: type });
        const audioUrl = window.URL.createObjectURL(audioBlob);
        const audio = document.createElement("audio");
        audio.setAttribute("controls", "");
        audio.style.height = "50px";
        audio.style.width = "100%";
        audio.src = audioUrl;
        return { audio, data: audioData };
    }

    renderAudioTitle(container, titleText) {
        const title = document.createElement("p");
        title.innerText = titleText;
        title.style.fontSize = "18px";
        title.style.fontFamily = '"Muli", sans-serif';
        title.style.color = "rgba(0,0,0,.87)";
        title.style.margin = "15px 0 10px";
        container.appendChild(title);
    }

    renderAudio(container, audio) {
        container.appendChild(audio);
    }

    renderInitialAudio(container) {
        const { audio } = this.createAudio(this.state.data);
        this.renderAudioTitle(container, "Initial audio");
        this.renderAudio(container, audio);
    }

    render() {
        if (this.props.isComplete) {
            return <div id="audio-container" />;
        }
        return <div>{this.renderForm()}</div>;
    }
}
