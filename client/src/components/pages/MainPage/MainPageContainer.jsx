import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MainPage from './MainPage.jsx';
import * as mainPageActions from '../../../redux/modules/main-page/mainPageActions';

const mapStateToProps = (state) => ({
  contractInstance: state.main.contractInstance,
  currentGameId: state.main.currentGameId,
  activeTabId: state.main.activeTabId,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setContractInstance: mainPageActions.setContractInstance,
  handleCurrentGameIdChange: mainPageActions.handleCurrentGameIdChange,
  handleActiveTabChange: mainPageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);