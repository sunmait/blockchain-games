import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyGamesItem from './MyGamesItem.jsx';
import * as gameOfMadnessPageActions from '../../../../redux/modules/game-of-madness-page/gameOfMadnessPageActions';


const mapStateToProps = (state) => ({
  currentAccount: state.main.currentAccount,
  contractInstance: state.gameOfMadness.contractInstance,
  ethPrice: state.main.ethPrice,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleCurrentGameChange: gameOfMadnessPageActions.handleCurrentGameChange,
  handleActiveTabChange: gameOfMadnessPageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyGamesItem);