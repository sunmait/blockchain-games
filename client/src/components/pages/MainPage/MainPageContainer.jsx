import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MainPage from './MainPage.jsx';
import * as mainPageActions from '../../../redux/modules/main-page/mainPageActions';

const mapStateToProps = (state) => ({
  contractInstance: state.main.contractInstance,
  currentGame: state.main.currentGame,
  activeTabId: state.main.activeTabId,
  hostedGamesList: state.main.hostedGamesList,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setContractInstance: mainPageActions.setContractInstance,
  handleCurrentGameIdChange: mainPageActions.handleCurrentGameIdChange,
  handleActiveTabChange: mainPageActions.handleActiveTabChange,
  getHostedGames: mainPageActions.getHostedGames,
  getUserGames: mainPageActions.getUserGames,
  handleGameHostedEvent: mainPageActions.handleGameHostedEvent,
  handleGameJoinedEvent: mainPageActions.handleGameJoinedEvent,
  setCurrentMetamaskAccount: mainPageActions.setCurrentMetamaskAccount,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);