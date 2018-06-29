import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GameOfMadness from './GameOfMadness';
import * as gameOfMadnessPageActions from '../../../redux/modules/game-of-madness-page/gameOfMadnessPageActions';

const mapStateToProps = (state) => ({
  currentAccount: state.main.currentAccount,
  contractInstance: state.gameOfMadness.contractInstance,
  activeTabId: state.gameOfMadness.activeTabId,
  currentGame: state.gameOfMadness.currentGame,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleActiveTabChange: gameOfMadnessPageActions.handleActiveTabChange,
  handleCurrentGameChange: gameOfMadnessPageActions.handleCurrentGameChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameOfMadness);