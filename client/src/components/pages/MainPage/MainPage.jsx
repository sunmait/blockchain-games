import React, { Component } from 'react';
import './MainPage.css';
import { contractAddress } from '../../../appSettings';
import contractABI from '../../../smart-contracts-abis/GuessNumberGame';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Button from 'react-bootstrap/lib/Button';

class MainPage extends Component {
  constructor(props) {
    super(props);

    const contract = window.web3.eth.contract(contractABI.abi);

    this.state = {
      contractInstance: contract.at(contractAddress),
      hostedGamesList: [],
    }
  }

  hostGame = () => {
    const {hostGame} = this.state.contractInstance;
    hostGame.call(1, (err, answer) => {
      console.log('smthg', answer);
    });
  }

  getGames = () => {
    const {getGames} = this.state.contractInstance;
    getGames.call((err, answer) => {
      if (err) {
        console.log('error', err);
      } else {
        console.log(answer);
        this.setState({
          hostedGamesList: answer.map((elem) => Number(elem)),
        })
      }
    });
  }

  renderGamesList = () => {
    if (this.state.hostedGamesList.length === 0) {
      return (
        <div>
          There are no currently open games
          <br />
          <Button
            onClick={this.hostGame}
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
        <p key={key}>
          {item}
        </p>
      );
    });
  }

  render() {
    return (
      <Tabs id="main-page-tabs-container">
        <Tab eventKey={1} title="Open Games">
          <Row>
            <Col md={4}>
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
          Current game.
        </Tab>
      </Tabs>
    );
  }
}

export default MainPage;
