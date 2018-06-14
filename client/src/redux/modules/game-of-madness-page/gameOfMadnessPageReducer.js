import CONSTANTS from './gameOfMadnessPageActionConstants';

const defaultState = {
  contractInstance: undefined,
  activeTabId: 1,
  hostedGamesList: [],
  userGamesList: [],
  currentGame: null,
};

export default function (state = defaultState, {type, payload}) {
  switch(type) {
    case CONSTANTS.GAME_OF_MADNESS_SET_CONTRACT_INSTANCE:
      return setContractInstance(state, payload);

    case CONSTANTS.GAME_OF_MADNESS_HANDLE_ACTIVE_TAB_CHANGE:
      return handleActiveTabChange(state, payload);

    case CONSTANTS.GAME_OF_MADNESS_HANDLE_CURRENT_GAME_CHANGE:
      return handleCurrentGameChange(state, payload);

    case CONSTANTS.GAME_OF_MADNESS_GET_HOSTED_GAMES:
      return getHostedGames(state, payload);

    default:
      return state;
  }
}

function setContractInstance(state, contractInstance) {
  return {
    ...state,
    contractInstance,
  };
}

function handleActiveTabChange(state, tabId) {
  return {
    ...state,
    activeTabId: tabId,
  };
}

function handleCurrentGameChange(state, game) {
  return {
    ...state,
    currentGame: game,
  };
}

function getHostedGames(state, hostedGamesList) {
  return {
    ...state,
    hostedGamesList,
  };
}