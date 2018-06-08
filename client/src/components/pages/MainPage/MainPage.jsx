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
import contractInitialization from '../../../helpers/contractInitialization';
import Spinner from '../../common/Spinner/Spinner';

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
              this.props.handleActiveTabChange(3);
              this.props.handleCurrentGameChange(null);
            }}
            bsStyle="primary"
          >
            Host game
          </Button>
        </div>
      );
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
                this.props.handleActiveTabChange(3);
                this.props.handleCurrentGameChange(item.id);
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
              {this.props.isHostedGamesLoaded ? this.renderGamesList() : <Spinner/>}
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={2} title="My Games">
          {this.props.isUserGamesLoaded ? <MyGamesContainer /> : <Spinner/>}
        </Tab>
        <Tab eventKey={3} title="Game">
          {this.props.isCurrentGameLoaded ? this.renderGameTabContent() : <Spinner/>}
        </Tab>
      </Tabs>
    );
  }
}

export default MainPage;
