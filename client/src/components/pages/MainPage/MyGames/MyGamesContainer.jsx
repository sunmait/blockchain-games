import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyGames from './MyGames.jsx';
import * as mainPageActions from "../../../../redux/modules/main-page/mainPageActions";

const mapStateToProps = (state) => ({
  contractInstance: state.main.contractInstance,
  userGamesList: state.main.userGamesList,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleCurrentGameIdChange: mainPageActions.handleCurrentGameIdChange,
  handleActiveTabChange: mainPageActions.handleActiveTabChange,
  getUserGames: mainPageActions.getUserGames,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyGames);