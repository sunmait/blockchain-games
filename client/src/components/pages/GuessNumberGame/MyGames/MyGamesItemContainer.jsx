import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyGamesItem from './MyGamesItem.jsx';
import * as guessNumberGamePageActions from "../../../../redux/modules/guess-number-game-page/guessNumberGamePageActions";

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  ethPrice: state.guessNumberGame.ethPrice,
  currentAccount: state.guessNumberGame.currentAccount,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleCurrentGameChange: guessNumberGamePageActions.handleCurrentGameChange,
  handleActiveTabChange: guessNumberGamePageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyGamesItem);