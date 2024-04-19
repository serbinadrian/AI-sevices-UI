import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import { useStyles } from "./styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

class ServiceOutput extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { response } = this.props;

    // if no response available
    if (response === undefined) {
      return (
        <Grid container>
          <Typography variant="h2">Something went wrong...</Typography>
        </Grid>
      );
    }

    // display the output
    return (
      <Grid container>
        <Typography variant="h2">Service call completed with output {response}</Typography>
      </Grid>
    );
  }
}

export default withStyles(useStyles)(ServiceOutput);
