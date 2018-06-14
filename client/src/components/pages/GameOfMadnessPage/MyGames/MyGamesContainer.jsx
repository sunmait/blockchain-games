import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyGames from './MyGames.jsx';

const mapStateToProps = (state) => ({
  userGamesList: state.gameOfMadness.userGamesList,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyGames);