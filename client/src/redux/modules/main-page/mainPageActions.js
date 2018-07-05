import CONSTANTS from './mainPageActionConstants';
import contractsAddresses from '../../../appSettings';
import guessNumberGameContractABI from '../../../smart-contracts-abis/GuessNumberGame';
import gameOfMadnessContractABI from '../../../smart-contracts-abis/GameOfMadness';
import { setContractInstance as setGuessNumberGameContractInstance } from '../guess-number-game-page/guessNumberGamePageActions';
import { setContractInstance as setGameOfMadnessContractInstance } from '../game-of-madness-page/gameOfMadnessPageActions';

export const setWeb3Provider = (localWeb3) => dispatch => {
  dispatch({
    type: CONSTANTS.SET_WEB3_PROVIDER,
    payload: localWeb3,
  });
  dispatch({
    type: CONSTANTS.SET_CURRENT_METAMASK_ACCOUNT,
    payload: localWeb3.eth.accounts[0],
  });

  const guessNumberGameContractInstance = localWeb3.eth.contract(guessNumberGameContractABI.abi).at(contractsAddresses.guessNumberGame);
  dispatch(setGuessNumberGameContractInstance(guessNumberGameContractInstance));

  const gameOfMadnessContractInstance = localWeb3.eth.contract(gameOfMadnessContractABI.abi).at(contractsAddresses.gameOfMadness);
  dispatch(setGameOfMadnessContractInstance(gameOfMadnessContractInstance));
};

export const setEthPrice = (ethPrice) => ({
  type: CONSTANTS.SET_ETH_PRICE,
  payload: ethPrice,
});