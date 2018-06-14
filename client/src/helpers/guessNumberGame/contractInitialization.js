import contractsAddresses from '../../appSettings';
import contractABI from '../../smart-contracts-abis/GuessNumberGame';

const contractInitialization = (context) => {
  const contractInstance = window.web3.eth.contract(contractABI.abi).at(contractsAddresses.guessNumberGame);
  context.props.setContractInstance(contractInstance);
};

export default contractInitialization;