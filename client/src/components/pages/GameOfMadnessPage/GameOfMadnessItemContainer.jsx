import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GameOfMadnessItem from './GameOfMadnessItem';

const mapStateToProps = (state) => ({
  contractInstance: state.gameOfMadness.contractInstance,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameOfMadnessItem);