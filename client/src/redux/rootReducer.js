import { combineReducers } from 'redux';
import main from './modules/main-page/mainPageReducer';
import gameOfMadness from './modules/game-of-madness-page/gameOfMadnessPageReducer';

const rootReducer = combineReducers({
  main,
  gameOfMadness,
});

export default rootReducer;