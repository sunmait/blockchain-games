import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HostedGames from './HostedGames.jsx';
import * as guessNumberGamePageActions from '../../../../redux/modules/guess-number-game-page/guessNumberGamePageActions';

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  hostedGamesList: state.guessNumberGame.hostedGamesList,
  ethPrice: state.main.ethPrice,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleCurrentGameChange: guessNumberGamePageActions.handleCurrentGameChange,
  handleActiveTabChange: guessNumberGamePageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostedGames);