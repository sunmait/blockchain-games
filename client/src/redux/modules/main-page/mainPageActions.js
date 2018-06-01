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

export const getHostedGames = (hostedGamesList) => ({
  type: CONSTANTS.GET_HOSTED_GAMES,
  payload: hostedGamesList,
});

export const handleGameHostedEvent = (game) => ({
  type: CONSTANTS.HANDLE_GAME_HOSTED_EVENT,
  payload: game,
});