import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GameOfMadnessItem from './GameOfMadnessItem';
import * as gameOfMadnessPageActions from "../../../redux/modules/game-of-madness-page/gameOfMadnessPageActions";

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameOfMadnessItem);