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
    inputLine: {
        display: 'flex',
        justifyContent: 'space-between',
        background: '#F1F1F1',
        borderRadius: '5px',
        padding: '10px',
        margin: '0 0 10px 0',
        cursor: 'pointer',
        transition: 'all 0.1s',
        width: '100%',
        '&:hover': {
            background: '#DCDCDC',
        },
        '&:active': {
            background: '#C4C4C4',
        },
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
    outputResult: {
        width: '100%',
        height: 50,
    },
});
