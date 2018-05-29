import CONSTANTS from './mainPageActionConstants';

export const setContractInstance = (contractInstance) => ({
  type: CONSTANTS.SET_CONTRACT_INSTANCE,
  payload: contractInstance,
});

export const handleCurrentGameIdChange = (gameId) => ({
  type: CONSTANTS.HANDLE_CURRENT_GAME_ID_CHANGE,
  payload: gameId,
});

export const handleActiveTabChange = (tabId) => ({
  type: CONSTANTS.HANDLE_ACTIVE_TAB_CHANGE,
  payload: tabId,
});