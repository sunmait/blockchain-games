import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Router from './Router.jsx';
import * as mainPageActions from "../../redux/modules/main-page/mainPageActions";

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setEthPrice: mainPageActions.setEthPrice,
  setCurrentMetamaskAccount: mainPageActions.setCurrentMetamaskAccount,
}, dispatch);

export default connect(null, mapDispatchToProps)(Router);