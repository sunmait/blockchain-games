import CONSTANTS from './gameOfMadnessPageActionConstants';
import gameStatuses from '../../../helpers/gameOfMadness/gameStatuses';
import gameResults from "../../../helpers/guessNumberGame/gameResults";

export const setContractInstance = (contractInstance) => ({
  type: CONSTANTS.GAME_OF_MADNESS_SET_CONTRACT_INSTANCE,
  payload: contractInstance,
});

export const handleActiveTabChange = (tabId) => ({
  type: CONSTANTS.GAME_OF_MADNESS_HANDLE_ACTIVE_TAB_CHANGE,
  payload: tabId,
});

export const handleCurrentGameChange = (game) => dispatch => {
  dispatch({
    type: CONSTANTS.GAME_OF_MADNESS_TRIGGER_CURRENT_GAME_TAB_SPINNER,
  });
  dispatch({
    type: CONSTANTS.GAME_OF_MADNESS_HANDLE_CURRENT_GAME_CHANGE,
    payload: game,
  })
};

export const getHostedGames = () => async (dispatch, getState) => {
  const contractInstance = getState().gameOfMadness.contractInstance;
  const hostedGamesList = await getHostedGamesList(contractInstance);
  dispatch({
    type: CONSTANTS.GAME_OF_MADNESS_GET_HOSTED_GAMES,
    payload: hostedGamesList || [],
  });
};

function getHostedGamesList(contractInstance) {
  return new Promise((resolve) => {
    const {getHostedGamesIds} = contractInstance;
    getHostedGamesIds((err, answer) => {
      if (err) {
        console.log('error', err);
      } else {
        const hostedGamesIdsList = answer.map(item => {
          return Number(item);
        });
        resolve (
          Promise.all(getHostedGamesFieldsByIds(hostedGamesIdsList, contractInstance))
        );
      }
    });
  });
}

function getHostedGamesFieldsByIds(gamesIds, contractInstance) {
  const {getHostedGameFieldsById} = contractInstance;
  return gamesIds.map(gameId => {
    return new Promise((resolve) => {
      getHostedGameFieldsById(
        gameId,
        (err, result) => {
          if (err) {
            console.log('err: ', err);
          } else {
            const gamePrice = Number(result[1]);
            resolve({
              id: gameId,
              player1: result[0],
              player1TotalBet: gamePrice,
            });
          }
        }
      )
    });
  });
}

export const getUserGames = () => async (dispatch, getState) => {
  const contractInstance = getState().gameOfMadness.contractInstance;
  const userGamesList = await getUserGamesList(contractInstance);
  dispatch({
    type: CONSTANTS.GAME_OF_MADNESS_GET_USER_GAMES,
    payload: userGamesList || [],
  });
};

function getUserGamesList(contractInstance) {
  return new Promise((resolve) => {
    const {getUserGamesIds} = contractInstance;
    getUserGamesIds((err, answer) => {
      if (err) {
        console.log('error', err);
      } else {
        const userGamesList = answer.map(item => {
          return Number(item);
        });
        resolve(
          Promise.all(getUserGamesFieldsByIds(userGamesList, contractInstance))
        );
      }
    });
  });
}

function getUserGamesFieldsByIds(gamesIds, contractInstance) {
  const {getUserGameFieldsById} = contractInstance;
  return gamesIds.map(gameId => {
    return new Promise((resolve) => {
      getUserGameFieldsById(
        gameId,
        async (err, result) => {
          if (err) {
            console.log('err: ', err);
          } else {
            const player1TotalBet = Number(result[0]);
            const player2TotalBet = Number(result[1]);
            const gameStatusId = Number(result[2]);
            const gameResult = gameResults[Number(result[3])];
            const lastRaiseTime = Number(result[4]);
            const playerWhoBetLast = result[5];
            const betsHistory = result[6];
            const gamePlayers = await getGamePlayersById(gameId, contractInstance);
            resolve({
              player1: gamePlayers.player1,
              player2: gamePlayers.player2,
              id: gameId,
              player1TotalBet,
              player2TotalBet,
              status: gameStatuses[gameStatusId],
              result: gameResult,
              lastRaiseTime,
              playerWhoBetLast,
              betsHistory,
            });
          }
        }
      )
    });
  });
}

function getGamePlayersById(gameId, contractInstance) {
  const {getGamePlayersById} = contractInstance;
  return new Promise((resolve) => {
    getGamePlayersById(gameId, (err, result) => {
      if (err) {
        console.log('err: ', err);
      } else {
        resolve({
          player1: result[0],
          player2: result[1],
        });
      }
    });
  });
}

export const handleGameHostedEvent = (game) => (dispatch, getState) => {
  dispatch({
    type: CONSTANTS.GAME_OF_MADNESS_HANDLE_GAME_HOSTED_EVENT,
    payload: game,
  });
  const currentAccount = getState().main.currentAccount;
  if (game.player1 === currentAccount) {
    dispatch({
      type: CONSTANTS.GAME_OF_MADNESS_HANDLE_ADD_TO_USER_GAMES,
      payload: {
        id: game.id,
        player1: game.player1,
        player1TotalBet: game.player1TotalBet,
        status: gameStatuses[1],
      },
    });
  }
};

export const handleGameJoinedEvent = (game) => (dispatch, getState) => {
  dispatch({
    type: CONSTANTS.GAME_OF_MADNESS_HANDLE_GAME_JOINED_EVENT,
    payload: game,
  });
  const currentAccount = getState().main.currentAccount;
  if (game.player2 === currentAccount) {
    dispatch({
      type: CONSTANTS.GAME_OF_MADNESS_HANDLE_ADD_TO_USER_GAMES,
      payload: {
        id: game.id,
        player1: game.player1,
        player2: game.player2,
        player1TotalBet: game.player1TotalBet,
        player2TotalBet: game.player2TotalBet,
        status: gameStatuses[2],
        result: gameResults[0],
        lastRaiseTime: Number(game.lastRaiseTime),
        playerWhoBetLast: game.playerWhoBetLast,
        betsHistory: game.betsHistory,
      },
    });
  }
  if(game.player1 === currentAccount) {
    dispatch({
      type: CONSTANTS.GAME_OF_MADNESS_HANDLE_CHANGE_USER_GAME_STATUS,
      payload: {
        id: game.id,
      },
    });
  }
};

export const handleBetRaisedEvent = (game) => (dispatch) => {
  dispatch({
    type: CONSTANTS.GAME_OF_MADNESS_HANDLE_BET_RAISED_EVENT,
    payload: game,
  });
};

export const handleGameEndedEvent = (game) => ({
  type: CONSTANTS.GAME_OF_MADNESS_HANDLE_GAME_ENDED_EVENT,
  payload: game,
});