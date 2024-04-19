import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import { useStyles } from "./styles";
import Grid from "@material-ui/core/Grid";
import AlertBox from "../../../../components/common/AlertBox";

class ServiceErrors extends Component {
  constructor(props) {
    super(props);

    this.getErrorsList = this.getErrorsList.bind(this);
  }

  getErrorsList() {
    const { errors } = this.props;
    if (!errors || !errors?.size) {
      return [];
    }

    return [...errors.values()];
  }

  render() {
    const { classes } = this.props;
    const errorsList = this.getErrorsList();

    return (
      <Grid container direction="column" className={classes.errorsContainer}>
        {errorsList && errorsList.map((error, index) => <AlertBox type="error" key={index} message={error} />)}
      </Grid>
    );
  }
}

export default withStyles(useStyles)(ServiceErrors);
