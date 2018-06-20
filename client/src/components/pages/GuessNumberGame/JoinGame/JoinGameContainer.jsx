import { connect } from 'react-redux';
import JoinGame from './JoinGame.jsx';

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  currentGame: state.guessNumberGame.currentGame,
  ethPrice: state.main.ethPrice,
});

export default connect(mapStateToProps, null)(JoinGame);