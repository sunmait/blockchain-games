import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MainPage from './MainPage.jsx';

const mapStateToProps = (state) => ({
  localWeb3: state.main.localWeb3,
  currentAccount: state.main.currentAccount,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);