import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GameOfMadness from './GameOfMadness';
import * as gameOfMadnessPageActions from '../../../redux/modules/game-of-madness-page/gameOfMadnessPageActions';
import * as mainPageActions from "../../../redux/modules/main-page/mainPageActions";

const mapStateToProps = (state) => ({
  currentAccount: state.main.currentAccount,
  contractInstance: state.gameOfMadness.contractInstance,
  activeTabId: state.gameOfMadness.activeTabId,
  hostedGamesList : state.gameOfMadness.hostedGamesList,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setEthPrice: mainPageActions.setEthPrice,
  setCurrentMetamaskAccount: mainPageActions.setCurrentMetamaskAccount,
  setContractInstance: gameOfMadnessPageActions.setContractInstance,
  handleActiveTabChange: gameOfMadnessPageActions.handleActiveTabChange,
  handleCurrentGameChange: gameOfMadnessPageActions.handleCurrentGameChange,
  getHostedGames: gameOfMadnessPageActions.getHostedGames,
  getUserGames: gameOfMadnessPageActions.getUserGames,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameOfMadness);