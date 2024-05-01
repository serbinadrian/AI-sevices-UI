import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import HoverIcon from "../../standardComponents/HoverIcon";
import OutlinedDropDown from "../../common/OutlinedDropdown";
import SNETImageUpload from "../../standardComponents/SNETImageUpload";
import AlertBox, { alertTypes } from "../../../../components/common/AlertBox";
import { MODEL, BLOCKS, LABELS } from "./metadata";
import SR_GAN from "./image_super_resolution_pb_service";
import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";

// const EMPTY_STRING = "";
// const OK_CODE = 0;

const { imageUploaderRestrictions } = MODEL.restrictions;

const IMAGE_CONTAINER_CLASS = "image-container";

class ImageSuperResolution extends React.Component {
  constructor(props) {
    const { state } = MODEL;
    super(props);
    this.handleDropDownParameterChange = this.handleDropDownParameterChange.bind(
      this
    );
    this.submitAction = this.submitAction.bind(this);
    this.getData = this.getData.bind(this);
    this.validateFileSize = this.validateFileSize.bind(this);

    this.state = state;
  }

  handleDropDownParameterChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  getErrorMessageByKey(errorKey) {
    const { errors } = LABELS;

    return errors[errorKey];
  }

  validateImageSize(image) {
    const {
      minSize,
      maxSize,
      errorKey,
    } = imageUploaderRestrictions.FILE_UPLOADER.size;

    const imageSize = image.size;

    const isImageSizeGreaterThanMinimal = imageSize >= minSize;
    const isImageSizeLessThanMaximum = imageSize <= maxSize;

    const isImageSizeValid =
      isImageSizeGreaterThanMinimal && isImageSizeLessThanMaximum;

    this.manageError(isImageSizeValid, errorKey);
    this.setValidationStatus("validSize", isImageSizeValid);
  }

  validateImageDimentions(image) {
    const {
      minDimentions,
      maxDimentions,
    } = imageUploaderRestrictions.FILE_UPLOADER;

    const {
      minWidth,
      minHeight,
      errorKey: minDimentionsErrorKey,
    } = minDimentions;
    const {
      maxHeight,
      maxWidth,
      errorKey: maxDimentionsErrorKey,
    } = maxDimentions;

    const imageWidth = image.width;
    const imageHeight = image.height;

    const isImageMinimalDimentionsValid =
      imageHeight >= minHeight && imageWidth >= minWidth;

    const isImageMaximumDimentionsValid =
      imageHeight <= maxHeight && imageWidth <= maxWidth;

    const isImageDimentionsValid =
      isImageMinimalDimentionsValid && isImageMaximumDimentionsValid;

    this.manageError(isImageMinimalDimentionsValid, minDimentionsErrorKey);
    this.manageError(isImageMaximumDimentionsValid, maxDimentionsErrorKey);

    this.setValidationStatus("validDimentions", isImageDimentionsValid);
  }

  validateImage(image) {
    image.onload = () => {
      this.validateImageSize(image);
      this.validateImageDimentions(image);
    };
  }

  canBeInvoked() {
    const { status, selectedModelParameter } = this.state;
    const { isAllRequirementsMet } = status;

    return selectedModelParameter && isAllRequirementsMet;
  }

  clearState() {
    this.setState({
      status: {
        isAllRequirementsMet: false,
        errors: new Map(),
      },
    });
  }

  createImage(blob, reader, uint8data) {
    const dataUrl = reader.result;
    const base64src =
      "data:image/jpeg;base64," + dataUrl.substr(dataUrl.indexOf(",") + 1);
    const img = document.createElement("img");
    img.src = window.URL.createObjectURL(blob);

    img.onload = () => {
      const imageWidth = img.width;
      const imageHeight = img.height;
      this.validateImage(img);

      this.setState({
        image: {
          src: base64src,
          data: uint8data,
          width: imageWidth,
          height: imageHeight,
        },
      });
    };
  }

  getData(uint8data) {
    const { isAllRequirementsMet } = this.state.status;
    if (uint8data) {
      this.clearState();

      this.validateFileSize(uint8data.length);

      if (isAllRequirementsMet) {
        const blob = new Blob([uint8data], { type: "image/jpg" });
        const reader = new FileReader();

        reader.readAsDataURL(blob);
        reader.onload = () => {
          this.createImage(blob, reader, uint8data);
        };
      }
    }
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

        openImageInNewTabButton.addEventListener(
          "click",
          this.openImageInNewTab
        );
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

  submitAction() {
    const { image, selectedParameter } = this.state;
    const methodDescriptor = SR_GAN["SR"];
    const request = new methodDescriptor.requestType();

    request.setImage(image.data);
    request.setType(selectedParameter);

    const props = {
      request,
      onEnd: (response) => {
        const { message, status, statusMessage } = response;
        if (status !== 0) {
          throw new Error(statusMessage);
        }
        this.setState({
          response: {
            data: message.getOutputImg_asU8(),
          },
        });
      },
    };

    this.props.serviceClient.unary(methodDescriptor, props);
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

  renderImageUpload() {
    const { classes } = this.props;
    const { IMAGE_UPLOADER } = BLOCKS.inputBlocks;
    const { labels } = LABELS;

    return (
      <Grid item xs={12} container justify="center">
        <SNETImageUpload
          className={classes.imageUploader}
          imageDataFunc={this.getData}
          imageName={labels[IMAGE_UPLOADER.label]}
          width={IMAGE_UPLOADER.width}
          disableUrlTab={true}
          disableComparisonTab={true}
          disableOutputTab={true}
          returnByteArray={true}
        />
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

  openFullSizeImage() {
    var image = new Image();
    image.src = document
      .getElementById("image-container")
      .getElementsByTagName("img")[0]
      .getAttribute("src");
    var w = window.open("");
    w.document.write(image.outerHTML);
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
        {this.renderImageUpload()}
        {this.renderInfoBlock()}
        {this.renderInvokeButton()}
        {errors.size ? this.renderValidationStatusBlocks(errors) : null}
      </Grid>
    );
  }

  renderServiceOutput() {
    const { response } = this.state;
    const { status } = LABELS;

    if (!response) {
      return <h4>{status.NO_RESPONSE}</h4>;
    }

    return (
      <Grid container direction="column" justify="center">
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

export default withStyles(useStyles)(ImageSuperResolution);
