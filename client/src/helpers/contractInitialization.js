import {contractAddress} from '../appSettings';
import contractABI from '../smart-contracts-abis/GuessNumberGame';

const contractInitialization = (context) => {
  if (typeof web3 !== 'undefined') {
    // window.web3 = new Web3(web3.currentProvider);
    // const contractInstance = window.web3.eth.contract(contractABI.abi).at(contractAddress);
    const contractInstance = window.web3.eth.contract(contractABI.abi).at(contractAddress);
    context.props.setContractInstance(contractInstance);

    if (window.web3.currentProvider.isMetaMask === true) {
      window.web3.eth.getAccounts((error, accounts) => {
        if (accounts.length === 0) {
          console.log('no account');
          // there is no active accounts in MetaMask
        }
        else {
          console.log('all is fine');
          // It's ok

          context.props.setCurrentMetamaskAccount(window.web3.eth.accounts[0]);

          context.props.getHostedGames();
          context.props.getUserGames();

          const gameHostedEvent = context.props.contractInstance.GameHosted({});

          gameHostedEvent.watch((error, result) => {
            if (result) {
              const hostedGame = {
                id: Number(result.args.gameId),
                price: Number(result.args.value),
                player1: result.args.player1,
              };
              context.props.handleGameHostedEvent(hostedGame);
            }
          });

          const GameJoinedEvent = context.props.contractInstance.GameJoined({});

          GameJoinedEvent.watch((error, result) => {
            if (result) {
              const joinedGame = {
                id: Number(result.args.gameId),
                price: Number(result.args.value),
                player1: result.args.player1,
                player2: result.args.player2,
              };
              context.props.handleGameJoinedEvent(joinedGame);
            }
          });

          const GameEndedEvent = context.props.contractInstance.GameEnded({});

          GameEndedEvent.watch((error, result) => {
            if (result) {
              const endedGame = {
                id: Number(result.args.gameId),
                gameResult: Number(result.args.result)
              };
              context.props.handleGameEndedEvent(endedGame);
            }
          });

        }
      });
    } else {
      console.log('different web3 provider');
      // Another web3 provider
    }
  } else {
    console.log('no web3 provider');
    // No web 3 provider
  }
};

export default contractInitialization;