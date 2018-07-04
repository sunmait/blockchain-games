import Web3 from 'web3';
import store from '../redux/store';
import {setCurrentMetamaskAccount} from '../redux/modules/main-page/mainPageActions';
import { NotificationManager } from 'react-notifications';

const web3Initialization = () => {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(window.web3.currentProvider);

    if (window.web3.currentProvider.isMetaMask) {
      window.web3.eth.getAccounts((error, accounts) => {
        if (accounts.length === 0) {
          NotificationManager.warning('There are no active accounts in MetaMask.', 'Metamask warning', 10000);
        }
        else {
          window.web3.eth.defaultAccount = window.web3.eth.accounts[0];
          store.dispatch(setCurrentMetamaskAccount(window.web3.eth.accounts[0]));
        }
      });
    } else {
      NotificationManager.warning('Different web3 provider. Please use Metamask.', 'Metamask warning', 10000);
    }
  } else {
    NotificationManager.warning('No web3 provider. Please use Metamask.', 'Metamask warning', 10000);
  }
};

export default web3Initialization;