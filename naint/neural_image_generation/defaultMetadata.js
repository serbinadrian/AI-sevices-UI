export const metadataTypes = {
    DEFAULT: "default",
    REMOTE: "remote",
}

export const defaultMetadata = {
    type: metadataTypes.DEFAULT,
    version: "1.0", 
    models: [{
        label: "Stable Diffusion v2.1",
        value: "SD2_1",
    }, {
        label: "Stable Diffusion v2.0",
        value: "SD2",
    }, {
        label: "Stable Diffusion v1.5",
        value: "SD1_5",
    }, {
        label: "Stable Diffusion Waifu",
        value: "waifu",
    }, {
        label: "Stable Diffusion Beksinski Art",
        value: "beksinski",
    }, {
        label: "Stable Diffusion GuoHua",
        value: "guohua",
    }, {
        label: "Stable Diffusion Inkpunk",
        value: "inkpunk",
    }, {
        label: "Stable Diffusion Dream Shaper",
        value: "dream_shaper",
    }, {
        label: "Stable Diffusion Openjourney",
        value: "open_journey",
    }, {
        label: "I Can't Believe It's Not Photography",
        value: "icbinp",
    }, {
        label: "Min-Dalle",
        value: "dalle",
    }, {
        label: "ControlNet Scribble img2img",
        value: "scribble",
    }, {
        label: "Stable Diffusion img2img",
        value: "img2img",
    }, {
        label: "Kandinsky v2.1",
        value: "kandinsky2_1",
    }, {
        label: "Kandinsky v2.2",
        value: "kandinsky2_2",
    }],
    modelsSettings: {
        SD2_1: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        SD2: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        SD1_5: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        waifu: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        beksinski: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        guohua: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        inkpunk: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        dream_shaper: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        open_journey: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        icbinp: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        dalle: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: false,
                isImageInput: false,
                isStyleSelect: false,
                isSeedSlider: false,
                isNumberOfImagesSlider: false,
                isStepsSlider: false,
                isGuidanceScaleSlider: false,
                isHeightSlider: false,
                isWidthSlider: false,
            }
        },
        scribble: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: true,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        img2img: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: true,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        kandinsky2_1: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        },
        kandinsky2_2: {
            modelElemetsUsage: {
                isPrompt: true,
                isNegativePromt: true,
                isImageInput: false,
                isStyleSelect: true,
                isSeedSlider: true,
                isNumberOfImagesSlider: true,
                isStepsSlider: true,
                isGuidanceScaleSlider: true,
                isHeightSlider: true,
                isWidthSlider: true,
            }
        }
    },
    modelsDefaultValues: {
        SD2_1: {
            model: "SD2_1",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 768,
            width: 768,
        },
        SD2: {
            model: "SD2",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 768,
            width: 768,
        },
        SD1_5: {
            model: "SD1_5",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 768,
            width: 768,
        },
        waifu: {
            model: "waifu",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 768,
            width: 768,
        },
        beksinski: {
            model: "beksinski",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 512,
            width: 512,
        },
        guohua: {
            model: "guohua",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 512,
            width: 512,
        },
        inkpunk: {
            model: "inkpunk",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 512,
            width: 512,
        },
        dream_shaper: {
            model: "dream_shaper",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 768,
            width: 768,
        },
        open_journey: {
            model: "open_journey",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 512,
            width: 512,
        },
        icbinp: {
            model: "icbinp",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 768,
            width: 768,
        },
        dalle: {
            model: "dalle",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 512,
            width: 512,
        },
        scribble: {
            model: "scribble",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 512,
            width: 512,
        },
        img2img: {
            model: "img2img",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 512,
            width: 512,
        },
        kandinsky2_1: {
            model: "kandinsky2_1",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 768,
            width: 768,
        },
        kandinsky2_2: {
            model: "kandinsky2_2",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 3,
            steps: 50,
            guidanceScale: 9,
            height: 768,
            width: 768,
        }
    },
    styles: [{
            label: "Not set",
            value: "Not set",
        }, {
            label: "Detailed",
            value: "detailed",
        }, {
            label: "Portrait photography realistic",
            value: "portrait photography realistic",
        }, {
            label: "Animal",
            value: "animal",
        }, {
            label: "Interior",
            value: "interior",
        }, {
            label: "Postapocalyptic",
            value: "postapocalyptic",
        }, {
            label: "Steampunk",
            value: "steampunk",
        }, {
            label: "Nature from tales",
            value: "nature from tales",
        }, {
            label: "Cinematic",
            value: "cinematic",
        },  {
            label: "Cozy interior",
            value: "cozy interior",
        },
    ],
}

