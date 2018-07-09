import React, { Component } from 'react';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Col from 'react-bootstrap/lib/Col';
import HostGameContainer from './HostGame/HostGameContainer';
import CurrentGameContainer from './CurrentGame/CurrentGameContainer';
import MyGamesContainer from './MyGames/MyGamesContainer';
import './GuessNumberGame.css';
import Spinner from '../../common/Spinner/Spinner';
import Header from '../../containers/Header/Header';
import HostedGamesContainer from './HostedGames/HostedGamesContainer';

class GuessNumberGame extends Component {
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
    if (!this.props.localWeb3 || !this.props.currentAccount || !this.props.contractInstance) {
      return (
        <div>
          Metamask is loading.
        </div>
      );
    }
    return (
      <React.Fragment>
        <Header
          onHostGameClick={() => {
            this.props.handleCurrentGameChange(null);
            this.props.handleActiveTabChange(3);
          }}
          gravatarAddress={this.props.localWeb3.sha3(this.props.currentAccount).slice(2)}
        />
        <Tabs
          id="guess-number-game-tabs-container"
          activeKey={this.props.activeTabId}
          onSelect={(key) => this.props.handleActiveTabChange(key)}
        >
          <Tab eventKey={1} title="Open Games">
            <Col mdOffset={1} md={10}>
              {this.props.isHostedGamesLoaded ? <HostedGamesContainer /> : <Spinner/>}
            </Col>
          </Tab>
          <Tab eventKey={2} title="My Games">
            <Col mdOffset={1} md={10}>
              {this.props.isUserGamesLoaded ? <MyGamesContainer /> : <Spinner/>}
            </Col>
          </Tab>
          <Tab eventKey={3} title="Game">
            <Col mdOffset={1} md={10}>
              {this.props.isCurrentGameLoaded ? this.renderGameTabContent() : <Spinner/>}
            </Col>
          </Tab>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default GuessNumberGame;
