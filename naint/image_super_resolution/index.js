import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";

import HoverIcon from "../../standardComponents/HoverIcon";
import OutlinedDropDown from "../../common/OutlinedDropdown";
import SNETImageUpload from "../../standardComponents/SNETImageUpload";

import { SR_GAN } from "./super_resolution_pb_service";

export default class ImageSuperResolution extends React.Component {
  constructor(props) {
    super(props);
    this.handleParameterChange = this.handleParameterChange.bind(this);
    this.submitAction = this.submitAction.bind(this);
    this.getData = this.getData.bind(this);

    this.state = {
      parametersList: [{
        label: "ESRGAN",
        value: 0,
      }, {
        label: "Real-ESRGAN",
        value: 1,
      }],
      selectedParameter: 1,
      users_guide: "https://github.com/iktina/super-resolution",
      code_repo: "https://github.com/iktina/super-resolution",
      reference: "https://github.com/iktina/super-resolution",
      response: undefined,
      renderred: false,
      image: {
        src: undefined,
        data: undefined,
        width: 0,
        height: 0,
      },
      isValid: {
        validMeta: false,
        validMinRequirements: false,
        validMaxRequirements: false,
      },
      showMinimumRequirementsErrorBox: false,
      showMaximumRequirementsErrorBox: false,
      showFileSizeErrorBox: false,
      restrictions: {
        minWidth: 100,
        minHeight: 100,
        maxWidth: 1200,
        maxHeight: 1200,
        maxSize: 2097152// 2mb
      }
    };
  }

  handleParameterChange(event) {
    let selectedOption = event.target.value
    this.setState({
      selectedParameter: selectedOption
    });
  }

  validateFileSize(size) {
    const { restrictions } = this.state;
    return size <= restrictions.maxSize && size > 0 ? true : false;
  }

  validateImageMeta(imageWidth, imageHeight) {
    return this.validateImageMinimumRequirements(imageWidth, imageHeight) && this.validateImageMaximumRequirements(imageWidth, imageHeight);
  }

  validateImageMinimumRequirements(imageWidth, imageHeight) {
    const { restrictions } = this.state;
    if (imageWidth >= restrictions.minWidth && imageHeight >= restrictions.minHeight) {
      this.setState({
        isValid: {
          validMinRequirements: true
        },
      });
      return true;
    }
    this.setState({
      showMinimumRequirementsErrorBox: true
    })
    return false;
  }

  validateImageMaximumRequirements(imageWidth, imageHeight) {
    const { restrictions } = this.state;
    if (imageWidth <= restrictions.maxWidth && imageHeight <= restrictions.maxHeight) {
      this.setState({
        isValid:{
          validMaxRequirements: true
        },
      });
      return true;
    }
    this.setState({
      showMaximumRequirementsErrorBox: true
    })
    return false;
  }

  canBeInvoked() {
    return this.state.isValid.validMeta;
  }

