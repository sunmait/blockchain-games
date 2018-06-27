import { connect } from 'react-redux';
import HostGame from './HostGame.jsx';
import { bindActionCreators } from 'redux';
import * as guessNumberGamePageActions from '../../../../redux/modules/guess-number-game-page/guessNumberGamePageActions';

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  ethPrice: state.main.ethPrice,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleActiveTabChange: guessNumberGamePageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostGame);