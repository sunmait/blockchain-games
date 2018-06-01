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
      const gameStatus = gameStatuses[Number(result[4])];
      dispatch({
        type: CONSTANTS.HANDLE_CURRENT_GAME_STATUS_CHANGE,
        payload: gameStatus,
      });
    }
  });
};

export const handleActiveTabChange = (tabId) => ({
  type: CONSTANTS.HANDLE_ACTIVE_TAB_CHANGE,
  payload: tabId,
});