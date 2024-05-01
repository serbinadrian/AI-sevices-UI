import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";
import { MODEL, BLOCKS, LABELS, defaultMetadata } from "./defaultMetadata";
import { image_generation } from "./neural_image_generation_pb_service";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import AlertBox, { alertTypes } from "../../../../components/common/AlertBox";
import SNETImageUpload from "../../standardComponents/SNETImageUpload";
import OutlinedTextArea from "../../common/OutlinedTextArea";
import OutlinedDropDown from "../../common/OutlinedDropdown";
import SvgIcon from "@material-ui/core/SvgIcon";
import HoverIcon from "../../standardComponents/HoverIcon";

const { textRestrictions, imageUploaderRestrictions, sliderRestrictions } = MODEL.restrictions;
const onlyLatinsRegex = new RegExp(textRestrictions.ONLY_LATINS_REGEX.value);

const OK_CODE = 0;
const SPACE = " ";
const SPACED_SLASH = " / ";

class NeuralImageGeneration extends React.Component {

    constructor(props) {
        super(props);
        const { state, metadataSource } = MODEL;

        this.state = state;
        this.handleInput = this.handleInput.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleChangeModel = this.handleChangeModel.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);

        this.loadMetadata(metadataSource);
        this.setupDevelopmentMode();

        console.clear();
    }

    setupDevelopmentMode() {
        const developmentModeToggler = () => {
            const { isDevMode } = this.state;

            this.setState({
                isDevMode: !isDevMode
            });

            const devModeStatus = this.state.isDevMode ? "Enabled" : "Disabled";
            return `Development mode is ${devModeStatus}`;
        };
        window.toggleDevelopmentMode = developmentModeToggler;
    }

    checkMetadata(meta) {
        if (!meta.type || !meta.version) {
            const message = "Invalid metadata provided";
            throw new Error(message);
        }
        console.info(`The loaded metadata type is ${meta.type}, version ${meta.version}`);
    }

    setMetadata(meta) {
        this.setState({
            meta: meta,
            models: meta.models,
            style: meta.styles[0].value,
            styles: meta.styles,
            model: meta.models[0].value,
            modelsSettings: meta.modelsSettings,
            service: meta.modelsDefaultValues[meta.models[0].value],
            modelsDefaultValues: meta.modelsDefaultValues,
            modelElemetsUsage: meta.modelsSettings[meta.models[0].value].modelElemetsUsage,
        });
    }

    async loadMetadata(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
            }
            const meta = JSON.parse(await response.text());
            this.checkMetadata(meta);
            this.setMetadata(meta);
        }
        catch (error) {
            console.error(error);
            this.checkMetadata(defaultMetadata);
            this.setMetadata(defaultMetadata);
        }
    }

    isOk(status) {
        return status === OK_CODE;
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
        const { service } = MODEL;
        const {
            isPrompt,
            isNegativePromt,
            isImageInput,
            isStyleSelect,
            isSeedSlider,
            isNumberOfImagesSlider,
            isStepsSlider,
            isGuidanceScaleSlider,
            isHeightSlider,
            isWidthSlider,
        } = this.state.modelElemetsUsage;
        const {
            model,
            prompt,
            negativePromt,
            image,
            style,
            seed,
            numberOfImages,
            steps,
            guidanceScale,
            height,
            width,
        } = this.state.service;
        const methodDescriptor = image_generation[service.METHOD];
        const request = new methodDescriptor.requestType();


        request.setModel(model);
        isStyleSelect && request.setPromptStyle(style);
        isImageInput && request.setImage(image.data);
        isPrompt && request.setSentence(prompt);
        isNegativePromt && request.setNegativePrompt(negativePromt);
        isNumberOfImagesSlider && request.setNImages(numberOfImages);
        isSeedSlider && request.setSeedval(seed);
        isStepsSlider && request.setSteps(steps);
        isGuidanceScaleSlider && request.setGuidanceScale(guidanceScale);
        isHeightSlider && request.setH(height);
        isWidthSlider && request.setW(width);

        const props = {
            request,
            onEnd: (response) => this.parseResponse(response),
        };

        this.props.serviceClient.unary(methodDescriptor, props);
    }

    canBeInvoked() {
        const { isValid, errors } = this.state.status;
        const { prompt, validSize, validDimentions } = isValid;
        const { isPrompt, isImageInput } = this.state.modelElemetsUsage;

        let validationStatus = true;

        if (isPrompt) {
            validationStatus = validationStatus && prompt;
        }
        if (isImageInput) {
            const imageValidity = validSize && validDimentions;
            validationStatus = validationStatus && imageValidity;
        }

        return validationStatus && errors.size === 0;
    }

    handleChangeModel(event) {
        const { modelsSettings, modelsDefaultValues } = this.state;
        const selectedValue = event.target.value;
        const selectedSettings = modelsSettings[selectedValue].modelElemetsUsage;

        this.setState({
            modelElemetsUsage: selectedSettings,
            service: modelsDefaultValues[selectedValue],
        });
    }

    handleInput(event) {
        const { service } = this.state;

        const targetName = event.target.name;
        const targetValue = event.target.value;

        this.validateInput(targetValue, targetName);

        service[targetName] = targetValue;

        this.setState({
            service: service
        });
    }

    handleValueChange(event) {
        const { service } = this.state;

        service[event.target.name] = event.target.value;

        this.setState({
            service: service
        });
    }

    handleSliderChange(stateKey, value) {
        const { service } = this.state;

        service[stateKey] = value;

        this.setState({
            service: service,
        });
    }

    getErrorMessageByKey(errorKey) {
        const { errors } = LABELS;

        return errors[errorKey];
    }

    isValidInput(regex, text) {
        return regex.test(text);
    }

    validateInput(targetValue, targetName) {
        const { errorKey } = textRestrictions.ONLY_LATINS_REGEX[targetName];

        const isInputValid = this.isValidInput(onlyLatinsRegex, targetValue);
        this.manageError(isInputValid, errorKey);
        this.setValidationStatus(targetName, isInputValid);
    }

    resetImageUploader() {
        const { status } = this.state;
        status.isValid.validSize = false;
        status.isValid.validDimentions = false;

        this.setState({
            status: status
        });
    }

    keepImage(data, src) {
        const { service } = this.state;

        const image = {
            src: src,
            data: data,
        };

        service.image = image;

        this.setState({
            service: service
        });
    }

    validateImageSize(image) {
        const { minSize, maxSize, errorKey } = imageUploaderRestrictions.FILE_UPLOADER.size;

        const imageSize = image.size;

        const isImageSizeGreaterThanMinimal = imageSize >= minSize;
        const isImageSizeLessThanMaximum = imageSize <= maxSize;

        const isImageSizeValid = isImageSizeGreaterThanMinimal && isImageSizeLessThanMaximum;

        this.manageError(isImageSizeValid, errorKey);
        this.setValidationStatus("validSize", isImageSizeValid);
    }

    validateImageDimentions(image) {

        const { minDimentions, maxDimentions } = imageUploaderRestrictions.FILE_UPLOADER;

        const { minWidth, minHeight, errorKey: minDimentionsErrorKey } = minDimentions;
        const { maxHeight, maxWidth, errorKey: maxDimentionsErrorKey } = maxDimentions;

        const imageWidth = image.width;
        const imageHeight = image.height;

        const isImageMinimalDimentionsValid =
            imageHeight >= minHeight &&
            imageWidth >= minWidth;

        const isImageMaximumDimentionsValid =
            imageHeight <= maxHeight &&
            imageWidth <= maxWidth;

        const isImageDimentionsValid =
            isImageMinimalDimentionsValid &&
            isImageMaximumDimentionsValid;

        this.manageError(isImageMinimalDimentionsValid, minDimentionsErrorKey);
        this.manageError(isImageMaximumDimentionsValid, maxDimentionsErrorKey);

        this.setValidationStatus("validDimentions", isImageDimentionsValid);
    }

    validateImage(image) {
        image.onload = () => {
            this.validateImageSize(image);
            this.validateImageDimentions(image);
        }
    }

    createImageObject(imageData) {
        const image = document.createElement("img");

        const blob = new Blob([imageData]);
        image.size = blob.size;
        image.src = URL.createObjectURL(blob);

        return image;
    }

    handleImageUpload(imageData) {
        if (!imageData) {
            return;
        }
        this.resetImageUploader();
        const image = this.createImageObject(imageData);
        this.validateImage(image);
        this.keepImage(image, image.src);
    }

    setValidationStatus(property, value) {
        const { status } = this.state;
        status.isValid[property] = value;

        this.setState({
            status: status,
        });
    }

    manageError(condition, errorKey) {
        const { status } = this.state;
        const { errors } = status;

        if (!condition) {
            const errorMessage = this.getErrorMessageByKey(errorKey);
            errors.set(errorKey, errorMessage);
        } else {
            errors.delete(errorKey);
        }

        status.errors = errors;

        this.setState({
            status: status
        });
    }

    inputMaxLengthHelperFunction(textLengthValue) {
        const { labels } = LABELS;

        return (
            textLengthValue +
            SPACED_SLASH +
            textRestrictions.ONLY_LATINS_TEXT_LENGTH.max +
            SPACE +
            labels.CHARS
        );
    }

    renderServiceParameters() {
        return;
    }

    parseImagesResponse() {
        const { response } = this.state;

        if(!response) {
            return;
        }

        return JSON.parse(response.data)?.images;
    }

    createImageSrc(image) {
        const bytes = atob(image);
        const byteNumbers = new Array(bytes.length);

        for (let i = 0; i < bytes.length; i++) {
            byteNumbers[i] = bytes.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        // const blob = new Blob([byteArray], { type: "image/jpg" });
        const blob = new Blob([byteArray]);
        return URL.createObjectURL(blob);
    }

    openImageInNewtabButton(src) {
        const { labels } = LABELS;
        const { classes } = this.props;
        
        return (
            <span className={classes.newTabImageButton} onClick={() => this.openImageInNewTab(src)}>
                {labels.OPEN_IMAGE_BUTTON}
            </span>
        )
    }

    openImageInNewTab(src) {        
        const image = new Image();
        image.src = src;
        window.open("").document.write(image.outerHTML);
    }

    downloadImageButton(src) {
        const { labels } = LABELS;
        const { classes } = this.props;
        const classList = `${classes.newTabImageButton} ${classes.downloadButton}`;

        return (
            <span className={classList} onClick={() => this.downloadImage(src)}>
                {labels.DOWNLOAD_BUTTON}
            </span>
        )
    }

    downloadImage( src ) {
        const link = document.createElement("a");
        const additionalImageName = "result";
        link.href = src;
        link.download = `NaintImageGenerationService_${additionalImageName}`;
        link.click();
    }

    renderImage(src) {
        const { classes } = this.props;

        if(!src) {
            return;
        }

        return (
            <div className={classes.imageContainer}>
                <img src={src} alt="Imgen data"/>
                {this.openImageInNewtabButton(src)}
                {this.downloadImageButton(src)}
            </div>
        )
    }

    renderImages(images) {
        if(!images){
            return;
        }

        return images.map(image => {
            const src = this.createImageSrc(image);
            return this.renderImage(src);
        })
    }

    renderInputImage(src) {
        const { classes } = this.props;

        return (
            <div className={classes.imagesContainer}>
                {this.renderImage(src)}
            </div>
        )
    }

    renderTitle(title) {
        return(        
        <h2>
            {}
        </h2>
        );
    }

    renderResponseImages() {
        const { classes } = this.props;

        const images = this.parseImagesResponse();

        return (
                <div className={classes.imagesContainer}>
                    {this.renderImages(images)}
                </div>
        )
    }

    renderTextInput(BLOCK) {
        const { labels } = LABELS;
        const { service } = this.state;

        const inputLength = service[BLOCK.stateKey].length;

        return (
            <Grid item xs={12} container justify="center">
                <OutlinedTextArea
                    fullWidth={true}
                    id={BLOCK.id}
                    name={BLOCK.name}
                    rows={BLOCK.rows}
                    label={labels[BLOCK.labelKey]}
                    value={service[BLOCK.stateKey]}
                    helperTxt={BLOCK.edit ? this[BLOCK.helperFunctionKey](inputLength) : null}
                    onChange={BLOCK.edit ? this[BLOCK.handleFunctionKey] : null}
                    charLimit={BLOCK.edit ? textRestrictions.ONLY_LATINS_TEXT_LENGTH.max : 0}
                />
            </Grid>
        )
    }

    renderImageInput(BLOCK) {
        const { classes } = this.props;
        return (
            <Grid item xs={12} container justify="center" className={classes.imageUpload}>
                <SNETImageUpload
                    width="100%"
                    id={BLOCK.id}
                    imageDataFunc={this[BLOCK.handleFunctionKey]}
                    imageName={BLOCK.imageName}
                    disableUrlTab={BLOCK.disableUrlTab}
                    disableComparisonTab={BLOCK.disableComparisonTab}
                    disableOutputTab={BLOCK.disableOutputTab}
                    returnByteArray={BLOCK.returnByteArray}
                />
            </Grid>
        )
    }

    renderSlider(BLOCK) {
        const { classes } = this.props;
        const { labels } = LABELS;
        const { service } = this.state;

        const restrictions = sliderRestrictions[BLOCK.restrictionsKey];
        return (
            <Grid item xs={12} className={classes.progressBarContainer}>
                <Grid item xs={12} sm={12} md={2} lg={2}>
                    <span className={classes.sliderTitle}>
                        {labels[BLOCK.labelKey]}
                    </span>
                </Grid>
                <Grid item xs={12} sm={12} md={10} lg={10} className={classes.sliderContainer}>
                    <span className={classes.startEndNumber}>
                        {restrictions.min}
                    </span>
                    <Slider
                        id={BLOCK.id}
                        name={BLOCK.name}
                        value={service[BLOCK.stateKey]}
                        max={restrictions.max}
                        min={Number(restrictions.min)}
                        step={restrictions.step}
                        onChange={(e, value) => this[BLOCK.handleFunctionKey](BLOCK.stateKey, value)}
                        valueLabelDisplay={BLOCK.valueLabelDisplay}
                        aria-labelledby={BLOCK.ariaLabelLedBy}
                    />
                    <span className={classes.startEndNumber}>
                        {restrictions.max}
                    </span>
                </Grid>
            </Grid>
        );
    }

    renderSelect(BLOCK) {
        const { service } = this.state;
        return (
            <Grid item xs={5} container width={100}>
                <OutlinedDropDown
                    fullWidth={true}
                    id={BLOCK.id}
                    name={BLOCK.name}
                    label={BLOCK.labelKey}
                    list={this.state[BLOCK.parametersListKey]}
                    value={service[BLOCK.stateKey]}
                    onChange={this[BLOCK.handleFunctionKey]}
                />
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

    renderServiceInput() {
        const {
            isPrompt,
            isNegativePromt,
            isImageInput,
            isStyleSelect,
            isSeedSlider,
            isNumberOfImagesSlider,
            isStepsSlider,
            isGuidanceScaleSlider,
            isHeightSlider,
            isWidthSlider,
        } = this.state.modelElemetsUsage;
        const { inputBlocks } = BLOCKS;
        const { isDevMode } = this.state;
        const { errors } = this.state.status;

        return (
            <Grid item xs={12} container>
                {this.renderSelect(inputBlocks.MODEL_SELECT)}
                {isStyleSelect && this.renderSelect(inputBlocks.STYLE_SELECT)}
                {isImageInput && this.renderImageInput(inputBlocks.IMAGE_INPUT)}
                {isPrompt && this.renderTextInput(inputBlocks.PROMT_INPUT)}
                {isNegativePromt && this.renderTextInput(inputBlocks.NEGATIVE_PROMT_INPUT)}
                {isNumberOfImagesSlider && this.renderSlider(inputBlocks.NUMBER_OF_IMAGES_SLIDER)}
                {isSeedSlider && this.renderSlider(inputBlocks.SEED_SLIDER)}
                {isStepsSlider && this.renderSlider(inputBlocks.STEPS_SLIDER)}
                {isDevMode && isGuidanceScaleSlider && this.renderSlider(inputBlocks.GUIDANCE_SCALE_SLIDER)}
                {isDevMode && isHeightSlider && this.renderSlider(inputBlocks.HEIGHT_SLIDER)}
                {isDevMode && isWidthSlider && this.renderSlider(inputBlocks.WIDTH_SLIDER)}
                {this.renderInvokeButton()}
                {this.renderInfoBlock()}
                {errors.size > 0 && this.renderValidationStatusBlocks(errors)}
            </Grid>
        );
    }

    renderServiceOutput() {
        const {
            isPrompt,
            isNegativePromt,
            isImageInput
        } = this.state.modelElemetsUsage;
        const { response, service } = this.state;
        const { outputBlocks } = BLOCKS;
        const { status, labels } = LABELS;

        if (!response) {
            return <h4>{status.NO_RESPONSE}</h4>;
        }
        
        return (
            <Grid item xs={12} container>
                {this.renderTitle(labels.INPUT)}

                {isImageInput && this.renderInputImage(service.image?.src)}
                {isPrompt && this.renderTextInput(outputBlocks.PROMT_OUTPUT)}
                {isNegativePromt && this.renderTextInput(outputBlocks.NEGATIVE_PROMT_OUTPUT)}
                {this.renderServiceParameters()}

                {this.renderTitle(labels.RESULT)}

                {this.renderResponseImages()}
                {this.renderInfoBlock()}
            </Grid>
        );
    }

    renderLoadingMetaMessage() {
        return (<h2> LOADING...</h2>);
    }

    render() {
        if (!this.state.meta) {
            return this.renderLoadingMetaMessage();
        }
        if (!this.props.isComplete) {
            return this.renderServiceInput();
        }
        return this.renderServiceOutput();
    }
}

export default withStyles(useStyles)(NeuralImageGeneration);