import React, { Component, Fragment } from "react";
import { valuesInputs, actionButtons } from "./meta";
import { withStyles } from "@material-ui/styles";
import { useStyles } from "./styles";
import ServiceErrors from "./ServiceErrors";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
// EXAMPLE
// import Typography from "@material-ui/core/Typography";
// import OutlinedTextArea from "../../common/OutlinedTextArea";

class ServiceInput extends Component {
  constructor(props) {
    super(props);

    // bind all methods to the class context
    this.setError = this.setError.bind(this);
    this.deleteError = this.deleteError.bind(this);
    this.isAvailableToRun = this.isAvailableToRun.bind(this);
    this.isInputValueValid = this.isInputValueValid.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    // include meta
    this.valuesInputs = valuesInputs;
    this.actionButtons = actionButtons;

    // define variables in state
    this.state = {
      // EXAMPLE
      // firstValue: "",
      // secondValue: "",
      errors: new Map(),
    };
  }

  // default do NOT edit
  setError(errorKey, errorMessage) {
    const { errors } = this.state;
    errors.set(errorKey, errorMessage);

    this.setState({
      errors: errors,
    });
  }

  // default do NOT edit
  deleteError(errorKey) {
    const { errors } = this.state;
    errors.delete(errorKey);

    this.setState({
      errors: errors,
    });
  }

  // function to decide if some blocks needed to be blocked
  isAvailableToRun() {
    // EXAMPLE
    // const { firstValue, secondValue, errors } = this.state;
    // return firstValue !== "" && secondValue !== "" && errors.size == 0;
  }

  // input validation
  isInputValueValid(value) {
    // EXAMPLE (check if given value is a number)
    // return (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) && !isNaN(value);
  }

  // function to handle value input
  onValueChange(event) {
    // EXAMPLE
    // const { value, name: stateKey } = event.target;
    // if (!this.isInputValueValid(value)) {
    //   this.setError("invalidInput", "The provided values must be numbers");
    // } else {
    //   this.deleteError("invalidInput");
    // }
    // this.setState({
    //   [stateKey]: value,
    // });
  }

  InputFields() {
    // EXAMPLE
    // const { valuesInputs } = this;
    // const { classes } = this.props;
    // return (
    //   <Grid container className={classes.contentBox}>
    //     <Typography variant="h2">Input values</Typography>
    //     <Grid container direction="column" className="input-values">
    //       {valuesInputs.map(valueInput => (
    //         <Grid item>
    //           <OutlinedTextArea
    //             label={valueInput.label}
    //             value={this.state[valueInput.valueKey]}
    //             name={valueInput.valueKey}
    //             onChange={this.onValueChange}
    //           />
    //         </Grid>
    //       ))}
    //     </Grid>
    //   </Grid>
    // );
  }

  ActionButtons() {
    // EXAMPLE
    // const { actionButtons } = this;
    // const { classes, onSubmitAction } = this.props;
    // const { firstValue, secondValue } = this.state;
    // return (
    //   <Grid container className={classes.contentBox}>
    //     <Typography variant="h2">Actions</Typography>
    //     <Grid container className="action-buttons">
    //       {actionButtons.map(actionButton => (
    //         <Button
    //           variant="contained"
    //           key={actionButton.action}
    //           className={classes.serviceButton}
    //           onClick={() => onSubmitAction(actionButton.action, firstValue, secondValue)}
    //           disabled={!this.isAvailableToRun()}
    //         >
    //           {actionButton.text}
    //         </Button>
    //       ))}
    //     </Grid>
    //   </Grid>
    // );
  }

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    return (
      <Fragment>
        <Grid container className={classes.serviceMainPage}>
          {this.InputFields()}
          {this.ActionButtons()}
        </Grid>
        <ServiceErrors errors={errors} />
      </Fragment>
    );
  }
}

export default withStyles(useStyles)(ServiceInput);
