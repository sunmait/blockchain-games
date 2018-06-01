import CONSTANTS from './mainPageActionConstants';

const defaultState = {
  contractInstance: null,
  activeTabId: 1,
  currentGame: {
    id: null,
    status: null,
  },
};

export default function (state = defaultState, {type, payload}) {
  switch (type) {
    case CONSTANTS.SET_CONTRACT_INSTANCE:
      return handleSettingContractInstance(state, payload);

    case CONSTANTS.HANDLE_ACTIVE_TAB_CHANGE:
      return handleActiveTabChange(state, payload);

    case CONSTANTS.HANDLE_CURRENT_GAME_ID_CHANGE:
      return handleCurrentGameIdChange(state, payload);

    case CONSTANTS.HANDLE_CURRENT_GAME_STATUS_CHANGE:
      return handleCurrentGameStatusChange(state, payload);

    default:
      return state;
  }
}

function handleSettingContractInstance(state, instance) {
  return {
    ...state,
    contractInstance: instance,
  };
}

function handleActiveTabChange(state, tabId) {
  return {
    ...state,
    activeTabId: tabId,
  };
}

function handleCurrentGameIdChange(state, gameId) {
  const currentGame = state.currentGame;
  currentGame.id = gameId;

  return {
    ...state,
    currentGame,
  };
}

function handleCurrentGameStatusChange(state, status) {
  const currentGame = state.currentGame;
  currentGame.status = status;

  return {
    ...state,
    currentGame,
  };
}