import contractsAddresses from '../../appSettings';
import contractABI from '../../smart-contracts-abis/GameOfMadness';

const contractInitialization = (context) => {
  const contractInstance = window.web3.eth.contract(contractABI.abi).at(contractsAddresses.gameOfMadness);
  context.props.setContractInstance(contractInstance);
};

export default contractInitialization;