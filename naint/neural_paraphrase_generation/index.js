import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";

import HoverIcon from "../../standardComponents/HoverIcon";
import OutlinedTextArea from "../../common/OutlinedTextArea";

import { paraphrase } from "./paraphrase_pb_service";

export default class MultipleParaphraseGeneration extends React.Component {
  constructor(props) {
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);

    this.state = {
      users_guide: "https://github.com/iktina/neural-paraphrase-generation",
      code_repo: "https://github.com/iktina/neural-paraphrase-generation",
      reference: "https://github.com/iktina/neural-paraphrase-generation",
      sentence: "",
      maxTextLength: 1000,
      answer: undefined,
    };
  }

  canBeInvoked() {
    return this.state.sentence !== "";
  }

  handleFormUpdate(event) {
    let data = event.target.value
    this.setState({
      sentence: data
    });
  }

  submitAction() {
    const { sentence } = this.state;
    const methodDescriptor = paraphrase["paraphrase"];
    const request = new methodDescriptor.requestType();

    request.setSentence(sentence);

    const props = {
      request,
      onEnd: ({ message }) => {
        this.setState({
          response: { status: "success", answer: message.getAnswer() },
        });
      },
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  renderForm() {
    return (
      <React.Fragment>
        <Grid container direction="column" justify="center">
          <Grid item xs={12} style={{ textAlign: "left" }}>
            <OutlinedTextArea
              id="sentence"
              name="sentence"
              label="Sentence to paraphrase"
              fullWidth={true}
              value={this.state.sentence}
              rows={5}
              charLimit={this.state.maxTextLength}
              helperTxt={this.state.sentence.length + " / " + this.state.maxTextLength + " char"}
              onChange={this.handleFormUpdate}
            />
          </Grid>

          <Grid item xs container justify="flex-end">
            <Grid item>
              <HoverIcon text="View code on Github" href={this.state.code_repo}>
                <SvgIcon>
                  <path
                    d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z"
                  />
                </SvgIcon>
              </HoverIcon>
            </Grid>
            <Grid item>
              <HoverIcon text="User's guide" href={this.state.users_guide}>
                <InfoIcon />
              </HoverIcon>
            </Grid>
            <Grid item>
              <HoverIcon text="View original project" href={this.state.reference}>
                <SvgIcon>
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 11.701c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701zm6 0c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701z" />
                </SvgIcon>
              </HoverIcon>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={this.submitAction} disabled={!this.canBeInvoked()}>
              Invoke
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  renderComplete() {
    const { response } = this.state;

    return (

      <React.Fragment>
        <div>
          <p style={{ fontSize: "16px" }}>
            Your input is <b>{this.state.sentence}</b>{" "}
          </p>
        </div>
        <Grid container direction="column" justify="center">
          <Grid item xs={12} style={{ textAlign: "left", lineHeight: "20px" }}>
            <OutlinedTextArea
              id="paraphrase"
              name="paraphrase"
              label="Result:"
              fullWidth={true}
              value={this.state.response.answer}
              rows={15}
              charLimit={5000}
              onChange={this.handleFormUpdate}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  render() {
    if (this.props.isComplete) return <div>{this.renderComplete()}</div>;
    else {
      return <div>{this.renderForm()}</div>;
    }
  }
}
