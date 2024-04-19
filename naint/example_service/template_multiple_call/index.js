import React, { Component } from "react";
// import { YourService} from ./your_service_pb_service like example below
// EXAMPLE import { Calculator } from "./example_pb_service";
import { withStyles } from "@material-ui/styles";
import { useStyles } from "./styles";
import { informationBlocks, informationLinks } from "./meta";
import ServiceMainPage from "./ServiceMainPage";
import ServiceFinalPage from "./ServiceFinalPage";
import Grid from "@material-ui/core/Grid";
import SvgIcon from "@material-ui/core/SvgIcon";
import HoverIcon from "../../standardComponents/HoverIcon";

// rename CustomService to your own
class CustomService extends Component {
  constructor(props) {
    super(props);

    // bind all methods to the class context
    this.SourceIcons = this.SourceIcons.bind(this);
    // EXAMPLE
    // this.onActionEnd = this.onActionEnd.bind(this);
    // this.submitAction = this.submitAction.bind(this)

    // include meta
    this.informationBlocks = informationBlocks;
    this.informationLinks = informationLinks;

    // define variables in state
    this.state = {
      response: undefined,
    };
  }

  // when call is completed
  onActionEnd(response) {
    // get required data from response
    const { message, status, statusMessage } = response;
    // check for errors
    if (status !== 0) {
      throw new Error(statusMessage);
    }

    //set to the state
    this.setState({
      // EXAMPLE response: message.getValue(),
      response: {}, //use your own get Methods,
    });
  }

  // EXAMPLE submitAction(action, firstValue, secondValue) {
  submitAction() {
    // EXAMPLE const methodDescriptor = Calculator[action];
    const methodDescriptor = {}; //use your own MD
    const request = new methodDescriptor.requestType();

    // set your values using own set Methods
    // EXAMPLE request.setA(firstValue);
    // EXAMPLE request.setB(secondValue);

    // construct request
    const props = {
      request,
      // service will not finish if flag is true
      preventCloseServiceOnEnd: true,
      onEnd: this.onActionEnd,
    };

    //call the service
    this.props.serviceClient.unary(methodDescriptor, props);
  }

  // you should call this function manually in the end if preventing service close
  stopService() {
    this.props.serviceClient.stopService();
  }

  // render source links
  SourceIcons() {
    // get classes from props
    const { classes } = this.props;
    // get meta from class
    const { informationBlocks, informationLinks } = this;

    return (
      <Grid item xs container justify="flex-end">
        {Object.values(informationBlocks).map(informationBlock => (
          <Grid item key={informationBlock.key} className={classes.infoBlock}>
            <HoverIcon text={informationBlock.label} href={informationLinks[informationLinks.linkKey]}>
              <SvgIcon>
                <path d={informationBlock.svgPath} />
              </SvgIcon>
            </HoverIcon>
          </Grid>
        ))}
      </Grid>
    );
  }

  // render entire component
  render() {
    // get classes from props
    const { classes } = this.props;
    // get response from state
    const { response } = this.state;
    return (
      // apply classes to the container
      <Grid container className={classes.serviceContainer}>
        {/* if service is completed FINAL page will be displayed otherwise MAIN page */}
        {!this.props.isComplete ? (
          // React classes are used as Tags
          <ServiceMainPage
            // pass props and methods to the component
            onSubmitAction={this.submitAction}
            onStopService={this.stopService}
            response={response}
          />
        ) : (
          <ServiceFinalPage />
        )}
        {/* Class render functions are used like classic ones */}
        {this.SourceIcons()}
      </Grid>
    );
  }
}

// export your service with styles
export default withStyles(useStyles)(CustomService);
