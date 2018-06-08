import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyGames from './MyGames.jsx';
import * as mainPageActions from "../../../../redux/modules/main-page/mainPageActions";

const mapStateToProps = (state) => ({
  contractInstance: state.main.contractInstance,
  userGamesList: state.main.userGamesList,
  ethPrice: state.main.ethPrice,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleCurrentGameChange: mainPageActions.handleCurrentGameChange,
  handleActiveTabChange: mainPageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyGames);