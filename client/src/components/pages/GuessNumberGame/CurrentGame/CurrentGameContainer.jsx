import { connect } from 'react-redux';
import CurrentGame from './CurrentGame.jsx';

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  currentGame: state.guessNumberGame.currentGame,
  currentAccount: state.main.currentAccount,
  ethPrice: state.main.ethPrice,
  localWeb3: state.main.localWeb3,
});

export default connect(mapStateToProps, null)(CurrentGame);