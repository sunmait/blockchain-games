import CONSTANTS from './mainPageActionConstants';

const defaultState = {
  contractInstance: null,
  activeTabId: 1,
  currentGame: {
    id: null,
    status: null,
    price: undefined,
  },
  hostedGamesList: [],
};

export default function (state = defaultState, {type, payload}) {
  switch (type) {
    case CONSTANTS.SET_CONTRACT_INSTANCE:
      return handleSettingContractInstance(state, payload);

    case CONSTANTS.HANDLE_ACTIVE_TAB_CHANGE:
      return handleActiveTabChange(state, payload);

    case CONSTANTS.HANDLE_CURRENT_GAME_ID_CHANGE:
      return handleCurrentGameIdChange(state, payload);

    case CONSTANTS.GET_CURRENT_GAME_FIELDS:
      return handleCurrentGameFieldsChange(state, payload);

    case CONSTANTS.GET_HOSTED_GAMES:
      return getHostedGames(state, payload);

    case CONSTANTS.HANDLE_GAME_HOSTED_EVENT:
      return handleGameHostedEvent(state, payload);

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

function handleCurrentGameFieldsChange(state, payload) {
  const currentGame = state.currentGame;
  currentGame.status = payload.gameStatus;
  currentGame.price = payload.gamePrice;

  return {
    ...state,
    currentGame,
  };
}

function getHostedGames(state, hostedGamesList) {
  return {
    ...state,
    hostedGamesList,
  };
}

function handleGameHostedEvent(state, game) {
  const hostedGamesList = state.hostedGamesList;
  hostedGamesList.push(game);
  return {
    ...state,
    hostedGamesList,
  };
}