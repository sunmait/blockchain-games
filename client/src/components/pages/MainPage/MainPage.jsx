import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Button from 'react-bootstrap/lib/Button';
import HostGameContainer from './HostGame/HostGameContainer';
import CurrentGameContainer from './CurrentGame/CurrentGameContainer';
import MyGamesContainer from './MyGames/MyGamesContainer';
import './MainPage.css';
// import Web3 from 'web3';
import contractInitialization from '../../../helpers/contractInitialization';

class MainPage extends Component {
  constructor(props) {
    super(props);

    // const web3 = new Web3(window.web3.currentProvider);
    // console.log(web3.eth.contract(contractABI.abi).at(contractAddress));
    // console.log(window.web3.eth.contract(contractABI.abi).at(contractAddress));

    this.state = {
      hostedGamesList: this.props.hostedGamesList,
      // contractInstance: window.web3.eth.contract(contractABI.abi).at(contractAddress),
      activeTabId: this.props.activeTabId,
    };

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      activeTabId: nextProps.activeTabId,
      hostedGamesList: nextProps.hostedGamesList,
    });
  }

  componentDidMount() {
    window.addEventListener('load', this.onLoad.bind(this), false);
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.onLoad.bind(this), false);
  }

  onLoad = () => {
    contractInitialization(this);
  };

  getHostedGamesFieldsByIds = (gamesIds) => {
    const {getGameById} = this.props.contractInstance;
    return gamesIds.map(gameId => {
      return new Promise((resolve) => {
        getGameById(
          gameId,
          (err, result) => {
            if (err) {
              console.log('err: ', err);
            } else {
              const gamePrice = Number(result[2]);
              resolve({
                id: gameId,
                price: gamePrice,
              });
            }
          }
        )
      });
    });
  };

  getHostedGames = () => {
    const {getHostedGamesIds} = this.props.contractInstance;
    getHostedGamesIds((err, answer) => {
      if (err) {
        console.log('error', err);
      } else {
        const hostedGamesIdsList = answer.map(item => {
          return Number(item);
        });
        Promise.all(this.getHostedGamesFieldsByIds(hostedGamesIdsList))
          .then((response) => {
            this.props.getHostedGames(response);
            // this.setState({
            //   hostedGamesList: response,
            // });
          });
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
            onClick={() => {
              this.props.handleCurrentGameIdChange(null);
              this.props.handleActiveTabChange(3);
            }}
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
        <Row key={key} className="games-list-element-container">
          <Col md={6}>
            Game #{item.id}
            <br />
            Game price: {item.price} vei
          </Col>
          <Col md={6}>
            <Button
              onClick={() => {
                this.props.handleCurrentGameIdChange(item.id);
                this.props.handleActiveTabChange(3);
              }}
            >
              Join Game
            </Button>
          </Col>
        </Row>
      );
    });
  };

  renderGameTabContent = () => {
    if (Number.isInteger(this.props.currentGame.id)) {
      return (
        <CurrentGameContainer />
      );
    }
    return (
      <HostGameContainer />
    );
  };

  render() {
    return (
      <Tabs
        id="main-page-tabs-container"
        activeKey={this.state.activeTabId}
        onSelect={(key) => this.props.handleActiveTabChange(key)}
      >
        <Tab eventKey={1} title="Open Games">
          <Row className="games-list-container">
            <Col md={10}>
              {this.renderGamesList()}
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={2} title="My Games">
          <MyGamesContainer />
        </Tab>
        <Tab eventKey={3} title="Game">
          {this.renderGameTabContent()}
        </Tab>
      </Tabs>
    );
  }
}

export default MainPage;
