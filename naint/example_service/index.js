import React, { Component } from "react";
import { Calculator } from "./example_pb_service";
import ServiceInput from "./serviceInput";
import ServiceOutput from "./serviceOutput";

export const calculatorActions = {
  ADD: "add",
  SUBTRACT: "sub",
  MULTIPLY: "mul",
  DIVIDE: "div",
};

class ExampleService extends Component {
  constructor(props) {
    super(props);

    this.onActionEnd = this.onActionEnd.bind(this);
    this.submitAction =  this.submitAction.bind(this);
    this.stopService = this.stopService.bind(this);

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

  render() {
    if (!this.props.isComplete) {
      return (
        <ServiceInput
          onSubmitAction={this.submitAction}
          onstopService={this.stopService}
          response={this.state.response}
        />
      );
    }
    return <ServiceOutput />;
  }
}

export default ExampleService;
