import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import HostGameContainer from './HostGame/HostGameContainer';
import CurrentGameContainer from './CurrentGame/CurrentGameContainer';
import MyGamesContainer from './MyGames/MyGamesContainer';
import './GuessNumberGame.css';
import web3Initialization from '../../../helpers/web3Initialization';
import contractInitialization from '../../../helpers/guessNumberGame/contractInitialization';
import gameSettings from '../../../helpers/guessNumberGame/gameSettings';
import getEthPrice from '../../../helpers/getEthPrice';
import Spinner from '../../common/Spinner/Spinner';
import Header from '../../containers/Header/Header';
import HostedGamesContainer from './HostedGames/HostedGamesContainer';

class GuessNumberGame extends Component {

  componentDidMount() {
    window.addEventListener('load', this.onLoad.bind(this), false);
    if (this.props.currentAccount) {
      contractInitialization(this);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.onLoad.bind(this), false);
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentAccount && prevProps.currentAccount !== this.props.currentAccount) {
      contractInitialization(this);
    }
    if (this.props.contractInstance && prevProps.contractInstance !== this.props.contractInstance) {
      gameSettings(this);
    }
  }

  onLoad = () => {
    web3Initialization(this);
    getEthPrice()
      .then(response => {
        this.props.setEthPrice(response);
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
      <React.Fragment>
        <Header
          onHostGameClick={() => {
            this.props.handleCurrentGameChange(null);
            this.props.handleActiveTabChange(3);
          }}
        />
        <Tabs
          id="main-page-tabs-container"
          activeKey={this.props.activeTabId}
          onSelect={(key) => this.props.handleActiveTabChange(key)}
        >
          <Tab eventKey={1} title="Open Games">
            <Row className="games-list-container">
              <Col md={10}>
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
