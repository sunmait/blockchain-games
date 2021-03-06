import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import isFloat from '../../../../helpers/isFloat';
import './HostGame.css';
import { NotificationManager } from 'react-notifications';

class HostGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      betAmount: 0.000045,
    };
  }

  hostGame = () => {
    if (this.state.betAmount < 0.000045) {
      return;
    }
    const {hostGame} = this.props.contractInstance;
    const transactionData = { value: this.props.localWeb3.toWei(this.state.betAmount) };
    hostGame.sendTransaction(transactionData, (err) => {
      if (err) {
        NotificationManager.error(err.message, 'Transaction failed', 7000);
      } else {
        NotificationManager.info('Transaction operating.', 'Transaction Info', 5000);
        this.props.handleActiveTabChange(2);
      }
    });
  };

  handleBetAmountChange = (value) => {
    if (!isFloat(value)) {
      return;
    }
    this.setState({
      betAmount: value,
    });
  };

  render() {
    const risk = `(${(this.props.ethPrice * this.state.betAmount).toFixed(2)}USD)`;
    return (
      <Row>
        <Col mdOffset={3} md={6}>
          <Row>
            <Col md={12} className="madness-game-host-game-title">
              Host new game
            </Col>
          </Row>
          <Row className="madness-game-host-game-input-data-container">
            <Col md={2} className="madness-game-host-game-bet-title">
              Bet amount:
            </Col>
            <Col md={10}>
              <FormControl
                className="madness-game-host-game-bet-input"
                type="text"
                value={this.state.betAmount}
                onChange={(event) => this.handleBetAmountChange(event.target.value)}
              /> ETH
            </Col>
          </Row>
          <Row>
            <Col mdOffset={2} className="madness-game-host-risk-container">
              {this.props.ethPrice ? risk : null}
            </Col>
          </Row>
          <Row>
            <Col md={12} className="game-item-interaction-button-container">
              <Button
                onClick={this.hostGame}
                bsStyle="primary"
              >
                Host Game
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default HostGame;