import CONSTANTS from './gameOfMadnessPageActionConstants';

const defaultState = {
  contractInstance: null,
  hostedGamesList: [],
  userGamesList: [],
};

export default function (state = defaultState, {type, payload}) {
  switch(type) {
    default:
      return state;
  }
}