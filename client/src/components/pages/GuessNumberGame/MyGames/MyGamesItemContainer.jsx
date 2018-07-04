import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyGamesItem from './MyGamesItem.jsx';
import * as guessNumberGamePageActions from "../../../../redux/modules/guess-number-game-page/guessNumberGamePageActions";

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  localWeb3: state.main.localWeb3,
  ethPrice: state.main.ethPrice,
  currentAccount: state.main.currentAccount,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleCurrentGameChange: guessNumberGamePageActions.handleCurrentGameChange,
  handleActiveTabChange: guessNumberGamePageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyGamesItem);