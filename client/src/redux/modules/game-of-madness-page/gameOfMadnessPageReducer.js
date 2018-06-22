import CONSTANTS from './gameOfMadnessPageActionConstants';
import gameStatuses from '../../../helpers/gameOfMadness/gameStatuses';

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

    case CONSTANTS.GAME_OF_MADNESS_GET_USER_GAMES:
      return getUserGames(state, payload);

    case CONSTANTS.GAME_OF_MADNESS_HANDLE_CHANGE_USER_GAME_STATUS:
      return handleChangeUserGameStatus(state, payload);

    case CONSTANTS.GAME_OF_MADNESS_HANDLE_ADD_TO_USER_GAMES:
      return handleAddToUserGames(state, payload);

    case CONSTANTS.GAME_OF_MADNESS_HANDLE_GAME_HOSTED_EVENT:
      return handleGameHostedEvent(state, payload);

    case CONSTANTS.GAME_OF_MADNESS_HANDLE_GAME_JOINED_EVENT:
      return handleGameJoinedEvent(state, payload);

    case CONSTANTS.GAME_OF_MADNESS_HANDLE_BET_RAISED_EVENT:
      return handleBetRaisedEvent(state, payload);

    case CONSTANTS.GAME_OF_MADNESS_HANDLE_GAME_ENDED_EVENT:
      return handleGameEndedEvent(state, payload);

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

function getUserGames(state, userGamesList) {
  return {
    ...state,
    userGamesList,
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

function handleGameJoinedEvent(state, payload) {
  const hostedGamesList = state.hostedGamesList.slice();
  const gameIndex = hostedGamesList.findIndex(game => game.id === payload.id);
  hostedGamesList.splice(gameIndex, 1);
  return {
    ...state,
    hostedGamesList,
  };
}

function handleChangeUserGameStatus(state, payload) {
  const userGamesList = state.userGamesList.slice();
  const gameIndex = userGamesList.findIndex(game => game.id === payload.id);
  let userListCurrentGame = null;
  if (gameIndex !== -1) {
    userListCurrentGame = {...userGamesList[gameIndex]};
    userListCurrentGame.status = gameStatuses[2];
    userGamesList[gameIndex] = userListCurrentGame;
  }
  return {
    ...state,
    userGamesList,
  };
}

function handleBetRaisedEvent(state, payload) {
  let currentGame = state.currentGame;
  if (currentGame) {
    currentGame = {...currentGame};
    if (currentGame.id === payload.id) {
      currentGame.status = gameStatuses[2];
      currentGame.player1TotalBet = payload.player1TotalBet;
      currentGame.player2TotalBet = payload.player2TotalBet;
      currentGame.lastRaiseTime = payload.lastRaiseTime;
      currentGame.playerWhoBetLast = payload.playerWhoBetLast;
      currentGame.betsHistory = payload.betsHistory;
    }
  }

  const userGamesList = state.userGamesList.slice();
  const gameIndex = userGamesList.findIndex(game => game.id === payload.id);
  let userListCurrentGame = null;
  if (gameIndex !== -1) {
    userListCurrentGame = {...userGamesList[gameIndex]};
    userListCurrentGame.status = gameStatuses[2];
    userListCurrentGame.player1TotalBet = payload.player1TotalBet;
    userListCurrentGame.player2TotalBet = payload.player2TotalBet;
    userListCurrentGame.lastRaiseTime = payload.lastRaiseTime;
    userListCurrentGame.playerWhoBetLast = payload.playerWhoBetLast;
    userGamesList[gameIndex] = userListCurrentGame;
  }
  return {
    ...state,
    currentGame,
    userGamesList,
  };
}

function handleGameEndedEvent(state, payload) {
  let currentGame = state.currentGame;
  if (currentGame) {
    currentGame = {...currentGame};
    if (currentGame.id === payload.id) {
      currentGame.status = gameStatuses[3];
    }
  }

  const userGamesList = state.userGamesList.slice();
  const gameIndex = userGamesList.findIndex(game => game.id === payload.id);
  let userListCurrentGame = null;
  if (gameIndex !== -1) {
    userListCurrentGame = {...userGamesList[gameIndex]};
    userListCurrentGame.status = gameStatuses[3];
    userGamesList[gameIndex] = userListCurrentGame;
  }
  return {
    ...state,
    currentGame,
    userGamesList,
  };
}