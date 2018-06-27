import { connect } from 'react-redux';
import HostedGamesItem from './HostedGamesItem';
import * as gameOfMadnessPageActions from '../../../../redux/modules/game-of-madness-page/gameOfMadnessPageActions';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state) => ({
  contractInstance: state.gameOfMadness.contractInstance,
  ethPrice: state.main.ethPrice,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleActiveTabChange: gameOfMadnessPageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostedGamesItem);