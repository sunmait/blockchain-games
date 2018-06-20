import { connect } from 'react-redux';
import CurrentGame from './CurrentGame.jsx';

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  currentGame: state.guessNumberGame.currentGame,
});

export default connect(mapStateToProps, null)(CurrentGame);