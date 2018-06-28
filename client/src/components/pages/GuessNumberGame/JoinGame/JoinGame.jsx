import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import './JoinGame.css';
import getGravatarUrl from '../../../../helpers/getGravatarUrl';

class JoinGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      evenOddSelectorTitle: 'Select your bet'
    };
  }

  handleValueChanged = (value) => {
    this.setState({
      selectedNumber: value,
    });
  };

  joinGame = () => {
    if (this.state.evenOddSelectorTitle !== 'Even' && this.state.evenOddSelectorTitle !== 'Odd') {
      return;
    }
    const {joinGame} = this.props.contractInstance;
    const playerBet = this.state.evenOddSelectorTitle === 'Even' ? 0 : 1;
    joinGame.sendTransaction(this.props.currentGame.id, playerBet,
      {
        value: this.props.currentGame.price,
      },
      (err) => {
      if (err) {
        console.log('error', err);
      } else {
        this.setState({
          evenOddSelectorTitle: 'Select your bet',
        });
        this.props.handleActiveTabChange(2);
      }
    });
  };

  toggleDropdownButtonState = (value) => {
    this.setState({
      evenOddSelectorTitle: value,
    });
  };

  renderEvenOddSelector = () => {
    return (
      <DropdownButton
        id="event-odd-selector"
        title={this.state.evenOddSelectorTitle}
      >
        <MenuItem
          eventKey={1}
          onSelect={() => this.toggleDropdownButtonState('Even')}
        >
          Even
        </MenuItem>
        <MenuItem
          eventKey={2}
          onSelect={() => this.toggleDropdownButtonState('Odd')}
        >
          Odd
        </MenuItem>
      </DropdownButton>
    );
  };

  renderHostLastBets = () => {
    if (this.props.currentGame.hostLastBets.length === 0) {
      return (
        <div className="last-bets-item-container">
          This user doesn't have finished games.
        </div>
      )
    }
    return this.props.currentGame.hostLastBets.map((item, index) => {
      return (
        <Col md={1} key={index} className="last-bets-item-container">
          {item}
        </Col>
      );
    });
  };

  render() {
    const risk = (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.currentGame.price)).toFixed(2)}USD)
      </React.Fragment>
    );
    return (
      <Row>
        <Col mdOffset={3} md={6}>
          <Row>
            <Col md={12} className="join-game-title">
              Join game #{this.props.currentGame.id}
            </Col>
          </Row>
          <Row className="join-game-data-container">
            <Col md={2}>
              <img
                src={getGravatarUrl(this.props.currentGame.player1)}
                alt="no img"
              />
            </Col>
            <Col md={10}>
              <Row>
                Bets history: {this.renderHostLastBets()}
              </Row>
              <Row className="join-game-payload">
                Game price: {window.web3.fromWei(this.props.currentGame.price)} ETH {this.props.ethPrice ? risk : null}
              </Row>
              <Row className="even-odd-selector-container">
                <div className="even-odd-selector-title">
                  The number is:
                </div>
                {this.renderEvenOddSelector()}
              </Row>
              <Row>
                <Col md={12} className="game-item-interaction-button-container">
                  <Button
                    onClick={this.joinGame}
                    bsStyle="primary"
                  >
                    Join Game
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default JoinGame;