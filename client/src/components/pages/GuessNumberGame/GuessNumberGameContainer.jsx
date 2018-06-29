import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GuessNumberGame from './GuessNumberGame.jsx';
import * as guessNumberGamePageActions from '../../../redux/modules/guess-number-game-page/guessNumberGamePageActions';

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  currentGame: state.guessNumberGame.currentGame,
  currentAccount: state.main.currentAccount,
  activeTabId: state.guessNumberGame.activeTabId,
  isHostedGamesLoaded: state.guessNumberGame.isHostedGamesLoaded,
  isUserGamesLoaded: state.guessNumberGame.isUserGamesLoaded,
  isCurrentGameLoaded: state.guessNumberGame.isCurrentGameLoaded,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setContractInstance: guessNumberGamePageActions.setContractInstance,
  handleCurrentGameChange: guessNumberGamePageActions.handleCurrentGameChange,
  handleActiveTabChange: guessNumberGamePageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GuessNumberGame);