import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";
import HoverIcon from "../../standardComponents/HoverIcon";
import OutlinedTextArea from "../../common/OutlinedTextArea";
import SNETImageUpload from "../../standardComponents/SNETImageUpload";
import { printedOCR } from "./ptr_pb_service";

export default class PrintedTextRecognition extends React.Component {
    constructor(props) {
        super(props);
        this.submitAction = this.submitAction.bind(this);
        this.getData = this.getData.bind(this);

        this.state = {
            image: {
                src: undefined,
                data: undefined,
                width: undefined,
                height: undefined,
                isValid: false
            },
            users_guide: "https://github.com/iktina/printed-text-recognition-service",
            code_repo: "https://github.com/iktina/printed-text-recognition-service",
            reference: "https://github.com/iktina/printed-text-recognition-service",
            maxFileSize: 10485760,
            showErrorBox: false
        };
    }

    submitAction() {
        const methodDescriptor = printedOCR["printedOCR"];
        const request = new methodDescriptor.requestType();

        request.setImgData(this.state.image.data);

        const props = {
            request,
            onEnd: response => {
                const { message, status, statusMessage } = response;
                if (status !== 0) {
                    throw new Error(statusMessage);
                }
                this.setState({
                    response: { result: message.getSentence() },
                });
            },
        };

        this.props.serviceClient.unary(methodDescriptor, props);
    }

    validateFileSize(size) {
        const { maxFileSize } = this.state;
        return size < maxFileSize && size > 0 ? true : false;
    }

    canBeInvoked() {
        if (!this.state.image.data && !this.state.image.isValid) return false;
        return true;
    }

    getData(imageData) {
        if (imageData) {
            this.setState({
                showErrorBox: false
            });

            var uint8data = imageData;

            var blob = new Blob([imageData]);

            var reader = new FileReader();

            reader.readAsDataURL(blob);
            reader.onload = () => {

                var isImageSizeValid = this.validateFileSize(uint8data.length);
                if (!isImageSizeValid) {
                    this.setState({
                        image: {
                            isValid: false
                        },
                        showErrorBox: true
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

                        this.setState({
                            image: {
                                src: base64src,
                                data: uint8data,
                                width: imageWidth,
                                height: imageHeight,
                                isValid: isImageSizeValid
                            }
                        });
                    }
                }
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <Grid container spacing={2} justify="center" alignItems="center">
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

                    {this.props.isComplete && (
                        <Grid item xs={12} container justify="center" style={{ textAlign: "center" }}>
                            <OutlinedTextArea
                                id="response_box"
                                name="response_box"
                                label="Recognized text"
                                type="text"
                                fullWidth={true}
                                value={this.state.response.result}
                                rows={8}
                            />
                        </Grid>
                    )}

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

                    {!this.props.isComplete && (
                        <Grid item xs={12} container justify="center" style={{ textAlign: "center" }}>
                            <Button variant="contained" color="primary" onClick={this.submitAction} disabled={!this.canBeInvoked()}>
                                Invoke
                            </Button>
                        </Grid>
                    )}

                    {this.state.showErrorBox && (
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
                            Please provide <b>PNG, JPG, JPEG </b>image file <b>up to 10 mb</b> in size!
                        </p>)

                    }
                </Grid>
            </React.Fragment>
        );
    }
}