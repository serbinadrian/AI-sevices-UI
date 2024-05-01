import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import OutlinedTextArea from "../../common/OutlinedTextArea";
import SvgIcon from "@material-ui/core/SvgIcon";
import HoverIcon from "../../standardComponents/HoverIcon";
import AlertBox, { alertTypes } from "../../../../components/common/AlertBox";
import { RecognizeMessage } from "./named_entity_recognition_pb_service";
import { MODEL, BLOCKS, LABELS } from "./metadata";
import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";

const { rangeRestrictions, valueRestrictions } = MODEL.restrictions;
const onlyLatinsRegex = new RegExp(valueRestrictions.ONLY_LATINS_REGEX.value);

const EMPTY_STRING = "";
const OK_CODE = 0;
const SPACE = " ";
const SPACED_SLASH = " / ";
const DASH = " - ";

const outlinedTextAreaAdditionalProps = {
  HELPER: "helperTxt",
  ON_CHANGE: "onChange",
  CHAR_LIMIT: "charLimit",
};

const responseFields = {
  NAME: "name",
  TYPE: "type",
  START_SPAN: "start_span",
  END_SPAN: "end_span",
  CHAR_POSITION: "charPosition",
};

const tableLineTypes = {
  HEADER: "header",
  ROW: "row",
};

class NamedEntityRecognitionService extends React.Component {
  constructor(props) {
    const { state } = MODEL;
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.inputMaxLengthHelperFunction = this.inputMaxLengthHelperFunction.bind(
      this
    );

    this.state = state;
  }

  getErrorMessageByKey(errorKey) {
    const { errors } = LABELS;
    return errors[errorKey];
  }

  getValidationMeta() {
    const errorKey = valueRestrictions.ONLY_LATINS_REGEX.errorKey;
    return {
      regex: onlyLatinsRegex,
      errorKey: errorKey,
    };
  }

  isValidInput(regex, text) {
    return regex.exec(text);
  }

  validateInput(targetValue) {
    const { errors } = this.state.status;
    const { regex, errorKey } = this.getValidationMeta();
    let isAllRequirementsMet = true;

    if (!this.isValidInput(regex, targetValue)) {
      const errorMessage = this.getErrorMessageByKey(errorKey);
      errors.set(errorKey, errorMessage);
    } else {
      errors.delete(errorKey);
    }

    if (errors.size > 0) {
      isAllRequirementsMet = false;
    }

    this.setState({
      status: {
        errors: errors,
        isAllRequirementsMet: isAllRequirementsMet,
      },
    });
  }

  canBeInvoked() {
    const { status, textInputValue } = this.state;
    const { isAllRequirementsMet } = status;

    return isAllRequirementsMet && textInputValue !== EMPTY_STRING;
  }

  isOk(status) {
    return status === OK_CODE;
  }

  handleTextInput(event) {
    const targetName = event.target.name;
    const targetValue = event.target.value;

    this.validateInput(targetValue);

    this.setState({
      [targetName]: targetValue,
    });
  }

  constructRequest(data) {
    const dataArray = data.replaceAll("\n", " ");

    let request = [{ id: 0, sentence: dataArray }];

    return JSON.stringify(request);
  }

  parseResponse(response) {
    const { message, status, statusMessage } = response;
    if (!this.isOk(status)) {
      throw new Error(statusMessage);
    }
    const resultArray = JSON.parse(message.getValue());

    let result = resultArray.map((resultItem) => {
      return resultItem.entities;
    });

    this.setState({
      response: result.flat(),
    });
  }

  submitAction() {
    const { textInputValue } = this.state;
    const { service } = MODEL;

    const methodDescriptor = RecognizeMessage[service.METHOD];
    const request = new methodDescriptor.requestType();

    request.setValue(this.constructRequest(textInputValue));

    const props = {
      request,
      onEnd: (response) => this.parseResponse(response),
    };
    this.props.serviceClient.unary(methodDescriptor, props);
  }

  inputMaxLengthHelperFunction(textLengthValue, restrictionKey) {
    const { labels } = LABELS;

    return (
      textLengthValue +
      SPACED_SLASH +
      rangeRestrictions[restrictionKey].max +
      SPACE +
      labels.CHARS
    );
  }

  createHandleConfiguration(meta) {
    const { handleFunctionKey, helperFunctionKey, rangeRestrictionKey } = meta;

    let InputHandlerConfiguration = {};

    if (this[helperFunctionKey]) {
      //helper is const string for single render and it have to be constructed before used -> call()
      InputHandlerConfiguration[outlinedTextAreaAdditionalProps.HELPER] = this[
        helperFunctionKey
      ].call(this, this.state[meta.stateKey].length, rangeRestrictionKey);
    }
    if (this[handleFunctionKey]) {
      InputHandlerConfiguration[
        outlinedTextAreaAdditionalProps.ON_CHANGE
      ] = this[handleFunctionKey];
    }
    if (rangeRestrictions[meta.rangeRestrictionKey].max) {
      InputHandlerConfiguration[outlinedTextAreaAdditionalProps.CHAR_LIMIT] =
        rangeRestrictions[meta.rangeRestrictionKey].max;
    }
    return InputHandlerConfiguration;
  }

  charPosition(startSpan, endSpan) {
    return startSpan + DASH + endSpan;
  }

  constructTableHeader() {
    const { labels } = LABELS;

    return {
      name: labels.ENTITY,
      type: labels.TYPE,
      charPosition: labels.CHAR_POSITION,
    };
  }

  constructTableRows(responseData) {
    const dataTable = [];

    responseData.forEach((responseDataKey) => {
      const responseDataCharPosition = this.charPosition(
        responseDataKey[responseFields.START_SPAN],
        responseDataKey[responseFields.END_SPAN]
      );
      const responseDataObj = {
        name: responseDataKey[responseFields.NAME],
        type: responseDataKey[responseFields.TYPE],
        charPosition: responseDataCharPosition,
      };

      dataTable.push(responseDataObj);
    });

    return dataTable;
  }

  renderOutputTableRow(dataTableRow, typeRow) {
    const { classes } = this.props;

    const dataTableRowKeys = Object.keys(dataTableRow);

    return (
      <Grid
        container
        item
        xs={12}
        key={dataTableRow[responseFields.CHAR_POSITION]}
        className={
          typeRow === tableLineTypes.HEADER
            ? classes.tableHeader
            : classes.tableRow
        }
      >
        {dataTableRowKeys.map((dataTableRowKey) => (
          <Grid item xs={4} key={dataTableRow[dataTableRowKey]}>
            {dataTableRow[dataTableRowKey]}
          </Grid>
        ))}
      </Grid>
    );
  }

  renderOutputTable() {
    const { classes } = this.props;
    const { response } = this.state;

    const tableHeader = this.constructTableHeader();
    const responseData = this.constructTableRows(response);

    return (
      <Grid container item xs={12} className={classes.table}>
        {this.renderOutputTableRow(tableHeader, tableLineTypes.HEADER)}
        {responseData.map((responseDataRow) =>
          this.renderOutputTableRow(responseDataRow, tableLineTypes.ROW)
        )}
      </Grid>
    );
  }

  renderTextArea(meta) {
    const { labels } = LABELS;

    let InputHandlerConfiguration = [];

    if (meta.edit) {
      InputHandlerConfiguration = this.createHandleConfiguration(meta);
    }

    return (
      <Grid item xs={12} container justify="center">
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

  renderServiceOutputBlock() {
    const { labels } = LABELS;
    const { classes } = this.props;

    return (
      <Grid item xs={12} container justify="flex-start">
        <span className={classes.outputLabel}>{labels.SERVICE_OUTPUT}</span>
        {this.renderOutputTable()}
      </Grid>
    );
  }

  renderInfoBlock() {
    const { informationLinks } = MODEL;
    const { informationBlocks } = BLOCKS;
    const { labels } = LABELS;

    const links = Object.values(informationBlocks);

    return (
      <Grid item xs container justify="flex-end">
        {links.map((link) => (
          <Grid item key={link.linkKey}>
            <HoverIcon
              text={labels[link.labelKey]}
              href={informationLinks[link.linkKey]}
            >
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
    const { labels } = LABELS;

    return (
      <Grid item xs={12} className={classes.invokeButton}>
        <Button
          variant="contained"
          color="primary"
          onClick={this.submitAction}
          disabled={!this.canBeInvoked()}
        >
          {labels.INVOKE_BUTTON}
        </Button>
      </Grid>
    );
  }

  renderValidationStatusBlocks(errors) {
    const { classes } = this.props;

    const errorKeysArray = Array.from(errors.keys());

    return (
      <Grid item xs={12} container className={classes.alertsContainer}>
        {errorKeysArray.map((arrayErrorKey) => (
          <AlertBox
            type={alertTypes.ERROR}
            message={errors.get(arrayErrorKey)}
            className={classes.alertMessage}
            key={arrayErrorKey}
          />
        ))}
      </Grid>
    );
  }

  renderServiceInput() {
    const { inputBlocks } = BLOCKS;
    const { errors } = this.state.status;
    return (
      <Grid container direction="column" justify="center">
        {this.renderTextArea(inputBlocks.TEXT_INPUT)}
        {this.renderInfoBlock()}
        {this.renderInvokeButton()}
        {errors.size ? this.renderValidationStatusBlocks(errors) : null}
      </Grid>
    );
  }

  renderServiceOutput() {
    const { response } = this.state;
    const { outputBlocks } = BLOCKS;
    const { status } = LABELS;

    if (!response) {
      return <h4>{status.NO_RESPONSE}</h4>;
    }

    return (
      <Grid container direction="column" justify="center">
        {this.renderTextArea(outputBlocks.USER_TEXT_INPUT)}
        {this.renderServiceOutputBlock()}
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
export default withStyles(useStyles)(NamedEntityRecognitionService);
