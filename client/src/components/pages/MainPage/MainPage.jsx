import React, { Component } from 'react';
import smthg from '../../../assets/images/smthg.png';
import './MainPage.css';
import { contractAddress } from '../../../appSettings';
import contractABI from '../../../smart-contracts-abis/GuessNumberGame';

class MainPage extends Component {
  constructor(props) {
    super(props);

    const contract = window.web3.eth.contract(contractABI.abi);

    this.state = {
      contractInstance: contract.at(contractAddress),
    }
  }

  hostGame = () => {
    const {hostGame} = this.state.contractInstance;
    hostGame (1, (err, answer) => {
      if (err) {
        console.log('error', err);
      } else {
        console.log('Game mb even hosted', answer);
      };
    });
  }

  render() {
    return (
      <div className="main-page">
        <header className="main-page-header">
          <h1 className="main-page-title">One day here is gonna be smthg.</h1>
        </header>
        <div className="main-page-body">
          <img className="main-page-body-picture" src={smthg} alt="smthg" />
        </div>
        <div>
          <button
            onClick={this.hostGame}
          >
            Host game
          </button>
        </div>
      </div>
    );
  }
}

export default MainPage;
