import contractsAddresses from '../../appSettings';
import contractABI from '../../smart-contracts-abis/GuessNumberGame';
import store from '../../redux/store';
import { setContractInstance } from '../../redux/modules/guess-number-game-page/guessNumberGamePageActions';

const contractInitialization = () => {
  const contractInstance = window.web3.eth.contract(contractABI.abi).at(contractsAddresses.guessNumberGame);
  store.dispatch(setContractInstance(contractInstance));
};

export default contractInitialization;