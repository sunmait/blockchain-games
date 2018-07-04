import React  from 'react';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Header from '../../containers/Header/Header';
import contractInitialization from '../../../helpers/gameOfMadness/contractInitialization';
import gameSettings from '../../../helpers/gameOfMadness/gameSettings';
import './GameOfMadness.css';
import HostGameContainer from './HostGame/HostGameContainer';
import MyGamesContainer from './MyGames/MyGamesContainer';
import CurrentGameContainer from './CurrentGame/CurrentGameContainer';
import HostedGamesContainer from './HostedGames/HostedGamesContainer';
import Spinner from '../../common/Spinner/Spinner';

class GameOfMadness extends React.Component {

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
    return (
      <React.Fragment>
        {this.props.currentGame ? <CurrentGameContainer /> : <HostGameContainer />}
      </React.Fragment>
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
          id="game-of-madness-page-tabs-container"
          activeKey={this.props.activeTabId}
          onSelect={(key) => this.props.handleActiveTabChange(key)}
        >
          <Tab eventKey={1} title="Open Games">
            {this.props.isHostedGamesLoaded ? <HostedGamesContainer /> : <Spinner/>}
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

export default GameOfMadness;
