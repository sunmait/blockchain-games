import Web3 from 'web3';

const web3Initialization = (context) => {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(window.web3.currentProvider);

    if (window.web3.currentProvider.isMetaMask === true) {
      window.web3.eth.getAccounts((error, accounts) => {
        if (accounts.length === 0) {
          console.log('no account');
          // there is no active accounts in MetaMask
        }
        else {
          console.log('all is fine');
          // It's ok
          window.web3.eth.defaultAccount = window.web3.eth.accounts[0];
          context.props.setCurrentMetamaskAccount(window.web3.eth.accounts[0]);
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

export default web3Initialization;