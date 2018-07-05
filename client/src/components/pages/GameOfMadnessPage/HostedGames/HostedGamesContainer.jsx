import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HostedGames from './HostedGames';
import * as gameOfMadnessPageActions from '../../../../redux/modules/game-of-madness-page/gameOfMadnessPageActions';

const mapStateToProps = (state) => ({
  hostedGamesList : state.gameOfMadness.hostedGamesList,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleActiveTabChange: gameOfMadnessPageActions.handleActiveTabChange,
  handleCurrentGameChange: gameOfMadnessPageActions.handleCurrentGameChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostedGames);