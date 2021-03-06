import CONSTANTS from './guessNumberGamePageActionConstants';
import gameStatuses from '../../../helpers/guessNumberGame/gameStatuses';
import gameResults from '../../../helpers/guessNumberGame/gameResults';

export const setContractInstance = (contractInstance) => dispatch => {
  dispatch({
    type: CONSTANTS.GUESS_NUMBER_GAME_SET_CONTRACT_INSTANCE,
    payload: contractInstance,
  });

  dispatch(setGameSettings(contractInstance));
};

function setGameSettings(contractInstance){
  return function (dispatch) {
    dispatch(getHostedGames());
    dispatch(getUserGames());

    const gameHostedEvent = contractInstance.GameHosted();

    gameHostedEvent.watch((error, result) => {
      if (result) {
        const hostedGame = {
          id: Number(result.args.gameId),
          price: Number(result.args.betAmount),
          player1: result.args.player1,
        };
        dispatch(handleGameHostedEvent(hostedGame));
      }
    });

    const GameJoinedEvent = contractInstance.GameJoined();

    GameJoinedEvent.watch((error, result) => {
      if (result) {
        const joinedGame = {
          id: Number(result.args.gameId),
          price: Number(result.args.betAmount),
          player1: result.args.player1,
          player2: result.args.player2,
          gameJoinTime: Number(result.args.gameJoinTime),
        };
        dispatch(handleGameJoinedEvent(joinedGame));
      }
    });

    const GameEndedEvent = contractInstance.GameEnded();

    GameEndedEvent.watch((error, result) => {
      if (result) {
        const endedGame = {
          id: Number(result.args.gameId),
          gameResult: Number(result.args.result)
        };
        dispatch(handleGameEndedEvent(endedGame));
      }
    });
  }
}

export const handleCurrentGameChange = (gameId) => async (dispatch, getState) => {
  dispatch({
    type: CONSTANTS.GUESS_NUMBER_GAME_TRIGGER_CURRENT_GAME_TAB_SPINNER,
  });
  let game = {
    id: gameId,
    player1: undefined,
    price: undefined,
    status: undefined,
    result: gameResults[0],
  };

  if (Number.isInteger(gameId)) {
    const contractInstance = getState().guessNumberGame.contractInstance;
    game = await getCurrentGameFieldsById(gameId, contractInstance);
  }

  dispatch({
    type: CONSTANTS.GUESS_NUMBER_GAME_HANDLE_CURRENT_GAME_CHANGE,
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
          const player1 = result[0];
          const player2 = result[1];
          const gamePrice = Number(result[2]);
          const gameStatus = gameStatuses[Number(result[3])];
          const gameResult = gameResults[Number(result[4])];
          const hostLastBets = await getCurrentGameHostLastBets(gameId, contractInstance);
          resolve({
            player1,
            player2,
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
  type: CONSTANTS.GUESS_NUMBER_GAME_HANDLE_ACTIVE_TAB_CHANGE,
  payload: tabId,
});

export const handleGameHostedEvent = (game) => (dispatch, getState) => {
  dispatch({
    type: CONSTANTS.GUESS_NUMBER_GAME_HANDLE_GAME_HOSTED_EVENT,
    payload: game,
  });
  const currentAccount = getState().main.currentAccount;
  if (game.player1 === currentAccount) {
    dispatch({
      type: CONSTANTS.GUESS_NUMBER_GAME_HANDLE_ADD_TO_USER_GAMES,
      payload: {
        id: game.id,
        price: game.price,
        player1: game.player1,
        status: gameStatuses[1],
      },
    });
  }
};

export const handleGameJoinedEvent = (game) => (dispatch, getState) => {
  dispatch({
    type: CONSTANTS.GUESS_NUMBER_GAME_HANDLE_GAME_JOINED_EVENT,
    payload: game,
  });
  const currentAccount = getState().main.currentAccount;
  if (game.player2 === currentAccount) {
    dispatch({
      type: CONSTANTS.GUESS_NUMBER_GAME_HANDLE_ADD_TO_USER_GAMES,
      payload: {
        player1: game.player1,
        player2: game.player2,
        id: game.id,
        price: game.price,
        status: gameStatuses[2],
        gameJoinTime: game.gameJoinTime,
      },
    });
  }
  if(game.player1 === currentAccount) {
    dispatch({
      type: CONSTANTS.GUESS_NUMBER_GAME_HANDLE_CHANGE_USER_GAME_AFTER_JOIN_EVENT,
      payload: {
        id: game.id,
        gameJoinTime: game.gameJoinTime,
      },
    });
  }
};

export const handleGameEndedEvent = (game) => ({
  type: CONSTANTS.GUESS_NUMBER_GAME_HANDLE_GAME_ENDED_EVENT,
  payload: game,
});

export const getHostedGames = () => async (dispatch, getState) => {
  const contractInstance = getState().guessNumberGame.contractInstance;
  const hostedGamesList = await getHostedGamesList(contractInstance);
  dispatch({
    type: CONSTANTS.GUESS_NUMBER_GAME_GET_HOSTED_GAMES,
    payload: hostedGamesList || [],
  });
};

export const getUserGames = () => async (dispatch, getState) => {
  const contractInstance = getState().guessNumberGame.contractInstance;
  const userGamesList = await getUserGamesList(contractInstance);
  dispatch({
    type: CONSTANTS.GUESS_NUMBER_GAME_GET_USER_GAMES,
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
              player1: result[0],
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
            const statusId = Number(result[3]);
            resolve({
              player1: result[0],
              player2: result[1],
              id: gameId,
              price: gamePrice,
              status: gameStatuses[statusId],
              gameJoinTime: Number(result[5]),
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