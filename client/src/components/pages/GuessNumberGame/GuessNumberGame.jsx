import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import HostGameContainer from './HostGame/HostGameContainer';
import CurrentGameContainer from './CurrentGame/CurrentGameContainer';
import MyGamesContainer from './MyGames/MyGamesContainer';
import './GuessNumberGame.css';
import contractInitialization from '../../../helpers/guessNumberGame/contractInitialization';
import gameSettings from '../../../helpers/guessNumberGame/gameSettings';
import Spinner from '../../common/Spinner/Spinner';
import Header from '../../containers/Header/Header';
import HostedGamesContainer from './HostedGames/HostedGamesContainer';

class GuessNumberGame extends Component {

  componentDidMount() {
    if (this.props.currentAccount) {
      contractInitialization();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentAccount && prevProps.currentAccount !== this.props.currentAccount) {
      contractInitialization();
    }
    if (this.props.contractInstance && prevProps.contractInstance !== this.props.contractInstance) {
      gameSettings();
    }
  }

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
    if (!this.props.localWeb3 || !this.props.currentAccount) {
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
          id="main-page-tabs-container"
          activeKey={this.props.activeTabId}
          onSelect={(key) => this.props.handleActiveTabChange(key)}
        >
          <Tab eventKey={1} title="Open Games">
            <Row className="games-list-container">
              <Col md={12}>
                {this.props.isHostedGamesLoaded ? <HostedGamesContainer /> : <Spinner/>}
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
      </React.Fragment>
    );
  }
}

export default GuessNumberGame;
