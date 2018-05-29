import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Button from 'react-bootstrap/lib/Button';
import { contractAddress } from '../../../appSettings';
import contractABI from '../../../smart-contracts-abis/GuessNumberGame';
import HostGameContainer from './HostGame/HostGameContainer';
import CurrentGameContainer from './CurrentGame/CurrentGameContainer';
import './MainPage.css';
// import Web3 from 'web3';

class MainPage extends Component {
  constructor(props) {
    super(props);

    // const web3 = new Web3(window.web3.currentProvider);
    // console.log(web3.eth.contract(contractABI.abi).at(contractAddress));
    // console.log(window.web3.eth.contract(contractABI.abi).at(contractAddress));

    this.state = {
      hostedGamesList: [],
      // contractInstance: window.web3.eth.contract(contractABI.abi).at(contractAddress),
      activeTabId: this.props.activeTabId,
      // currentGameId: null,
    };

  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({
      activeTabId: nextProps.activeTabId,
    });
  }

  componentDidMount() {
    window.addEventListener('load', this.onLoad.bind(this), false);
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.onLoad.bind(this), false);
  }

  onLoad() {
    if (typeof web3 !== 'undefined') {
      // window.web3 = new Web3(web3.currentProvider);
      // const contractInstance = window.web3.eth.contract(contractABI.abi).at(contractAddress);
      const contractInstance = window.web3.eth.contract(contractABI.abi).at(contractAddress);
      this.props.setContractInstance(contractInstance);

      if (window.web3.currentProvider.isMetaMask === true) {
        window.web3.eth.getAccounts((error, accounts) => {
          if (accounts.length === 0) {
            console.log('no account');
            // there is no active accounts in MetaMask
          }
          else {
            console.log('all is fine');
            // this.props.setContractInstance();
            // It's ok
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
  }

  getGames = () => {
    const {getGames} = this.props.contractInstance;
    getGames((err, answer) => {
      if (err) {
        console.log('error', err);
      } else {
        console.log('answer', answer);
        this.setState({
          hostedGamesList: answer.map((elem) => Number(elem)),
        })
      }
    });
  };

  renderGamesList = () => {
    if (this.state.hostedGamesList.length === 0) {
      return (
        <div>
          There are no currently open games
          <br />
          <Button
            onClick={() => this.handleTabChange(3)}
            bsStyle="primary"
          >
            Host game
          </Button>
        </div>
      )
    }
    return this.state.hostedGamesList.map((item, index) => {
      const key = index;
      return (
        <Row key={key}>
          <Col md={6}>
            Game #{item}
          </Col>
          <Col md={6}>
            <Button
              onClick={() => {
                this.props.handleCurrentGameIdChange(item);
                this.props.handleActiveTabChange(3);}
              }
            >
              Join Game
            </Button>
          </Col>
        </Row>
      );
    });
  };

  handleTabChange = (key) => {
    this.props.handleActiveTabChange(key);
  };

  renderGameTabContent = () => {
    if (!!this.props.currentGameId) {
      return (
        <CurrentGameContainer />
      )
    }
    return (
      <HostGameContainer />
    );
  };

  render() {
    return (
      <Tabs id="main-page-tabs-container"
            activeKey={this.state.activeTabId}
            onSelect={(key) => this.handleTabChange(key)}
      >
        <Tab eventKey={1} title="Open Games">
          <Row>
            <Col md={10}>
              {this.renderGamesList()}
            </Col>
            <Col md={2}>
              <Button
                onClick={this.getGames}
              >
                <span
                  className="glyphicon glyphicon-refresh"
                />
              </Button>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={2} title="My Games">
          There is nothing to display right now.
        </Tab>
        <Tab eventKey={3} title="Game">
          {this.renderGameTabContent()}
        </Tab>
      </Tabs>
    );
  }
}

export default MainPage;
