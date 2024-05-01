import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import { useStyles } from "./styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

class ServiceFinalPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container>
        {/* ADD some finish page blocks here if needed */}
        <Typography variant="h2">Service has finished its work</Typography>
      </Grid>
    );
  }
}

export default withStyles(useStyles)(ServiceFinalPage);
