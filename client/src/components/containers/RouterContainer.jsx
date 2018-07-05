import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Router from './Router.jsx';
import * as mainPageActions from "../../redux/modules/main-page/mainPageActions";

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setEthPrice: mainPageActions.setEthPrice,
}, dispatch);

export default connect(null, mapDispatchToProps)(Router);