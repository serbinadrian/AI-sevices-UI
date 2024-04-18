import React, { Component } from "react";
import AlertBox from '../../../../components/common/AlertBox';

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
    const errorsList = this.getErrorsList();

    return (
      <div className="errors-container">
        {errorsList &&
          errorsList.map((error, index) => (
            <AlertBox type="error" key={index} message={error} />
          ))}
      </div>
    );
  }
}

export default ServiceErrors;
