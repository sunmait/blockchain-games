import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CurrentGame from './CurrentGame.jsx';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CurrentGame);