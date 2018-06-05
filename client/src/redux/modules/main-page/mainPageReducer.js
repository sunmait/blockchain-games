import CONSTANTS from './mainPageActionConstants';
import gameStatuses from '../../../helpers/gameStatuses';

const defaultState = {
  contractInstance: null,
  currentAccount: null,
  activeTabId: 1,
  currentGame: {
    id: null,
    status: null,
    price: undefined,
  },
  hostedGamesList: [],
  userGamesList: [],
};

export default function (state = defaultState, {type, payload}) {
  switch (type) {
    case CONSTANTS.SET_CONTRACT_INSTANCE:
      return setContractInstance(state, payload);

    case CONSTANTS.SET_CURRENT_METAMASK_ACCOUNT:
      return setCurrentMetamaskAccount(state, payload);

    case CONSTANTS.HANDLE_ACTIVE_TAB_CHANGE:
      return handleActiveTabChange(state, payload);

    case CONSTANTS.HANDLE_CURRENT_GAME_ID_CHANGE:
      return handleCurrentGameIdChange(state, payload);

    case CONSTANTS.GET_CURRENT_GAME_FIELDS:
      return handleCurrentGameFieldsChange(state, payload);

    case CONSTANTS.GET_HOSTED_GAMES:
      return getHostedGames(state, payload);

    case CONSTANTS.GET_USER_GAMES:
      return getUserGames(state, payload);

    case CONSTANTS.HANDLE_GAME_HOSTED_EVENT:
      return handleGameHostedEvent(state, payload);

    case CONSTANTS.HANDLE_GAME_JOINED_EVENT:
      return handleGameJoinedEvent(state, payload);

    case CONSTANTS.HANDLE_GAME_ENDED_EVENT:
      return handleGameEndedEvent(state, payload);

    case CONSTANTS.HANDLE_ADD_TO_USER_GAMES:
      return handleAddToUserGames(state, payload);

    default:
      return state;
  }
}

function setContractInstance(state, instance) {
  return {
    ...state,
    contractInstance: instance,
  };
}

function setCurrentMetamaskAccount(state, account) {
  return {
    ...state,
    currentAccount: account,
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
  const hostedGamesList = state.hostedGamesList.slice();
  hostedGamesList.push(game);
  return {
    ...state,
    hostedGamesList,
  };
}

function handleGameJoinedEvent(state, payload) {
  const hostedGamesList = state.hostedGamesList.slice();
  const gameIndex = hostedGamesList.findIndex(game => game.id === payload.id);
  hostedGamesList.splice(gameIndex, 1);
  return {
    ...state,
    hostedGamesList,
  };
}

function handleGameEndedEvent(state, payload) {
  const currentGame = state.currentGame;
  if (currentGame.id === payload.id) {
    currentGame.status = gameStatuses[3];
  }
  const userGamesList = state.userGamesList.slice();
  const gameIndex = userGamesList.findIndex(game => game.id === payload.id);
  if (gameIndex !== -1) {
    userGamesList[gameIndex].status = gameStatuses[3];
  }
  return {
    ...state,
    currentGame,
    userGamesList,
  };
}

function handleAddToUserGames(state, payload) {
  const userGamesList = state.userGamesList.slice();
  const gameIndex = userGamesList.findIndex(game => game.id === payload.id);
  if (gameIndex === -1) {
    userGamesList.push(payload);
  }
  return {
    ...state,
    userGamesList,
  };
}

function getUserGames(state, userGamesList) {
  return {
    ...state,
    userGamesList,
  };
}