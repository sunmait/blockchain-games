import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyGamesItem from './MyGamesItem.jsx';
import * as mainPageActions from "../../../../redux/modules/main-page/mainPageActions";

const mapStateToProps = (state) => ({
  contractInstance: state.main.contractInstance,
  ethPrice: state.main.ethPrice,
  currentAccount: state.main.currentAccount,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleCurrentGameChange: mainPageActions.handleCurrentGameChange,
  handleActiveTabChange: mainPageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyGamesItem);