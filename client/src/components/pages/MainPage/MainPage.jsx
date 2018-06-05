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

  componentDidMount() {
    window.addEventListener('load', this.onLoad.bind(this), false);
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.onLoad.bind(this), false);
  }

  onLoad = () => {
    contractInitialization(this);
  };

  renderGamesList = () => {
    if (this.props.hostedGamesList.length === 0) {
      return (
        <div>
          There are no currently open games
          <br />
          <Button
            onClick={() => {
              this.props.handleCurrentGameChange(null);
              this.props.handleActiveTabChange(3);
            }}
            bsStyle="primary"
          >
            Host game
          </Button>
        </div>
      )
    }
    return this.props.hostedGamesList.map((item, index) => {
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
              className="pull-right"
              onClick={() => {
                this.props.handleCurrentGameChange(item.id);
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
        activeKey={this.props.activeTabId}
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
