import React, { Component } from "react";
import { Calculator } from "./example_pb_service";
import { withStyles } from "@material-ui/styles";
import { useStyles } from "./styles";
import { informationBlocks, informationLinks } from "./meta";
import ServiceMainPage from "./ServiceMainPage";
import ServiceFinalPage from "./ServiceFinalPage";
import Grid from "@material-ui/core/Grid";
import SvgIcon from "@material-ui/core/SvgIcon";
import HoverIcon from "../../standardComponents/HoverIcon";

class ExampleService extends Component {
  constructor(props) {
    super(props);

    this.onActionEnd = this.onActionEnd.bind(this);
    this.submitAction = this.submitAction.bind(this);
    this.stopService = this.stopService.bind(this);
    this.SourceIcons = this.SourceIcons.bind(this);

    this.informationBlocks = informationBlocks;
    this.informationLinks = informationLinks;

    this.state = {
      response: undefined,
    };
  }

  onActionEnd(response) {
    const { message, status, statusMessage } = response;
    if (status !== 0) {
      throw new Error(statusMessage);
    }

    this.setState({
      response: message.getValue(),
    });
  }

  submitAction(action, firstValue, secondValue) {
    const methodDescriptor = Calculator[action];
    const request = new methodDescriptor.requestType();

    request.setA(firstValue);
    request.setB(secondValue);

    const props = {
      request,
      preventCloseServiceOnEnd: true,
      onEnd: this.onActionEnd,
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  stopService() {
    this.props.serviceClient.stopService();
  }

  SourceIcons() {
    const { classes } = this.props;
    const { informationBlocks, informationLinks } = this;

    return (
      <Grid item xs container justify="flex-end">
        {Object.values(informationBlocks).map((informationBlock) => (
          <Grid item key={informationBlock.key} className={classes.infoBlock}>
            <HoverIcon
              text={informationBlock.label}
              href={informationLinks[informationLinks.linkKey]}
            >
              <SvgIcon>
                <path d={informationBlock.svgPath} />
              </SvgIcon>
            </HoverIcon>
          </Grid>
        ))}
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.serviceContainer}>
        {!this.props.isComplete ? (
          <ServiceMainPage
            onSubmitAction={this.submitAction}
            onStopService={this.stopService}
            response={this.state.response}
          />
        ) : (
          <ServiceFinalPage />
        )}
        {this.SourceIcons()}
      </Grid>
    );
  }
}

export default withStyles(useStyles)(ExampleService);
