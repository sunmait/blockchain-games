import CONSTANTS from './gameOfMadnessPageActionConstants';
import gameStatuses from '../../../helpers/gameOfMadness/gameStatuses';

export const setContractInstance = (contractInstance) => ({
  type: CONSTANTS.GAME_OF_MADNESS_SET_CONTRACT_INSTANCE,
  payload: contractInstance,
});

export const handleActiveTabChange = (tabId) => ({
  type: CONSTANTS.GAME_OF_MADNESS_HANDLE_ACTIVE_TAB_CHANGE,
  payload: tabId,
});

export const handleCurrentGameChange = (game) => ({
  type: CONSTANTS.GAME_OF_MADNESS_HANDLE_CURRENT_GAME_CHANGE,
  payload: game,
});

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
              price: gamePrice,
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
        (err, result) => {
          if (err) {
            console.log('err: ', err);
          } else {
            const player1TotalBet = Number(result[0]);
            const player2TotalBet = Number(result[1]);
            const gameStatusId = Number(result[2]);
            const gameResult = Number(result[3]);
            const lastRaiseTime = Number(result[4]);
            const playerWhoBetLast = result[5];
            resolve({
              id: gameId,
              player1TotalBet,
              player2TotalBet,
              status: gameStatuses[gameStatusId],
              result: gameResult,
              lastRaiseTime,
              playerWhoBetLast,
            });
          }
        }
      )
    });
  });
}