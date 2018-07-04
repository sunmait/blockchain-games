import CONSTANTS from './mainPageActionConstants';

export const setWeb3Provider = (provider) => ({
  type: CONSTANTS.SET_WEB3_PROVIDER,
  payload: provider,
});

export const setCurrentMetamaskAccount = (account) => ({
  type: CONSTANTS.SET_CURRENT_METAMASK_ACCOUNT,
  payload: account,
});

export const setEthPrice = (ethPrice) => ({
  type: CONSTANTS.SET_ETH_PRICE,
  payload: ethPrice,
});