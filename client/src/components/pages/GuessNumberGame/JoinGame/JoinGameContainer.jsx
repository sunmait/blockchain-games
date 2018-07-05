import { connect } from 'react-redux';
import JoinGame from './JoinGame.jsx';
import { bindActionCreators } from 'redux';
import * as guessNumberGamePageActions from '../../../../redux/modules/guess-number-game-page/guessNumberGamePageActions';

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  currentGame: state.guessNumberGame.currentGame,
  localWeb3: state.main.localWeb3,
  ethPrice: state.main.ethPrice,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleActiveTabChange: guessNumberGamePageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(JoinGame);