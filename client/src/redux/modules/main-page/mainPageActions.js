import CONSTANTS from './mainPageActionConstants';

export const setContractInstance = (contractInstance) => ({
  type: CONSTANTS.SET_CONTRACT_INSTANCE,
  payload: contractInstance,
});