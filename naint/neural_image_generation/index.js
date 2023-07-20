import { useStyles } from "./styles";
import { withStyles } from "@material-ui/styles";

class NeuralImageGeneration extends React.Component {

    constructor(props) {
        
    }

    render() {
        if (!this.state.meta) {
            return this.renderLoadingMetaMessage();
        }
        if (!this.props.isComplete) {
            return this.renderServiceInput();
        }
        return this.renderServiceOutput();
    }
}

export default withStyles(useStyles)(NeuralImageGeneration);

