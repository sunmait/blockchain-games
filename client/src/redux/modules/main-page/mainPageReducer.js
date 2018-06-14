import CONSTANTS from './mainPageActionConstants';
import gameStatuses from '../../../helpers/guessNumberGame/gameStatuses';

const defaultState = {
  contractInstance: null,
  currentAccount: null,
  ethPrice: undefined,
  activeTabId: 1,
  currentGame: {
    id: null,
    status: undefined,
    price: undefined,
    hostLastBets: [],
  },
  isCurrentGameLoaded: false,
  hostedGamesList: [],
  isHostedGamesLoaded: false,
  userGamesList: [],
  isUserGamesLoaded: false,
};

export default function (state = defaultState, {type, payload}) {
  switch (type) {
    case CONSTANTS.SET_CONTRACT_INSTANCE:
      return setContractInstance(state, payload);

    case CONSTANTS.SET_CURRENT_METAMASK_ACCOUNT:
      return setCurrentMetamaskAccount(state, payload);

    case CONSTANTS.SET_ETH_PRICE:
      return setEthPrice(state, payload);

    case CONSTANTS.HANDLE_ACTIVE_TAB_CHANGE:
      return handleActiveTabChange(state, payload);

    case CONSTANTS.HANDLE_CURRENT_GAME_CHANGE:
      return handleCurrentGameChange(state, payload);

    case CONSTANTS.TRIGGER_CURRENT_GAME_TAB_SPINNER:
      return triggerCurrentGameTabSpinner(state);

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

    case CONSTANTS.HANDLE_CHANGE_USER_GAME_STATUS:
      return handleChangeUserGameStatus(state, payload);

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
    isCurrentGameLoaded: true,
  };
}

function setEthPrice(state, ethPrice) {
  return {
    ...state,
    ethPrice,
  }
}

function handleActiveTabChange(state, tabId) {
  return {
    ...state,
    activeTabId: tabId,
  };
}

function handleCurrentGameChange(state, currentGame) {
  return {
    ...state,
    currentGame,
    isCurrentGameLoaded: true,
  };
}

function triggerCurrentGameTabSpinner(state) {
  return {
    ...state,
    isCurrentGameLoaded: false,
  };
}

function getHostedGames(state, hostedGamesList) {
  return {
    ...state,
    hostedGamesList,
    isHostedGamesLoaded: true,
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

function handleChangeUserGameStatus(state, payload) {
  const userGamesList = state.userGamesList.slice();
  const gameIndex = userGamesList.findIndex(game => game.id === payload.id);
  if (gameIndex !== -1) {
    userGamesList[gameIndex].status = gameStatuses[2];
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
    isUserGamesLoaded: true,
  };
}