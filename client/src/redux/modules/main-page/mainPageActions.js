import CONSTANTS from './mainPageActionConstants';
import gameStatuses from '../../../helpers/gameStatuses';

export const setContractInstance = (contractInstance) => ({
  type: CONSTANTS.SET_CONTRACT_INSTANCE,
  payload: contractInstance,
});

export const handleCurrentGameIdChange = (gameId) => (dispatch, getState) => {
  dispatch({
      type: CONSTANTS.HANDLE_CURRENT_GAME_ID_CHANGE,
      payload: gameId,
  });

  const contractInstance = getState().main.contractInstance;
  const {getGameById} = contractInstance;
  getGameById(
    gameId,
    (err, result) => {
    if (err) {
      console.log('err: ', err);
    } else {
      const gamePrice = Number(result[2]);
      const gameStatus = gameStatuses[Number(result[5])];
      dispatch({
        type: CONSTANTS.GET_CURRENT_GAME_FIELDS,
        payload: {
          gamePrice,
          gameStatus,
        },
      });
    }
  });
};

export const handleActiveTabChange = (tabId) => ({
  type: CONSTANTS.HANDLE_ACTIVE_TAB_CHANGE,
  payload: tabId,
});

export const handleGameHostedEvent = (game) => ({
  type: CONSTANTS.HANDLE_GAME_HOSTED_EVENT,
  payload: game,
});

export const handleGameJoinedEvent = (game) => ({
  type: CONSTANTS.HANDLE_GAME_JOINED_EVENT,
  payload: game,
});

export const getHostedGames = () => async (dispatch, getState) => {
  const contractInstance = getState().main.contractInstance;
  const hostedGamesList = await getHostedGamesList(contractInstance);
  dispatch({
    type: CONSTANTS.GET_HOSTED_GAMES,
    payload: hostedGamesList || [],
  });
};

export const getUserGames = () => async (dispatch, getState) => {
  const contractInstance = getState().main.contractInstance;
  const userGamesList = await getUserGamesList(contractInstance);
  dispatch({
    type: CONSTANTS.GET_USER_GAMES,
    payload: userGamesList || [],
  });
};

function getHostedGamesFieldsByIds(gamesIds, contractInstance) {
  const {getGameById} = contractInstance;
  return gamesIds.map(gameId => {
    return new Promise((resolve) => {
      getGameById(
        gameId,
        (err, result) => {
          if (err) {
            console.log('err: ', err);
          } else {
            const gamePrice = Number(result[2]);
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
            .then((response) => {
              return response;
            })
        );
      }
    });
  });
}

function getUserGamesFieldsByIds(gamesIds, contractInstance) {
  const {getGameById} = contractInstance;
  return gamesIds.map(gameId => {
    return new Promise((resolve) => {
      getGameById(
        gameId,
        (err, result) => {
          if (err) {
            console.log('err: ', err);
          } else {
            const gamePrice = Number(result[2]);
            const statusId = Number[result[5]];
            resolve({
              id: gameId,
              price: gamePrice,
              status: gameStatuses[statusId],
            });
          }
        }
      )
    });
  });
}

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
          .then((response) => {
            return response;
          })
        );
      }
    });
  });

}