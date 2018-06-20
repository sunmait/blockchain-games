import { connect } from 'react-redux';
import HostGame from './HostGame.jsx';

const mapStateToProps = (state) => ({
  contractInstance: state.guessNumberGame.contractInstance,
  ethPrice: state.main.ethPrice,
});

export default connect(mapStateToProps, null)(HostGame);