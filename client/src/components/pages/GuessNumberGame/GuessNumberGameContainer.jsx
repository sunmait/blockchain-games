import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GuessNumberGame from './GuessNumberGame.jsx';
import * as guessNumberGamePageActions from '../../../redux/modules/guess-number-game-page/guessNumberGamePageActions';
import * as mainPageActions from '../../../redux/modules/main-page/mainPageActions';

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  currentGame: state.guessNumberGame.currentGame,
  currentAccount: state.main.currentAccount,
  activeTabId: state.guessNumberGame.activeTabId,
  hostedGamesList: state.guessNumberGame.hostedGamesList,
  isHostedGamesLoaded: state.guessNumberGame.isHostedGamesLoaded,
  isUserGamesLoaded: state.guessNumberGame.isUserGamesLoaded,
  isCurrentGameLoaded: state.guessNumberGame.isCurrentGameLoaded,
  ethPrice: state.main.ethPrice,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setContractInstance: guessNumberGamePageActions.setContractInstance,
  setEthPrice: mainPageActions.setEthPrice,
  handleCurrentGameChange: guessNumberGamePageActions.handleCurrentGameChange,
  handleActiveTabChange: guessNumberGamePageActions.handleActiveTabChange,
  getHostedGames: guessNumberGamePageActions.getHostedGames,
  getUserGames: guessNumberGamePageActions.getUserGames,
  handleGameHostedEvent: guessNumberGamePageActions.handleGameHostedEvent,
  handleGameJoinedEvent: guessNumberGamePageActions.handleGameJoinedEvent,
  setCurrentMetamaskAccount: mainPageActions.setCurrentMetamaskAccount,
  handleGameEndedEvent: guessNumberGamePageActions.handleGameEndedEvent,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GuessNumberGame);