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
        <Row>
          This user don't have ended games.
        </Row>
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
        <Col md={12}>
          <Col md={3}>
            <Row className="number-game-item-title-container">
              <Col md={12} className="number-game-item-title">
                Game #{this.props.currentGame.id}
              </Col>
              <Col md={12}>
                <img
                  src={getGravatarUrl(this.props.currentGame.player1)}
                  alt="no img"
                />
              </Col>
            </Row>
          </Col>
          <Col md={4} className="number-game-item-data-container">
            Game price: {window.web3.fromWei(this.props.currentGame.price)} ETH {this.props.ethPrice ? risk : null}
            {this.renderEvenOddSelector()}
          </Col>
          <Col md={4} className="number-game-interaction-button-container">
            <Button
              onClick={this.joinGame}
              bsStyle="primary"
            >
              Join Game
            </Button>
          </Col>
        </Col>
        <Col md={12} className="last-bets-container">
          <Col md={2}>
            This user last bets:
          </Col>
          <Col>
            {this.renderHostLastBets()}
          </Col>
        </Col>
      </Row>
    );
  }
}

export default JoinGame;