import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MainPage from './MainPage.jsx';
import * as mainPageActions from '../../../redux/modules/main-page/mainPageActions';

const mapStateToProps = (state) => ({
  contractInstance: state.main.contractInstance,
  currentGame: state.main.currentGame,
  currentAccount: state.main.currentAccount,
  activeTabId: state.main.activeTabId,
  hostedGamesList: state.main.hostedGamesList,
  isHostedGamesLoaded: state.main.isHostedGamesLoaded,
  isUserGamesLoaded: state.main.isUserGamesLoaded,
  isCurrentGameLoaded: state.main.isCurrentGameLoaded,
  ethPrice: state.main.ethPrice,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setContractInstance: mainPageActions.setContractInstance,
  setEthPrice: mainPageActions.setEthPrice,
  handleCurrentGameChange: mainPageActions.handleCurrentGameChange,
  handleActiveTabChange: mainPageActions.handleActiveTabChange,
  getHostedGames: mainPageActions.getHostedGames,
  getUserGames: mainPageActions.getUserGames,
  handleGameHostedEvent: mainPageActions.handleGameHostedEvent,
  handleGameJoinedEvent: mainPageActions.handleGameJoinedEvent,
  setCurrentMetamaskAccount: mainPageActions.setCurrentMetamaskAccount,
  handleGameEndedEvent: mainPageActions.handleGameEndedEvent,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);