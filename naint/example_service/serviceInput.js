import React, { Component } from "react";
import { isNumber } from "lodash";
import { calculatorActions } from ".";

class ServiceInput extends Component {
  constructor(props) {
    super(props);

    this.isAvailableToRun = this.isAvailableToRun.bind(this);
    this.isInputValueValid = this.isInputValueValid.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    this.state = {
      firstValue: undefined,
      secondValue: undefined,
    };
  }

  isAvailableToRun() {
    return !!this.state.firstValue && !!this.state.secondValue;
  }

  isInputValueValid(value) {
    return isNumber(value);
  }

  onValueChange(event) {
    const { value, name: stateKey } = event.target;

    if (!this.isInputValueValid(value)) {
      //
    }

    this.setState({
      [stateKey]: value,
    });
  }

  render() {
    const { firstValue, secondValue } = this.state;
    const { response } = this.props;

    return (
      <div>
        <input value={this.state.firstValue} name="firstValue" onChange={this.onValueChange} />
        <input value={this.state.secondValue} name="secondValue" onChange={this.onValueChange} />
        <button
          onClick={() => this.props.onSubmitAction(calculatorActions.ADD, firstValue, secondValue)}
          disabled={!this.isAvailableToRun}
        >
          ADD
        </button>
        <button
          onClick={() => this.props.onSubmitAction(calculatorActions.SUBTRACT, firstValue, secondValue)}
          disabled={!this.isAvailableToRun}
        >
          SUB
        </button>
        <button
          onClick={() => this.props.onSubmitAction(calculatorActions.MULTIPLY, firstValue, secondValue)}
          disabled={!this.isAvailableToRun}
        >
          MUL
        </button>
        <button
          onClick={() => this.props.onSubmitAction(calculatorActions.DIVIDE, firstValue, secondValue)}
          disabled={!this.isAvailableToRun}
        >
          DIV
        </button>
        {response && <output>{response}</output>}
      </div>
    );
  }
}

export default ServiceInput;
