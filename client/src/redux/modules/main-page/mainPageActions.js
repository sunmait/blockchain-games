import CONSTANTS from './mainPageActionConstants';

export const setCurrentMetamaskAccount = (account) => ({
  type: CONSTANTS.SET_CURRENT_METAMASK_ACCOUNT,
  payload: account,
});

export const setEthPrice = (ethPrice) => ({
  type: CONSTANTS.SET_ETH_PRICE,
  payload: ethPrice,
});