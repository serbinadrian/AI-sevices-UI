import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import { metadata } from "./metadata";
import HoverIcon from "../../standardComponents/HoverIcon";
import OutlinedTextArea from "../../common/OutlinedTextArea";
import { QA } from "./abstractive_question_answering_pb_service";
import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";

class AbstractiveQuestionAnswering extends React.Component {
  constructor(props) {
    const { state } = metadata.configuration;
    const { restrictions } = metadata.configuration
    super(props);
    this.state = state;
    this.submitAction = this.submitAction.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.inputHelperTextFunction = this.inputHelperTextFunction.bind(this);
    this.state.regex = new RegExp('^\\W*(?:\\w+\\b\\W*){' + restrictions.wordsMinimumCount + ',' + restrictions.wordsLimit + '}$');
  }

  wordCount(string) {
    return string
      .replace(/(\r\n|\n|\r)/gm, " ")
      .split(' ')
      .filter(character => character !== '' )
      .length;
  }

  handleTextInput(event) {
    let data = event.target.value
    this.setState({
      [event.target.name]: data,
      wordsCount: this.wordCount(data)
    });
  }
  
  canBeInvoked() {
    const { regex, question } = this.state;
    return regex.exec(question);
  }

  isOk(status) {
    return status === 0;
  }

  parseResponse(response) {
    const { message, status, statusMessage } = response;
    if (!this.isOk(status)) {
      throw new Error(statusMessage);
    }
    this.setState({
      response: message.getAnswer()
    });
  }

  submitAction() {
    const { question } = this.state;
    const { service } = metadata.configuration;

    const methodDescriptor = QA[service.method];
    const request = new methodDescriptor.requestType();

    request.setQuestion(question);
    
    const props = {
      request,
      onEnd: response => this.parseResponse(response)
    };
    this.props.serviceClient.unary(methodDescriptor, props);
  }

  inputHelperTextFunction() {
    const { wordsCount } = this.state;
    const { wordsLimit } = metadata.configuration.restrictions;
    const { labels } = metadata.render;
    
    return wordsCount + " / " + wordsLimit + " " + labels.words;
  };

  createHandleConfiguration(meta){
    const {handleKey, helperKey} = meta;   
    let InputHandlerConfiguration = {};    
    if (this[helperKey]) {
      //helper is const string for single render and it have to be constructed before used -> call()
      InputHandlerConfiguration["helperTxt"] = this[helperKey].call();
    }
    if (this[handleKey]) {
      InputHandlerConfiguration["onChange"] = this[handleKey];
    }
    return InputHandlerConfiguration ?? [];
  }

  renderTextArea(meta) {
    const { classes } = this.props;
    const { labels } = metadata.render;
    
    let InputHandlerConfiguration = [];
    if(meta.edit){
      InputHandlerConfiguration = this.createHandleConfiguration(meta);
    }

    return (
      <Grid className={classes.textArea}>
        <OutlinedTextArea
          fullWidth={true}
          id={meta.id}
          name={meta.name}
          rows={meta.rows}
          label={labels[meta.labelKey]}
          value={this.state[meta.stateKey]}
          {...InputHandlerConfiguration}
        />
      </Grid>
    );
  }

  renderInfoBlock() {
    const { informationLinks } = this.state;
    const { information } = metadata.render.blocks;
    const { labels } = metadata.render;
    const links = Object.values(information);

    return (
      <Grid item xs container justify="flex-end">
        {links.map(link => (
          <Grid item key={link}>
            <HoverIcon text={labels[link.labelKey]} href={informationLinks[link.linkKey]}>
              <SvgIcon>
                <path d={link.svgPath} />
              </SvgIcon>
            </HoverIcon>
          </Grid>
        ))}
      </Grid>
    );
  }

  renderInvokeButton() {
    const { classes } = this.props;
    const { labels } = metadata.render;

    return (
      <Grid item xs={12} className={classes.invokeButton}>
        <Button
          variant="contained"
          color="primary"
          onClick={this.submitAction}
          disabled={!this.canBeInvoked()}
        >
          {labels.invokeButton}
        </Button>
      </Grid>
    );
  }

  renderServiceInput() {
    const { input } = metadata.render.blocks;

    return (
      <Grid container direction="column" justify="center">
        {this.renderTextArea(input.question)}
        {this.renderInfoBlock()}
        {this.renderInvokeButton()}
      </Grid>
    );
  }

  renderServiceOutput() {
    const { response } = this.state;
    const { output } = metadata.render.blocks;
    const { labels } = metadata.render;

    if (!response) {
      return (
        <h4>
          {labels.noResponse}
        </h4>
      );
    }

    return (
      <Grid container direction="column" justify="center">
        {this.renderTextArea(output.userInput)}
        {this.renderTextArea(output.serviceOutput)}
        {this.renderInfoBlock()}
      </Grid>
    );
  }

  render() {
    if (!this.props.isComplete) {
      return this.renderServiceInput();
    } else {
      return this.renderServiceOutput();
    }
  }
}

export default withStyles(useStyles)(AbstractiveQuestionAnswering);