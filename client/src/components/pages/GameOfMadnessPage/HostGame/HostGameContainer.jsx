import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HostGame from './HostGame.jsx';

const mapStateToProps = (state) => ({
  contractInstance: state.gameOfMadness.contractInstance,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostGame);