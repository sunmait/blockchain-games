import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CurrentGame from './CurrentGame.jsx';

const mapStateToProps = (state) => ({
  currentAccount: state.main.currentAccount,
  contractInstance: state.gameOfMadness.contractInstance,
  currentGame: state.gameOfMadness.currentGame,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CurrentGame);