import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import OutlinedTextArea from '../../common/OutlinedTextArea';
import OutlinedDropdown from '../../common/OutlinedDropdown';
import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
import Radio from '@material-ui/core/Radio';
import Slider from '@material-ui/core/Slider';
import HoverIcon from '../../standardComponents/HoverIcon';
import AlertBox, { alertTypes } from '../../../../components/common/AlertBox';
import { EmoTTS } from './tts_pb_service';
import { MODEL, BLOCKS, LABELS } from './metadata';
import {
    VOICES,
    VOICE_EXAMPLE_SRC,
    DROPDOWN_PARAMETERS,
} from './inputParameters';
import { useStyles } from './styles';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';

const { rangeRestrictions, valueRestrictions } = MODEL.restrictions;
const onlyLatinsRegex = new RegExp(valueRestrictions.ONLY_LATINS_REGEX.value);

const EMPTY_STRING = '';
const OK_CODE = 0;
const SPACE = ' ';
const SPACED_SLASH = ' / ';

const outlinedTextAreaAdditionalProps = {
    HELPER: 'helperTxt',
    ON_CHANGE: 'onChange',
    CHAR_LIMIT: 'charLimit',
};

class TTS extends Component {
    constructor(props) {
        const { state } = MODEL;
        super(props);
        this.submitAction = this.submitAction.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleSelectItem = this.handleSelectItem.bind(this);
        this.handleFilterDropdownSelect =
            this.handleFilterDropdownSelect.bind(this);
        this.inputMaxLengthHelperFunction =
            this.inputMaxLengthHelperFunction.bind(this);

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
        const { status, textInputValue, emotionValue, selectedVoice } =
            this.state;
        const { isAllRequirementsMet } = status;

        return (
            isAllRequirementsMet &&
            textInputValue !== EMPTY_STRING &&
            emotionValue !== EMPTY_STRING &&
            selectedVoice !== EMPTY_STRING
        );
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

    handleSelectItem(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    resetSelectedVoice() {
        this.setState({
            selectedVoice: EMPTY_STRING,
        });
    }

    handleFilterDropdownSelect(event) {
        this.handleSelectItem(event);
        this.resetSelectedVoice();
    }

    parseResponse(response) {
        const { message, status, statusMessage } = response;
        if (!this.isOk(status)) {
            throw new Error(statusMessage);
        }
        const result = message.getAudio();

        this.setState({
            response: result,
        });
    }

    submitAction() {
        const {
            textInputValue,
            speakerSpeedValue,
            emotionValue,
            selectedVoice,
        } = this.state;
        const { service } = MODEL;

        const methodDescriptor = EmoTTS[service.METHOD];
        const request = new methodDescriptor.requestType();

        request.setText(textInputValue);
        request.setEmotion(emotionValue);
        request.setSpeed(speakerSpeedValue);
        request.setSid(selectedVoice);

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
        const { handleFunctionKey, helperFunctionKey, rangeRestrictionKey } =
            meta;

        let InputHandlerConfiguration = {};

        if (this[helperFunctionKey]) {
            //helper is const string for single render and it have to be constructed before used -> call()
            InputHandlerConfiguration[outlinedTextAreaAdditionalProps.HELPER] =
                this[helperFunctionKey].call(
                    this,
                    this.state[meta.stateKey].length,
                    rangeRestrictionKey
                );
        }
        if (this[handleFunctionKey]) {
            InputHandlerConfiguration[
                outlinedTextAreaAdditionalProps.ON_CHANGE
            ] = this[handleFunctionKey];
        }
        if (rangeRestrictions[meta.rangeRestrictionKey].max) {
            InputHandlerConfiguration[
                outlinedTextAreaAdditionalProps.CHAR_LIMIT
            ] = rangeRestrictions[meta.rangeRestrictionKey].max;
        }
        return InputHandlerConfiguration;
    }

    renderTextArea(meta, value = this.state[meta.stateKey]) {
        const { labels } = LABELS;

        let InputHandlerConfiguration = [];

        if (meta.edit) {
            InputHandlerConfiguration = this.createHandleConfiguration(meta);
        }

        return (
            <Grid item xs={12} container justifyContent='center'>
                <OutlinedTextArea
                    fullWidth={meta.isFullWidth}
                    id={meta.id}
                    name={meta.name}
                    rows={meta.rows}
                    label={labels[meta.labelKey]}
                    value={value}
                    {...InputHandlerConfiguration}
                />
            </Grid>
        );
    }

    renderDropdown(meta) {
        const { labels } = LABELS;
        return (
            <Grid item xs={12} container justifyContent='center'>
                <OutlinedDropdown
                    fullWidth={true}
                    id={meta.id}
                    name={meta.name}
                    label={labels[meta.labelKey]}
                    value={this.state[meta.stateKey]}
                    list={Object.values(DROPDOWN_PARAMETERS[meta.optionsList])}
                    onChange={this[meta.handleFunctionKey]}
                />
            </Grid>
        );
    }

    changeSlider(elementName, value) {
        this.setState({
            [elementName]: value,
        });
    }

    renderSlider(meta) {
        const { labels } = LABELS;
        const { classes } = this.props;
        const points = meta.points.map((point) => {
            return { label: point, value: point };
        });
        return (
            <Grid
                item
                xs={12}
                key={meta.id}
                className={classes.sliderComponentContainer}
            >
                <Grid item xs={12}>
                    <span>{labels[meta.labelKey]}</span>
                </Grid>
                <Grid item xs={12} className={classes.sliderContainer}>
                    <Slider
                        name={meta.name}
                        value={this.state[meta.stateKey]}
                        max={Number(meta.max)}
                        min={Number(meta.min)}
                        step={meta.step}
                        valueLabelDisplay='on'
                        marks={points}
                        onChange={(e, v) => this.changeSlider(meta.stateKey, v)}
                    />
                </Grid>
            </Grid>
        );
    }

    renderInputFilterDropdowns() {
        const { inputBlocks } = BLOCKS;

        return (
            <Grid container spacing={2} justifyContent='space-between'>
                {inputBlocks.VOICE_FILTER_PARAMETERS.map((filterMetadata) => (
                    <Grid
                        item
                        xs={12 / inputBlocks.VOICE_FILTER_PARAMETERS.length}
                        key={filterMetadata.id}
                    >
                        {this.renderDropdown(filterMetadata)}
                    </Grid>
                ))}
            </Grid>
        );
    }

    renderInputVoiceLine(meta, index) {
        const { selectedVoice } = this.state;
        const { RADIO_BUTTON } = BLOCKS.inputBlocks;
        const { classes } = this.props;

        return (
            <div className={classes.inputLineContainer}>
                <span>{++index}</span>
                {this.renderAudio(VOICE_EXAMPLE_SRC(meta.id))}
                <Radio
                    className={classes.radioButton}
                    name={RADIO_BUTTON.name}
                    value={meta.id}
                    checked={meta.id === Number(selectedVoice)}
                    onChange={this[RADIO_BUTTON.handleFunctionKey]}
                />
            </div>
        );
    }

    filterList(list, filteringParams) {
        const filteredList = list.filter((listOption) =>
            filteringParams.every((filteringParam) =>
                Object.values(listOption).includes(filteringParam)
            )
        );
        return filteredList;
    }

    renderInputVoiceHeader(countFilteredVoices, countAllVoices) {
        const { labels } = LABELS;
        return (
            <p className={this.props.classes.inputVoiceHeader}>
                {labels.DISPLAYED +
                    SPACE +
                    countFilteredVoices +
                    SPACE +
                    labels.ROWS_OF +
                    SPACE +
                    countAllVoices}
            </p>
        );
    }

    renderInputFilteredVoices() {
        const { genderValue, ageValue, toneValue } = this.state;
        if (isEmpty(genderValue) || isEmpty(ageValue) || isEmpty(toneValue)) {
            return;
        }

        const filterParameters = [genderValue, toneValue, ageValue];

        const filterVoiceList = this.filterList(VOICES, filterParameters);
        const countAllVoices = VOICES.length;
        const countFilteredVoices = filterVoiceList.length;

        return (
            <Grid container>
                {this.renderInputVoiceHeader(
                    countFilteredVoices,
                    countAllVoices
                )}
                {filterVoiceList.map((filterMetadata, index) =>
                    this.renderInputVoiceLine(filterMetadata, index)
                )}
            </Grid>
        );
    }

    renderUserPreference(preference) {
        const preferenceValue = this.state[preference.stateKey];

        return (
            <Grid item xs={3} key={preference.id}>
                {this.renderTextArea(
                    preference,
                    DROPDOWN_PARAMETERS[preference.name][preferenceValue].label
                )}
            </Grid>
        );
    }

    renderUserPreferences() {
        const { USER_INPUTED_PREFERENCES } = BLOCKS.outputBlocks;
        return (
            <Grid container spacing={2} justifyContent='space-between'>
                {USER_INPUTED_PREFERENCES.map((preference) =>
                    this.renderUserPreference(preference)
                )}
            </Grid>
        );
    }

    renderInfoBlock() {
        const { informationLinks } = MODEL;
        const { informationBlocks } = BLOCKS;
        const { labels } = LABELS;

        const links = Object.values(informationBlocks);

        return (
            <Grid item xs container justifyContent='flex-end'>
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
                    variant='contained'
                    color='primary'
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
            <Grid container direction='column' justifyContent='center'>
                {this.renderTextArea(inputBlocks.TEXT_INPUT)}
                {this.renderDropdown(inputBlocks.EMOTION_INPUT)}
                {this.renderSlider(inputBlocks.SPEAKER_SPEED_INPUT)}
                <h4>{LABELS.labels.FILTER_HEADER}</h4>
                {this.renderInputFilterDropdowns()}
                {this.renderInputFilteredVoices()}
                {this.renderInfoBlock()}
                {this.renderInvokeButton()}
                {errors.size ? this.renderValidationStatusBlocks(errors) : null}
            </Grid>
        );
    }

    createAudioUrl(source, type = 'audio/mp3') {
        const decodedData = atob(source);
        const arrayBuffer = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
            arrayBuffer[i] = decodedData.charCodeAt(i);
        }
        const audioBlob = new Blob([arrayBuffer], { type: type });
        const audioUrl = window.URL.createObjectURL(audioBlob);
        return audioUrl;
    }

    renderAudio(audioSrc) {
        const { classes } = this.props;

        return (
            <audio controls src={audioSrc} className={classes.audio} />
        );
    }

    renderOutputAudio() {
        const { labels } = LABELS;
        const { classes } = this.props;
        const src = this.createAudioUrl(this.state.response);

        return (
            <Grid container>
                <p className={classes.outputResultHeader}>
                    {labels.SERVICE_OUTPUT}
                </p>
                <Grid xs={12} item justifyContent='center'>
                    {this.renderAudio(src)}
                </Grid>
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
            <Grid container direction='column' justifyContent='center'>
                {this.renderUserPreferences()}
                {this.renderTextArea(outputBlocks.USER_TEXT_INPUT)}
                {this.renderOutputAudio()}
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

export default withStyles(useStyles)(TTS);
