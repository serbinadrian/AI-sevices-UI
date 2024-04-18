import React, { Component, Fragment } from "react";
import { calculatorActions } from ".";
import { withStyles } from "@material-ui/styles";
import { useStyles } from "./styles";
import ServiceErrors from "./errors";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import OutlinedTextArea from "../../common/OutlinedTextArea";

class ServiceMainPage extends Component {
  constructor(props) {
    super(props);

    this.setError = this.setError.bind(this);
    this.deleteError = this.deleteError.bind(this);
    this.isAvailableToRun = this.isAvailableToRun.bind(this);
    this.isInputValueValid = this.isInputValueValid.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    this.state = {
      firstValue: "",
      secondValue: "",
      errors: new Map(),
    };

    this.valuesInputs = [
      {
        label: "First value",
        valueKey: "firstValue",
      },
      {
        label: "Second value",
        valueKey: "secondValue",
      },
    ];

    this.actionButtons = [
      {
        action: calculatorActions.ADD,
        text: "ADD",
      },
      {
        action: calculatorActions.SUBTRACT,
        text: "SUBTRACT",
      },
      {
        action: calculatorActions.MULTIPLY,
        text: "MULTIPLY",
      },
      {
        action: calculatorActions.DIVIDE,
        text: "DIVIDE",
      },
    ];
  }

  setError(errorKey, errorMessage) {
    const { errors } = this.state;
    errors.set(errorKey, errorMessage);

    this.setState({
      errors: errors,
    });
  }

  deleteError(errorKey) {
    const { errors } = this.state;
    errors.delete(errorKey);

    this.setState({
      errors: errors,
    });
  }

  isAvailableToRun() {
    const { firstValue, secondValue, errors } = this.state;
    return firstValue !== "" && secondValue !== "" && errors.size == 0;
  }

  isInputValueValid(value) {
    return (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) && !isNaN(value);
  }

  onValueChange(event) {
    const { value, name: stateKey } = event.target;

    if (!this.isInputValueValid(value)) {
      this.setError("invalidInput", "The provided values must be numbers");
    } else {
      this.deleteError("invalidInput");
    }

    this.setState({
      [stateKey]: value,
    });
  }

  StopServiceButton() {
    const { onStopService } = this.props;
    return <Button type="text" onClick={onStopService}>Finish</Button>
  }

  InputFields() {
    const { valuesInputs } = this;
    const { classes } = this.props;

    return (
      <Fragment>
        <h2>Input values</h2>
        <div className="input-values">
          {valuesInputs.map(valueInput => (
            <OutlinedTextArea
              label={valueInput.label}
              value={this.state[valueInput.valueKey]}
              name={valueInput.valueKey}
              onChange={this.onValueChange}
            />
          ))}
        </div>
      </Fragment>
    );
  }

  ActionButtons() {
    const { actionButtons } = this;
    const { classes, onSubmitAction } = this.props;
    const { firstValue, secondValue } = this.state;

    return (
      <Fragment>
        <h2>Actions</h2>
        <div className="action-buttons">
          {actionButtons.map(actionButton => (
            <Button
              variant="contained"
              key={actionButton.action}
              className={classes.serviceButton}
              onClick={() => onSubmitAction(actionButton.action, firstValue, secondValue)}
              disabled={!this.isAvailableToRun}
            >
              {actionButton.text}
            </Button>
          ))}
        </div>
      </Fragment>
    );
  }

  ResultField() {
    const { response, classes } = this.props;

    return (
      <Fragment>
        {response && (
          <div className="calculation-result">
            <h2>Result</h2>
            <OutlinedTextArea label="Result Value" value={response}></OutlinedTextArea>
          </div>
        )}
      </Fragment>
    );
  }

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    return (
      <Fragment>
        <div className={classes.serviceMainPage}>
          {this.InputFields()}
          {this.ActionButtons()}
          {this.ResultField()}
        </div>
        <ServiceErrors errors={errors} />
      </Fragment>
    );
  }
}

export default withStyles(useStyles)(ServiceMainPage);
