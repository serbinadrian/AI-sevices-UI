import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import { useStyles } from "./styles";

class serviceFinalPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { response } = this.props;

    if (!response) {
      return <h2>Something went wrong</h2>;
    }

    return <h2>Service completed with output {response?.data}</h2>;
  }
}

export default withStyles(useStyles)(serviceFinalPage);
