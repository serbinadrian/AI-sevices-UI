import React from "react";
import ReactDOM from 'react-dom';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";

import HoverIcon from "../../standardComponents/HoverIcon";
import OutlinedDropDown from "../../common/OutlinedDropdown";
import OutlinedTextArea from "../../common/OutlinedTextArea";

import { RomanceTranslator } from "./romance_translator_pb_service";
import languages from "./languages.json";

export default class NeuralMachineTranslation extends React.Component {
  constructor(props) {
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);
    this.handleParameterChange = this.handleParameterChange.bind(this);

    this.state = {
      parametersList: [{
        label: "Custom text",
        inputLabel: "Text to translate",
        inputRows: 5,
        value: 0,
      }, {
        label: "Text from URL",
        inputLabel: "URL",
        inputRows: 1,
        value: 1,
      }],
      selectedParameter: 0,
      languages,
      content_text: "",
      sourceIndex: 0,
      targetIndex: 0,
      users_guide: "https://github.com/iktina/neural-machine-translation",
      code_repo: "https://github.com/iktina/neural-machine-translation",
      reference: "https://github.com/iktina/neural-machine-translation",
      maxTextLength: 4500,
      response: undefined,
      isURLFileValid: false
    };

    //this.renderInputTextArea();
  }

  canBeInvoked() {
    const { sourceIndex, targetIndex, languages, content_text, isURLFileValid} = this.state;
    const source_lang = languages[sourceIndex].content;
    const target_lang = languages[targetIndex].content;
    return source_lang !== target_lang && content_text !== "";
  }

  handleParameterChange(event) {
    let selectedOption = event.target.value
    this.setState({
      selectedParameter: selectedOption
    });
  }

  handleFormUpdate(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  inputCharLimit() {
    switch (this.state.selectedParameter) {
      case 0: return this.state.maxTextLength;
      case 1: return Infinity;
    }
  }

  getTextFromUrl(url) {
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        return text;
      });
  }

  isTextFromUrlValid(text) {
    return text.length > this.state.maxTextLength ? true : false;
  }

  submitAction() {
    const { sourceIndex, targetIndex, languages, content_text, content_url, selectedParameter } = this.state;
    const methodDescriptor = RomanceTranslator["translate"];
    const request = new methodDescriptor.requestType();

    request.setSourceLang(languages[sourceIndex].content);
    request.setTargetLang(languages[targetIndex].content);

    request.setSentencesUrl(content_text); 
    
    const props = {
      request,
      onEnd: ({ message }) => {
        this.setState({ isComplete: true, response: { translation: message.getTranslation() } });
      },
    };

    this.props.serviceClient.unary(methodDescriptor, props);
  }

  renderForm() {
    return (
      <React.Fragment>

        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item xs={8} container spacing={2}>
            <Grid item xs style={{ paddingLeft: 0 }}>
              <OutlinedDropDown
                id="params"
                name="params"
                label="Translate"
                fullWidth={true}
                list={this.state.parametersList}
                value={this.state.selectedParameter}
                onChange={this.handleParameterChange}
              />
            </Grid>
            <Grid item xs style={{ paddingRight: 0 }}>
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item xs={8} container spacing={2}>
            <Grid item xs style={{ paddingLeft: 0 }}>
              <OutlinedDropDown
                id="source_lang"
                name="sourceIndex"
                label="Source Language"
                fullWidth={true}
                list={this.state.languages}
                value={this.state.sourceIndex}
                onChange={this.handleFormUpdate}
              />
            </Grid>
            <Grid item xs style={{ paddingRight: 0 }}>
              <OutlinedDropDown
                id="target_lang"
                name="targetIndex"
                label="Target Language"
                fullWidth={true}
                list={this.state.languages}
                value={this.state.targetIndex}
                onChange={this.handleFormUpdate}
              />
            </Grid>
          </Grid>

          <Grid item xs={8} container style={{ textAlign: "center" }}>
            <OutlinedTextArea
              id="content_text"
              name="content_text"
              label={this.state.parametersList[this.state.selectedParameter].inputLabel}
              type="text"
              fullWidth={true}
              value={this.state.content_text}
              charLimit={this.state.maxTextLength}
              helperTxt={this.state.content_text.length + " / " + this.state.maxTextLength + " char "}
              rows={this.state.parametersList[this.state.selectedParameter].inputRows}
              onChange={this.handleFormUpdate}
            />
          </Grid>

          <Grid container direction="column" alignItems="center" justify="center">
            <Grid item xs={8} container spacing={2}>
              <Grid item xs style={{ paddingLeft: 0 }}>
              </Grid>
              <Grid item xs style={{ paddingRight: 0 }} container justify="flex-end">
                <Grid item>
                  <HoverIcon text="View code on Github" href={this.state.code_repo}>
                    <SvgIcon>
                      <path // Github Icon
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
            </Grid>
          </Grid>


          <Grid item xs={12} container justify="center" style={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={this.submitAction} disabled={!this.canBeInvoked()}>
              Invoke
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  renderComplete() {
    let status = "Ok\n";
    let translation = "\n";

    if (typeof this.state.response === "object") {
      translation = "\n" + this.state.response.translation;
    } else {
      status = this.state.response + "\n";
    }
    return (
      <div style={{ background: "#F8F8F8", padding: "24px" }}>
        <h4> Results</h4>
        <div style={{ padding: "10px 10px 0 10px", fontSize: "14px", color: "#9b9b9b" }}>
          <div style={{ padding: "10px 0" }}>
            Translation:
            <div
              style={{
                color: "#212121",
                marginTop: "5px",
                padding: "10px",
                background: "#f1f1f1",
                borderRadius: "4px",
              }}
            >
              {translation}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.isComplete) return <div>{this.renderComplete()}</div>;
    else {
      return <div>{this.renderForm()}</div>;
    }
  }
}
