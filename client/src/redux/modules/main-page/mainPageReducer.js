import CONSTANTS from './mainPageActionConstants';

const defaultState = {
  currentAccount: undefined,
  ethPrice: undefined,
};

export default function (state = defaultState, {type, payload}) {
  switch (type) {
    case CONSTANTS.SET_CURRENT_METAMASK_ACCOUNT:
      return setCurrentMetamaskAccount(state, payload);

    case CONSTANTS.SET_ETH_PRICE:
      return setEthPrice(state, payload);

    default:
      return state;
  }
}

function setCurrentMetamaskAccount(state, account) {
  return {
    ...state,
    currentAccount: account,
    isCurrentGameLoaded: true,
  };
}

function setEthPrice(state, ethPrice) {
  return {
    ...state,
    ethPrice,
  }
}