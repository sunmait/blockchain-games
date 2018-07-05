import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import JoinGameContainer from '../JoinGame/JoinGameContainer';
import './CurrentGame.css';
import { NotificationManager } from 'react-notifications';

class CurrentGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hostNumber: '',
      hostSecret: '',
    }
  }

  handleValueChanged = (value) => {
    this.setState({
      selectedNumber: value,
    });
  };

  revealWinner = () => {
    const {revealHiddenNumber} = this.props.contractInstance;
    revealHiddenNumber(this.props.currentGame.id, this.state.hostNumber, this.state.hostSecret,
      (err) => {
        if (err) {
          NotificationManager.error(err.message, 'Transaction failed', 7000);
        } else {
          NotificationManager.info('Transaction operating.', 'Transaction Info', 5000);
        }
      });
  };

  handleFieldChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  renderGame = () => {
    if (this.props.currentGame.status === 'Hosted') {
      return (
        <JoinGameContainer />
      );
    } else if (this.props.currentGame.status === 'Ended') {
      let result = '';
      let userResult = '';
      if (this.props.currentGame.result === 'Win') {
        result = 'Hosted game player Win';
        if (this.props.currentGame.player1 === this.props.currentAccount) {
          userResult = 'You won';
        } else if (this.props.currentGame.player2 === this.props.currentAccount) {
          userResult = 'You lost';
        }
      } else if (this.props.currentGame.result === 'Loss') {
        result = 'Joined game player Win';
        if (this.props.currentGame.player1 === this.props.currentAccount) {
          userResult = 'You lost';
        } else if (this.props.currentGame.player2 === this.props.currentAccount) {
          userResult = 'You won';
        }
      }
      const risk = `(${(this.props.ethPrice * this.props.localWeb3.fromWei(this.props.currentGame.price)).toFixed(2)}USD)`;
      return (
        <Row className="finished-game-container">
          Game ended with result: {result}.
          <br />
          {userResult}: {this.props.localWeb3.fromWei(this.props.currentGame.price)} ETH {this.props.ethPrice ? risk : null}
        </Row>
      );
    } else if (this.props.currentGame.status === 'Joined') {
      return (
        <Row>
          <Col md={8}>
            Input your number and secret to finish this game.
            <Row>
              <Col md={6}>
                Your number:
                <FormControl
                  type="text"
                  value={this.state.hostNumber}
                  onChange={(event) => this.handleFieldChange('hostNumber', event.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                Your secret:
                <FormControl
                  type="text"
                  value={this.state.hostSecret}
                  onChange={(event) => this.handleFieldChange('hostSecret', event.target.value)}
                />
              </Col>
            </Row>
          </Col>
          <Col md={4} className="game-item-interaction-button-container">
            <Button
              onClick={() => {
                this.revealWinner();
              }}
            >
              Reveal winner
            </Button>
          </Col>
        </Row>
      )
    }
    return (
      <p>
        Current Game.
      </p>
    );
  };

  render() {
    return (
      <Row>
        {this.renderGame()}
      </Row>
    );
  }
}

export default CurrentGame;