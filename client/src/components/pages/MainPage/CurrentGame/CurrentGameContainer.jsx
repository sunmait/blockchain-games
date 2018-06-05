import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CurrentGame from './CurrentGame.jsx';

const mapStateToProps = (state) => ({
  contractInstance: state.main.contractInstance,
  currentGame: state.main.currentGame,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CurrentGame);