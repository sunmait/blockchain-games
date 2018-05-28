import { combineReducers } from 'redux';
import main from './modules/main-page/mainPageReducer';

const rootReducer = combineReducers({
  main,
});

export default rootReducer;