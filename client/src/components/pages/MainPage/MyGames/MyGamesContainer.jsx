import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyGames from './MyGames.jsx';
import * as mainPageActions from "../../../../redux/modules/main-page/mainPageActions";

const mapStateToProps = (state) => ({
  contractInstance: state.main.contractInstance,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleCurrentGameIdChange: mainPageActions.handleCurrentGameIdChange,
  handleActiveTabChange: mainPageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyGames);