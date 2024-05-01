export const useStyles = (theme) => ({
  invokeButton: {
    textAlign: "center",
  },
  alertMessage: {
    width: "100%",
  },
  alertsContainer: {
    display: "block",
    "& p": {
      textAlign: "center !important",
    },
  },
  imageUploader: {
    align: "center",
  },

  progressBarContainer: {
    marginTop: 60,
    display: "flex",
    alignItems: "center",
  },
  sliderContainer: {
    padding: "10px",
    maxWidth: "100%",
    alignItems: "center",
    display: "flex",
    "& .MuiSlider-root": { color: theme.palette.text.primary },
  },
  startEndNumber: {
    width: 41,
    display: "inline-block",
    fontSize: 16,
    color: theme.palette.text.black1,
    letterSpacing: 0.15,
    lineHeight: "24px",
    textAlign: "center",
  },
  imagesContainer: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
  },
  imageContainer: {
    position: "relative",
    border: "1px solid #4086ff",
    borderRadius: "5px",
    width: "30%",
    margin: "15px auto",
    display: "flex",
    overflow: "hidden",
    "& img": {
      width: "100%",
      objectFit: "contain",
    },
  },
  imageGenerationElement: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    margin: "auto",
    border: "1px solid #4086FF",
    "& img": {
      width: "100%",
    },
  },
  downloadButton: {
    bottom: "0",
  },
  newTabImageButton: {
    display: "block",
    padding: "10px 15px",
    background: "rgba(0, 0, 0, 0.3)",
    border: "#fff",
    fontSize: "14px",
    color: "#fff",
    cursor: "pointer",
    position: "absolute",
  },
  generationParameters: {
    margin: "5px 15px",
    background: "#F1F1F1",
    padding: "5px",
    borderRadius: "5px",
  },
});
