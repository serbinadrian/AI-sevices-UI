import React, { Component } from "react";

class ServiceOutput extends Component {
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

export default ServiceOutput;
