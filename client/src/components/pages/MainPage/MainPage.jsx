import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Button from 'react-bootstrap/lib/Button';
import { contractAddress } from '../../../appSettings';
import contractABI from '../../../smart-contracts-abis/GuessNumberGame';
import HostGame from './HostGame/HostGame';
import CurrentGame from './CurrentGame/CurrentGame';
import './MainPage.css';

class MainPage extends Component {
  constructor(props) {
    super(props);

    const contract = window.web3.eth.contract(contractABI.abi);

    this.state = {
      hostedGamesList: [],
      contractInstance: contract.at(contractAddress),
      activeTab: 1,
      currentGameId: null,
    }

  }

  componentDidMount() {

  }

  hostGame = (number) => {
    const {hostGame} = this.state.contractInstance;
    hostGame(number, (err, answer) => {
      console.log('smthg', answer);
    });
  };

  getGames = () => {
    const {getGames} = this.state.contractInstance;
    console.log(getGames);
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

  joinGame = (gameId, number) => {
    const {joinGame} = this.state.contractInstance;
    joinGame(gameId, number, (err, answer) => {
      if (err) {
        console.log('error', err);
      } else {
        console.log('answer', answer);
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
              onClick={() => {this.setState({
                currentGameId: item,
                activeTab: 3,
              })}}
            >
              Join Game
            </Button>
          </Col>
        </Row>
      );
    });
  };

  handleTabChange = (key) => {
    this.setState({
      activeTab: key,
    });
  };

  renderGameTabContent = () => {
    if (!!this.state.currentGameId) {
      return (
        <CurrentGame
          currentGameId={this.state.currentGameId}
          joinGame={(gameId, number) => this.joinGame(gameId, number)}
        />
      )
    }
    return (
      <HostGame
        hostGame={(value) => this.hostGame(value)}
      />
    );
  };

  render() {
    return (
      <Tabs id="main-page-tabs-container"
            activeKey={this.state.activeTab}
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
