import CONSTANTS from './mainPageActionConstants';

const defaultState = {
  contractInstance: null,
};

export default function (state = defaultState, {type, payload}) {
  switch (type) {
    case CONSTANTS.SET_CONTRACT_INSTANCE:
      return handleSettingContractInstance(state, payload);

    default:
      return state;
  }
}

function handleSettingContractInstance(state, instance) {
  return  {
    ...state,
    contractInstance: instance,
  };
}