import { combineReducers } from 'redux';
import main from './modules/main-page/mainPageReducer';
import gameOfMadness from './modules/game-of-madness-page/gameOfMadnessPageReducer';
import guessNumberGame from './modules/guess-number-game-page/guessNumberGamePageReducer'

const rootReducer = combineReducers({
  main,
  guessNumberGame,
  gameOfMadness,
});

export default rootReducer;