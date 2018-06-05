import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from './Header.jsx';
import * as mainPageActions from '../../../redux/modules/main-page/mainPageActions';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  handleCurrentGameChange: mainPageActions.handleCurrentGameChange,
  handleActiveTabChange: mainPageActions.handleActiveTabChange,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);