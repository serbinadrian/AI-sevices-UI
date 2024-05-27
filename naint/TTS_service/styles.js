export const useStyles = (theme) => ({
    invokeButton: {
        textAlign: 'center',
        '& button': {
            margin: '0 !important',
        },
    },
    alertMessage: {
        width: '100%',
    },
    alertsContainer: {
        display: 'block',
        '& p': {
            textAlign: 'center !important',
        },
    },
    outputResultHeader: {
        fontWeight: 600,
    },
    inputVoiceHeader: {
        textAlign: 'center',
        color: '#454545',
        width: '100%',
    },
    sliderComponentContainer: {
        marginTop: 20,
    },
    sliderContainer: {
        padding: '30px',
        marginTop: 10,
        maxWidth: '100%',
        alignItems: 'center',
        display: 'flex',
        '& .MuiSlider-root': { color: theme.palette.text.primary },
    },
    inputLineContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 30,
        padding: '10px 0',
        margin: '0 0 10px 0',
    },
    inputLine: {
        display: 'flex',
        justifyContent: 'space-between',
        cursor: 'pointer',
    },
    radioButton: {
        color: `${theme.backgroundColor.blue} !important`,
    },
    responseCategory: {
        fontWeight: 'bold',
    },
    outlinedBox: {
        border: `1px solid ${theme.backgroundColor.blue}`,
        padding: 10,
        borderRadius: '5px',
    },
    audio: {
        width: '100%',
        height: 50,
    },
});
