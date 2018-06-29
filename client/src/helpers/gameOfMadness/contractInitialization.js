import contractsAddresses from '../../appSettings';
import contractABI from '../../smart-contracts-abis/GameOfMadness';
import store from '../../redux/store';
import { setContractInstance } from '../../redux/modules/game-of-madness-page/gameOfMadnessPageActions';

const contractInitialization = () => {
  const contractInstance = window.web3.eth.contract(contractABI.abi).at(contractsAddresses.gameOfMadness);
  store.dispatch(setContractInstance(contractInstance));
};

export default contractInitialization;