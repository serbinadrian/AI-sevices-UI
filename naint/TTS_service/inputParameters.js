export const VOICE_EXAMPLE_SRC = (voiceId) =>
    `https://marketplace-dapp-data.s3.amazonaws.com/text_to_speech_speakers/${voiceId}_speaker.wav`;

export const VOICES = [
    { id: 19, gender: 'woman', tone: 'mid', age: 'old' },
    { id: 41, gender: 'woman', tone: 'mid', age: 'young' },
    { id: 57, gender: 'man', tone: 'mid', age: 'young' },
    { id: 60, gender: 'woman', tone: 'mid', age: 'old' },
    { id: 170, gender: 'woman', tone: 'mid', age: 'young' },
    { id: 174, gender: 'woman', tone: 'mid', age: 'young' },
    { id: 190, gender: 'man', tone: 'mid', age: 'old' },
    { id: 191, gender: 'man', tone: 'mid', age: 'old' },
    { id: 222, gender: 'woman', tone: 'mid', age: 'old' },
    { id: 246, gender: 'woman', tone: 'mid', age: 'young' },
    { id: 286, gender: 'woman', tone: 'high', age: 'young' },
];

export const DROPDOWN_PARAMETERS = {
    emotion: {
        1: {
            label: 'Neutral',
            value: '1',
        },
        2: {
            label: 'Happy',
            value: '2',
        },
        3: {
            label: 'Sad',
            value: '3',
        },
        4: {
            label: 'Angry',
            value: '4',
        },
        5: {
            label: 'Fear',
            value: '5',
        },
        6: {
            label: 'Disgust',
            value: '6',
        },
        7: {
            label: 'Surprise',
            value: '7',
        },
    },
    gender: {
        man: { label: 'Man', value: 'man' },
        woman: { label: 'Woman', value: 'woman' },
    },
    age: {
        young: { label: 'Young', value: 'young' },
        old: { label: 'Old', value: 'old' },
    },
    tone: {
        low: { label: 'Low', value: 'low' },
        mid: { label: 'Mid', value: 'mid' },
        high: { label: 'High', value: 'high' },
    },
};
