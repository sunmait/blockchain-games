import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MainPage from './MainPage.jsx';
import * as mainPageActions from '../../../redux/modules/main-page/mainPageActions';

const mapStateToProps = (state) => ({
  contractInstance: state.main.contractInstance,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setContractInstance: mainPageActions.setContractInstance,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);