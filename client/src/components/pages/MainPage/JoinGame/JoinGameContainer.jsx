import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import JoinGame from './JoinGame.jsx';

const mapStateToProps = (state) => ({
  contractInstance: state.main.contractInstance,
  currentGameId: state.main.currentGameId,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(JoinGame);