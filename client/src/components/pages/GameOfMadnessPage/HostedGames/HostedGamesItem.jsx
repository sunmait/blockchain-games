import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import './HostedGamesItem.css';
import getGravatarUrl from '../../../../helpers/getGravatarUrl';
import { NotificationManager } from 'react-notifications';

class HostedGamesItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      betAmount: window.web3.fromWei(this.props.item.player1TotalBet),
    }
  }

  joinGame = () => {
    const minRaiseValue = 0.000001;
    if (this.state.betAmount < Number(window.web3.fromWei(this.props.item.player1TotalBet)) + minRaiseValue) {
      return;
    }
    const {joinGame} = this.props.contractInstance;
    const transactionData = { value: window.web3.toWei(this.state.betAmount) };
    joinGame.sendTransaction(this.props.item.id, transactionData, (err) => {
        if (err) {
          NotificationManager.error(err.message, 'Transaction failed', 7000);
        } else {
          NotificationManager.info('Transaction operating.', 'Transaction Info', 5000);
          this.props.handleActiveTabChange(2);
        }
      }
    );
  };

  handleFieldChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  render() {
    const hostRisk = `(${(this.props.ethPrice * window.web3.fromWei(this.props.item.player1TotalBet)).toFixed(2)}USD)`;
    const joinedRisk = `(${(this.props.ethPrice * this.state.betAmount).toFixed(2)}USD)`;
    return (
      <Row className="madness-game-item-container">
        <Col mdOffset={3} md={6}>
          <Row>
            <Col md={3} className="madness-game-title-container">
              <Row>
                Game #{this.props.item.id}
              </Row>
              <Row>
                <img
                  src={getGravatarUrl(this.props.item.player1)}
                  alt="no img"
                />
              </Row>
            </Col>
            <Col md={9}>
              <Row>
                <div className="madness-game-bet-title">
                  Initial bet:
                </div>
                {window.web3.fromWei(this.props.item.player1TotalBet)} ETH {this.props.ethPrice ? hostRisk : null}
              </Row>
              <Row>
                <div className="madness-game-bet-title">
                  Your bet:
                </div>
                <FormControl
                  className="madness-game-join-bet-input"
                  type="text"
                  value={this.state.betAmount}
                  onChange={(event) => this.handleFieldChange('betAmount', event.target.value)}
                /> ETH
              </Row>
              <Row>
                <div className="madness-game-join-risk-container">
                  {this.props.ethPrice ? joinedRisk : null}
                </div>
              </Row>
              <Row className="madness-game-interaction-button-container">
                <Button
                  onClick={this.joinGame}
                >
                  Join game
                </Button>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default HostedGamesItem;