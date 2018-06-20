import React  from 'react';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Header from '../../containers/Header/Header';
import contractInitialization from '../../../helpers/gameOfMadness/contractInitialization';
import gameSettings from '../../../helpers/gameOfMadness/gameSettings';
import './GameOfMadness.css';
import getEthPrice from "../../../helpers/getEthPrice";
import web3Initialization from "../../../helpers/web3Initialization";
import HostGameContainer from './HostGame/HostGameContainer';
import MyGamesContainer from './MyGames/MyGamesContainer';
import CurrentGameContainer from './CurrentGame/CurrentGameContainer';
import HostedGamesContainer from './HostedGames/HostedGamesContainer';

class GameOfMadness extends React.Component {

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
          id="game-of-madness-page-tabs-container"
          activeKey={this.props.activeTabId}
          onSelect={(key) => this.props.handleActiveTabChange(key)}
        >
          <Tab eventKey={1} title="Open Games">
            <HostedGamesContainer />
          </Tab>
          <Tab eventKey={2} title="My Games">
            <MyGamesContainer />
          </Tab>
          <Tab eventKey={3} title="Game">
            {this.props.currentGame ? <CurrentGameContainer /> : <HostGameContainer />}
          </Tab>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default GameOfMadness;
