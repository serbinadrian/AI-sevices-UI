import React, { Component, Fragment } from "react";
import { valuesInputs, actionButtons } from "./meta";
import { withStyles } from "@material-ui/styles";
import { useStyles } from "./styles";
import ServiceErrors from "./ServiceErrors";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import OutlinedTextArea from "../../common/OutlinedTextArea";

class ServiceMainPage extends Component {
  constructor(props) {
    super(props);

    this.setError = this.setError.bind(this);
    this.deleteError = this.deleteError.bind(this);
    this.isAvailableToRun = this.isAvailableToRun.bind(this);
    this.isInputValueValid = this.isInputValueValid.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.ResultField = this.ResultField.bind(this);

    this.valuesInputs = valuesInputs;
    this.actionButtons = actionButtons;

    this.state = {
      firstValue: "",
      secondValue: "",
      errors: new Map(),
    };
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

  ServiceExit() {
    const { onStopService, classes } = this.props;
    return (
      <Grid container className={classes.exitContainer}>
        <Button onClick={onStopService} variant="text" className={classes.serviceButton}>
          EXIT
        </Button>
      </Grid>
    );
  }

  InputFields() {
    const { valuesInputs } = this;
    const { classes } = this.props;

    return (
      <Grid container className={classes.contentBox}>
        <Typography variant="h2">Input values</Typography>
        <Grid container direction="column" className="input-values">
          {valuesInputs.map(valueInput => (
            <Grid item>
              <OutlinedTextArea
                label={valueInput.label}
                value={this.state[valueInput.valueKey]}
                name={valueInput.valueKey}
                onChange={this.onValueChange}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }

  ActionButtons() {
    const { actionButtons } = this;
    const { classes, onSubmitAction } = this.props;
    const { firstValue, secondValue } = this.state;

    return (
      <Grid container className={classes.contentBox}>
        <Typography variant="h2">Actions</Typography>
        <Grid container className="action-buttons">
          {actionButtons.map(actionButton => (
            <Button
              variant="contained"
              key={actionButton.action}
              className={classes.serviceButton}
              onClick={() => onSubmitAction(actionButton.action, firstValue, secondValue)}
              disabled={!this.isAvailableToRun()}
            >
              {actionButton.text}
            </Button>
          ))}
        </Grid>
      </Grid>
    );
  }

  ResultField() {
    const { response, classes } = this.props;

    return (
      <Grid container className={classes.contentBox}>
        {response !== undefined && (
          <Fragment>
            <Typography variant="h2">Result</Typography>
            <Grid container direction="column" className="calculation-result">
              <Grid item>
                <OutlinedTextArea label="Result Value" value={response}></OutlinedTextArea>
              </Grid>
            </Grid>
          </Fragment>
        )}
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    return (
      <Fragment>
        <Grid container className={classes.serviceMainPage}>
          {this.ServiceExit()}
          {this.InputFields()}
          {this.ActionButtons()}
          {this.ResultField()}
        </Grid>
        <ServiceErrors errors={errors} />
      </Fragment>
    );
  }
}

export default withStyles(useStyles)(ServiceMainPage);
