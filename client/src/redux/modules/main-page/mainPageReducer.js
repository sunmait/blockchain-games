import CONSTANTS from './mainPageActionConstants';

const defaultState = {
  currentAccount: undefined,
  ethPrice: undefined,
  localWeb3: undefined,
};

export default function (state = defaultState, {type, payload}) {
  switch (type) {
    case CONSTANTS.SET_WEB3_PROVIDER:
      return setWeb3Provider(state, payload);

    case CONSTANTS.SET_CURRENT_METAMASK_ACCOUNT:
      return setCurrentMetamaskAccount(state, payload);

    case CONSTANTS.SET_ETH_PRICE:
      return setEthPrice(state, payload);

    default:
      return state;
  }
}

function setWeb3Provider(state, provider) {
  return {
    ...state,
    localWeb3: provider,
  };
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