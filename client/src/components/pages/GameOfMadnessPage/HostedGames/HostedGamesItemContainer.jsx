import { connect } from 'react-redux';
import HostedGamesItem from './HostedGamesItem';

const mapStateToProps = (state) => ({
  contractInstance: state.gameOfMadness.contractInstance,
  ethPrice: state.main.ethPrice,
});

export default connect(mapStateToProps, null)(HostedGamesItem);