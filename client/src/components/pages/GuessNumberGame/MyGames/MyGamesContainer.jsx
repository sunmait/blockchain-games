import { connect } from 'react-redux';
import MyGames from './MyGames.jsx';

const mapStateToProps = (state) => ({
  userGamesList: state.guessNumberGame.userGamesList,
});

export default connect(mapStateToProps, null)(MyGames);