export const MODEL = {
    metadataSource: "https://raw.githubusercontent.com/serbinadrian/AI-sevices-UI/imgen/remote/imgenMeta.json",
    informationLinks: {
        GIT_HUB: "https://github.com/iktina/image-generation-4.0",
        USER_GUIDE: "https://github.com/iktina/image-generation-4.0",
        ORIGINAL_PROJECT: "https://github.com/iktina/image-generation-4.0",
    },
    state: {
        response: undefined,
        isResponseRendered: false,
        isDevMode: false,
        meta: null,
        modelsSettings: null,
        status: {
            isValid: {
                prompt: false,
                negativePromt: false,
                validSize: false,
                validDimentions: false,
            },
            errors: new Map(),
        },
        modelElemetsUsage: {
            isPrompt: false,
            isNegativePromt: false,
            isImageInput: false,
            isStyleSelect: false,
            isSeedSlider: false,
            isNumberOfImagesSlider: false,
            isStepsSlider: false,
            isGuidanceScaleSlider: false,
            isHeightSlider: false,
            isWidthSlider: false,
        },
        models: [{
            label: "Not set",
            value: "Not set"
        }],
        styles: [{
            label: "Not set",
            value: "Not set"
        }],
        service: {
            model: "Not set",
            prompt: "",
            negativePromt: "",
            image: null,
            style: "Not set",
            seed: 0,
            numberOfImages: 0,
            steps: 0,
            guidanceScale: 0,
            height: 0,
            width: 0,
        }
    },
    restrictions: {
        textRestrictions: {
            ONLY_LATINS_TEXT_LENGTH: {
                min: 3,
                max: 1000,
            },
            ONLY_LATINS_REGEX: {
                value: `^[?!.,:;"'--()a-zA-Z\\s]+$`,
                prompt: {
                    errorKey: "ONLY_LATINS_REGEX_ERROR",
                },
                negativePromt: {
                    errorKey: "ONLY_LATINS_REGEX_ERROR2",
                }
            },
        },
        imageUploaderRestrictions: {
            FILE_UPLOADER: {
                minDimentions: {
                    minWidth: 64,
                    minHeight: 64,
                    errorKey: "MIN_DEMENTIONS_ERROR"
                },
                maxDimentions: {
                    maxWidth: 1080,
                    maxHeight: 1080,
                    errorKey: "MAX_DEMENTIONS_ERROR"
                },
                size: {
                    maxSize: 10485760, //10mb
                    minSize: 0,
                    errorKey: "IMAGE_SIZE_ERROR"
                }
            }
        },
        sliderRestrictions: {
            SEED: {
                min: 0,
                max: 15000,
                step: 1,
            },
            N_IMAGES: {
                min: 1,
                max: 10,
                step: 1,
            },
            STEPS: {
                min: 20,
                max: 100,
                step: 1,
            },
            GUIDANCE_SCALE: {
                min: 0,
                max: 50,
                step: 9,

            },
            WIDTH: {
                min: 64,
                max: 768,
                step: 64,
            },
            HEIGHT: {
                min: 64,
                max: 768,
                step: 64,
            }
        },
    },
    service: {
        METHOD: "Gen",
    },
}

export const BLOCKS = {
    inputBlocks: {
        MODEL_SELECT: {
            id: "model-select",
            name: "model",
            labelKey: "MODEL",
            stateKey: "model",
            parametersListKey: "models",
            handleFunctionKey: "handleChangeModel"
        },
        STYLE_SELECT: {
            id: "style-select",
            name: "style",
            labelKey: "STYLE",
            stateKey: "style",
            parametersListKey: "styles",
            handleFunctionKey: "handleValueChange",
        },
        IMAGE_INPUT: {
            id: "image-input",
            imageName: "Input image",
            handleFunctionKey: "handleImageUpload",
            disableUrlTab: true,
            disableComparisonTab: true,
            disableOutputTab: true, 
            returnByteArray: true,
        },
        PROMT_INPUT: {
            type: "prompt-area",
            id: "prompt-input",
            name: "prompt",
            rows: 5,
            edit: true,
            stateKey: "prompt",
            handleFunctionKey: "handleInput",
            helperFunctionKey: "inputMaxLengthHelperFunction",
            rangeRestrictionKey: "ONLY_LATINS_TEXT_LENGTH",
            labelKey: "PROMT_INPUT",
        },
        NEGATIVE_PROMT_INPUT: {
            type: "negative-prompt-area",
            id: "negative-prompt-input",
            name: "negativePromt",
            rows: 5,
            edit: true,
            stateKey: "negativePromt",
            handleFunctionKey: "handleInput",
            helperFunctionKey: "inputMaxLengthHelperFunction",
            rangeRestrictionKey: "ONLY_LATINS_TEXT_LENGTH",
            labelKey: "NEGATIVE_PROMT_INPUT",
        },
        NUMBER_OF_IMAGES_SLIDER: {
            id: "numberOfImages",
            name: "numberOfImages",
            labelKey: "N_IMAGES",
            stateKey: "numberOfImages",
            restrictionsKey: "N_IMAGES",
            valueLabelDisplay: "on",
            ariaLabelLedBy: "discrete-slider-always",
            handleFunctionKey: "handleSliderChange",
        },
        SEED_SLIDER: {
            id: "seed",
            name: "seed",
            labelKey: "SEED",
            stateKey: "seed",
            restrictionsKey: "SEED",
            valueLabelDisplay: "on",
            ariaLabelLedBy: "discrete-slider-always",
            handleFunctionKey: "handleSliderChange",
        },
        STEPS_SLIDER: {
            id: "steps",
            name: "steps",
            labelKey: "STEPS",
            stateKey: "steps",
            restrictionsKey: "STEPS",
            valueLabelDisplay: "on",
            ariaLabelLedBy: "discrete-slider-always",
            handleFunctionKey: "handleSliderChange",
        },
        GUIDANCE_SCALE_SLIDER: {
            id: "guidanceScale",
            name: "guidanceScale",
            labelKey: "GUIDANCE_SCALE",
            stateKey: "guidanceScale",
            restrictionsKey: "GUIDANCE_SCALE",
            valueLabelDisplay: "on",
            ariaLabelLedBy: "discrete-slider-always",
            handleFunctionKey: "handleSliderChange",
        },
        WIDTH_SLIDER: {
            id: "width",
            name: "width",
            labelKey: "WIDTH",
            stateKey: "width",
            restrictionsKey: "WIDTH",
            valueLabelDisplay: "on",
            ariaLabelLedBy: "discrete-slider-always",
            handleFunctionKey: "handleSliderChange",
        },
        HEIGHT_SLIDER: {
            id: "height",
            name: "height",
            labelKey: "HEIGHT",
            stateKey: "height",
            restrictionsKey: "HEIGHT",
            valueLabelDisplay: "on",
            ariaLabelLedBy: "discrete-slider-always",
            handleFunctionKey: "handleSliderChange",
        },
    },
    outputBlocks: {
        PROMT_OUTPUT: {
            type: "prompt-area",
            id: "prompt-input",
            name: "prompt",
            rows: 5,
            edit: false,
            stateKey: "prompt",
            labelKey: "PROMT_INPUT",
        },
        NEGATIVE_PROMT_OUTPUT: {
            type: "negative-prompt-area",
            id: "negative-prompt-input",
            name: "negativePromt",
            rows: 5,
            edit: false,
            stateKey: "negativePromt",
            labelKey: "NEGATIVE_PROMT_INPUT",
        },
        USER_IMAGE_INPUT: {

        },
        USER_STYLE_PARAMETERS_INPUT: {
            modelParameterKey: "selectedModelParameter",
            styleParameterKey: "selectedStyleParameter",
            sliderParameterKeys: ["seed", "n_images", "steps"]
        },
        SERVICE_OUTPUT: {

        }
    },
    informationBlocks: {
        CODE: {
            labelKey: "VIEW_CODE",
            linkKey: "GIT_HUB",
            svgPath:
                "M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z",
        },
        GUIDE: {
            labelKey: "USER_GUIDE",
            linkKey: "USER_GUIDE",
            svgPath:
                "M 12 2 C 6.48 2 2 6.48 2 12 s 4.48 10 10 10 s 10 -4.48 10 -10 S 17.52 2 12 2 Z m 1 15 h -2 v -6 h 2 v 6 Z m 0 -8 h -2 V 7 h 2 v 2 Z",
        },
        PROJECT: {
            labelKey: "ORIGINAL_PROJECT",
            linkKey: "ORIGINAL_PROJECT",
            svgPath:
                "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 11.701c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701zm6 0c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701z",
        },
    },
};

const { textRestrictions } = MODEL.restrictions;
export const LABELS = {
    labels: {
        CHARS: "characters",
        PROMT_INPUT: "Promt",
        NEGATIVE_PROMT_INPUT: "Negative promt",
        SERVICE_OUTPUT: "Result is",
        VIEW_CODE: "View code on Github",
        USER_GUIDE: "User's guide",
        ORIGINAL_PROJECT: "View original project",
        OPEN_IMAGE_BUTTON: "Open in original size",
        DOWNLOAD_BUTTON: "Download",
        INVOKE_BUTTON: "Invoke",
        INPUT: "Input data:",
        RESULT: "Servise output: ",
        SEED: "Seed",
        N_IMAGES: "Images",
        STEPS: "Steps",
        MODEL: "Model",
        STYLE: "Style",
        GUIDANCE_SCALE: "Guidance Scale",
        WIDTH: "Width",
        HEIGHT: "Height",
    },
    status: {
        NO_RESPONSE: "Something went wrong...",
    },
    errors: {
        ONLY_LATINS_REGEX_ERROR: `The promt must be written in English only! No more than ${textRestrictions.ONLY_LATINS_TEXT_LENGTH.max} characters`,
        ONLY_LATINS_REGEX_ERROR2: `The negative promt text must be written in English only! No more than ${textRestrictions.ONLY_LATINS_TEXT_LENGTH.max} characters`,
        IMAGE_SIZE_ERROR: `Wrong size`,
        MIN_DEMENTIONS_ERROR: `Wrong min dimentions`,
        MAX_DEMENTIONS_ERROR: `Wrong max dimentions`
    },
};