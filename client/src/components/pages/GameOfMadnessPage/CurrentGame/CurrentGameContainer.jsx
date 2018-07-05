import { connect } from 'react-redux';
import CurrentGame from './CurrentGame.jsx';

const mapStateToProps = (state) => ({
  currentAccount: state.main.currentAccount,
  localWeb3: state.main.localWeb3,
  ethPrice: state.main.ethPrice,
  contractInstance: state.gameOfMadness.contractInstance,
  currentGame: state.gameOfMadness.currentGame,
});

export default connect(mapStateToProps, null)(CurrentGame);