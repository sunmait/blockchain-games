import React  from 'react';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import Header from '../../containers/Header/Header';
import contractInitialization from '../../../helpers/gameOfMadness/contractInitialization';
import gameSettings from '../../../helpers/gameOfMadness/gameSettings';
import './GameOfMadness.css';
import GameOfMadnessItemContainer from './GameOfMadnessItemContainer';
import HostGameContainer from './HostGame/HostGameContainer';
import getEthPrice from "../../../helpers/getEthPrice";
import web3Initialization from "../../../helpers/web3Initialization";

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
      );
    }
    return this.props.hostedGamesList.map((item, index) => {
      return (
        <GameOfMadnessItemContainer
          item={item}
          key={index}
        />
      );
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
            <Row className="games-list-container">
              {this.renderGamesList()}
            </Row>
          </Tab>
          <Tab eventKey={2} title="My Games">
            asd
          </Tab>
          <Tab eventKey={3} title="Game">
            <HostGameContainer />
          </Tab>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default GameOfMadness;