  getData(imageData) {
    if (imageData) {
      this.setState({
        isValid: {
          validMeta: false,
          validMinRequirements: false,
          validMAxRequirements: false
        },
        showMinimumRequirementsErrorBox: false,
        showMaximumRequirementsErrorBox: false,
        showFileSizeErrorBox: false
      });

      var uint8data = imageData;

      var blob = new Blob([imageData]);

      var reader = new FileReader();

      reader.readAsDataURL(blob);
      reader.onload = () => {

        var isImageSizeValid = this.validateFileSize(uint8data.length);
        if (!isImageSizeValid) {
          this.setState({
            showFileSizeErrorBox: true
          });
        } else {
          var imageWidth = 0;
          var imageHeight = 0;
          var dataurl = reader.result;
          var base64src = "data:image/jpeg;base64," + dataurl.substr(dataurl.indexOf(",") + 1);

          var img = document.createElement("img");
          img.src = window.URL.createObjectURL(blob);

          img.onload = () => {
            imageWidth = img.width;
            imageHeight = img.height;
            let isImageMetaValid = this.validateImageMeta(imageWidth, imageHeight);

            if (!isImageMetaValid) {
              return;
            }
            else {
              this.setState({
                image: {
                  src: base64src,
                  data: uint8data,
                  width: imageWidth,
                  height: imageHeight,
                },
                isValid: {
                  validMeta: true
                }
              });
            }
          }
        }
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
      onEnd: response => {
        const { message, status, statusMessage } = response;
        if (status !== 0) {
          throw new Error(statusMessage);
        }
        this.setState({
          response: {
            data: message.getOutputImg_asU8()
          },
        });
      },
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  renderForm() {
    return (
      <React.Fragment>

        <Grid container spacing={2} justify="flex-start">
          <Grid container spacing={2} justify="flex-start">
            <Grid item xs={8} container spacing={2}>
              <Grid item xs>
                <OutlinedDropDown
                  id="params"
                  name="params"
                  label="Model"
                  fullWidth={true}
                  list={this.state.parametersList}
                  value={this.state.selectedParameter}
                  onChange={this.handleParameterChange}
                />
              </Grid>
              <Grid item xs style={{ paddingRight: 0 }}>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} container justify="center">
            <SNETImageUpload
              style={{ align: "center" }}
              imageDataFunc={this.getData}
              imageName="Input"
              width="100%"
              disableUrlTab={true}
              disableComparisonTab={true}
              disableOutputTab={true}
              returnByteArray={true}
            />
          </Grid>


          <Grid item xs container justify="flex-end">
            <Grid item>
              <HoverIcon text="View code on Github" href={this.state.code_repo}>
                <SvgIcon>
                  <path // Github Icon
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

          <Grid item xs={12} container justify="center">
            <Button 
            variant="contained" 
            color="primary" 
            onClick={this.submitAction} 
            disabled={!this.canBeInvoked()} 
            style={{
              margin: 0,
              marginBottom: "15px"
              }}>
              Invoke
            </Button>
          </Grid>

          {!this.state.isValid.validMaxRequirements && !this.state.isValid.validMeta && this.state.showMaximumRequirementsErrorBox && (
            <p style={{
              color: "#212121",
              margin: "0 auto",
              borderColor: "#E67381",
              borderWidth: "1px",
              padding: "10px",
              background: "#FDE5E8",
              borderRadius: "4px",
              borderStyle: "solid",
              fontSize: "16px",
              textAlign: "center"
            }}>
              Please provide an <b>{this.state.restrictions.maxWidth + "px"} * {this.state.restrictions.maxHeight + "px"}</b> image!
            </p>)
          }

          {!this.state.isValid.validMinRequirements && !this.state.isValid.validMeta && this.state.showMinimumRequirementsErrorBox && (
            <p style={{
              color: "#212121",
              margin: "0 auto",           
              borderColor: "#E67381",
              borderWidth: "1px",
              padding: "10px",
              background: "#FDE5E8",
              borderRadius: "4px",
              borderStyle: "solid",
              fontSize: "16px",
              textAlign: "center"
            }}>
              Please provide an image at least <b>{this.state.restrictions.minWidth + "px"} * {this.state.restrictions.minHeight + "px"}</b>!
            </p>)
          }

          {!this.state.isValid.validMeta && this.state.showFileSizeErrorBox && (
            <p style={{
              color: "#212121",
              margin: "0 auto",
              borderColor: "#E67381",
              borderWidth: "1px",
              padding: "10px",
              background: "#FDE5E8",
              borderRadius: "4px",
              borderStyle: "solid",
              fontSize: "16px",
              textAlign: "center"
            }}>
              Image file size should not exceed <b>2mb</b>!
            </p>)
          }
        </Grid>
      </React.Fragment>
    );
  }

  openFullSizeImage() {
    var image = new Image();
    image.src = document.getElementById('image-container').getElementsByTagName('img')[0].getAttribute('src');
    var w = window.open("");
    w.document.write(image.outerHTML);
  }

  componentDidUpdate() {
    if (this.props.isComplete) {
      const { response } = this.state;
      const image = response.data

      var imageContainer = document.getElementById("image-container");
      imageContainer.style.display = "flex";
      imageContainer.style.alignItems = "center";
      imageContainer.style.justifyContent = "center";

      if (!this.state.renderred) {
        var blob = new Blob([image]);
        var picture = document.createElement("img");
        picture.style.width = "50%";
        picture.src = window.URL.createObjectURL(blob);
        imageContainer.appendChild(picture);
      }
      this.state.renderred = true;
    }
  }

  render() {
    if (this.props.isComplete) {
      return (
        <div>
          <p style={{
            padding: "0 10px",
            fontSize: "18px",
            fontWeight: "600",
            margin: "0 0 16px 0",
          }}>Result:</p>
          <Grid item xs container id="image-container">
          </Grid>
          <Grid item xs={12} container justify="center">
            <Button 
            variant="contained" 
            color="primary" 
            onClick={this.openFullSizeImage}
            style={{
              margin: 0,
              margin: "15px"
              }}>
              Open image in full size
            </Button>
          </Grid>
        </div>)
    }
    else {
      return <div>{this.renderForm()}</div>;
    }
  }
}
