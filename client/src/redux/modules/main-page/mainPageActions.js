import CONSTANTS from './mainPageActionConstants';
import gameStatuses from '../../../helpers/gameStatuses';
import gameResults from '../../../helpers/gameResults';

export const setContractInstance = (contractInstance) => ({
  type: CONSTANTS.SET_CONTRACT_INSTANCE,
  payload: contractInstance,
});

export const setCurrentMetamaskAccount = (account) => ({
  type: CONSTANTS.SET_CURRENT_METAMASK_ACCOUNT,
  payload: account,
});

export const setEthPrice = (ethPrice) => ({
  type: CONSTANTS.SET_ETH_PRICE,
  payload: ethPrice,
});

export const handleCurrentGameChange = (gameId) => async (dispatch, getState) => {
  dispatch({
    type: CONSTANTS.TRIGGER_CURRENT_GAME_TAB_SPINNER,
  });
  let game = {
    id: gameId,
    price: undefined,
    status: undefined,
    result: gameResults[0],
  };

  if (Number.isInteger(gameId)) {
    const contractInstance = getState().main.contractInstance;
    game = await getCurrentGameFieldsById(gameId, contractInstance);
  }

  dispatch({
    type: CONSTANTS.HANDLE_CURRENT_GAME_CHANGE,
    payload: game,
  });
};

function getCurrentGameFieldsById(gameId, contractInstance) {
  return new Promise((resolve) => {
    const {getGameById} = contractInstance;
    getGameById(
      gameId,
      async (err, result) => {
        if (err) {
          console.log('err: ', err);
        } else {
          const gamePrice = Number(result[2]);
          const gameStatus = gameStatuses[Number(result[5])];
          const gameResult = gameResults[Number(result[6])];
          const hostLastBets = await getCurrentGameHostLastBets(gameId, contractInstance);
          resolve({
            id: gameId,
            price: gamePrice,
            status: gameStatus,
            result: gameResult,
            hostLastBets,
          });
        }
      });
  });
}

function getCurrentGameHostLastBets(gameId, contractInstance) {
  return new Promise((resolve) => {
    const {getUserLastBets} = contractInstance;
    getUserLastBets(
      gameId,
      (err, result) => {
        if (err) {
          console.log('err: ', err);
        } else {
          resolve(result.map(bet => Number(bet)));
        }
      });
  });
}

export const handleActiveTabChange = (tabId) => ({
  type: CONSTANTS.HANDLE_ACTIVE_TAB_CHANGE,
  payload: tabId,
});

export const handleGameHostedEvent = (game) => (dispatch, getState) => {
  dispatch({
    type: CONSTANTS.HANDLE_GAME_HOSTED_EVENT,
    payload: game,
  });
  const currentAccount = getState().main.currentAccount;
  if (game.player1 === currentAccount) {
    dispatch({
      type: CONSTANTS.HANDLE_ADD_TO_USER_GAMES,
      payload: {
        id: game.id,
        price: game.price,
        status: gameStatuses[1],
      },
    });
  }
};

export const handleGameJoinedEvent = (game) => (dispatch, getState) => {
  dispatch({
    type: CONSTANTS.HANDLE_GAME_JOINED_EVENT,
    payload: game,
  });
  const currentAccount = getState().main.currentAccount;
  if (game.player2 === currentAccount) {
    dispatch({
      type: CONSTANTS.HANDLE_ADD_TO_USER_GAMES,
      payload: {
        id: game.id,
        price: game.price,
        status: gameStatuses[2],
      },
    });
  }
  if(game.player1 === currentAccount) {
    dispatch({
      type: CONSTANTS.HANDLE_CHANGE_USER_GAME_STATUS,
      payload: {
        id: game.id,
      },
    });
  }
};

export const handleGameEndedEvent = (game) => ({
  type: CONSTANTS.HANDLE_GAME_ENDED_EVENT,
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
            const statusId = Number(result[5]);
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
        );
      }
    });
  });

}