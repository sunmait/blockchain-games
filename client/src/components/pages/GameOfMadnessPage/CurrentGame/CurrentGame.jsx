import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Countdown from '../../../common/Countdown/Countdown';
import './CurrentGame.css';
import getGravatarUrl from '../../../../helpers/getGravatarUrl';

class CurrentGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      betAmount: 0,
      isFinishGameButtonEnabled: false,
    }
  }

  renderHostRisk = () => {
    return (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.currentGame.player1TotalBet)).toFixed(2)}USD)
      </React.Fragment>
    );
  };

  renderJoinedRisk = () => {
    return (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.currentGame.player2TotalBet)).toFixed(2)}USD)
      </React.Fragment>
    );
  };

  renderHostedGame = () => {
    return (
      <Row className="madness-current-game-container">
        <Col md={4}>
          <Row className="madness-game-item-title-container">
            <Col md={12} className="madness-game-item-title">
              Game #{this.props.currentGame.id} {this.props.currentGame.status}
            </Col>
            <Col md={12}>
              <img
                src={getGravatarUrl(this.props.currentGame.player1)}
                alt="no img"
              />
            </Col>
          </Row>
        </Col>
        <Col md={4} className="madness-game-item-data-container">
          Host total bet: {window.web3.fromWei(this.props.currentGame.player1TotalBet)} ETH {this.props.ethPrice ? this.renderHostRisk() : null}
        </Col>
      </Row>
    );
  };

  renderJoinedGame = () => {
    return (
      <React.Fragment>
        <Row className="madness-current-game-container">
          <Col md={3}>
            <Row className="madness-game-item-title-container">
              <Col md={12} className="madness-game-item-title">
                Game #{this.props.currentGame.id} {this.props.currentGame.status}
              </Col>
              <Col md={12}>
                <img
                  src={getGravatarUrl(this.props.currentGame.player1)}
                  alt="no img"
                />
              </Col>
            </Row>
          </Col>
          <Col md={3} className="madness-game-item-data-container">
            Host total bet: {window.web3.fromWei(this.props.currentGame.player1TotalBet)} ETH {this.props.ethPrice ? this.renderHostRisk() : null}
            <br />
            Joined total bet: {window.web3.fromWei(this.props.currentGame.player2TotalBet)} ETH {this.props.ethPrice ? this.renderJoinedRisk() : null}
          </Col>
          <Col md={3} className="madness-game-item-data-container">
            Countdown:
            <Countdown
              start={this.props.currentGame.lastRaiseTime}
              duration={3}
              countdownEnded={this.enableFinishGameButton}
            />
          </Col>
          <Col md={3} className="madness-game-finish-button-container">
            {this.props.currentGame.playerWhoBetLast === this.props.currentAccount ?
              this.renderFinishGameContainer() : this.renderRaiseContainer()}
          </Col>
        </Row>
        <Row>
          <Col mdOffset={3} md={6}>
            Game bets history: {this.renderBetsHistory()}
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  renderBetsHistory = () => {
    return (
      <table className="game-bets-history-table">
        <thead>
          <tr>
            <td>Host</td>
            <td>Joined</td>
          </tr>
        </thead>
        <tbody>
          {
            this.props.currentGame.betsHistory.map((bet, index) => {
              if (index % 2 === 0) {
                return (
                  <tr key={index}>
                    <td className="table-filled-field">{window.web3.fromWei(Number(bet))}</td>
                    <td />
                  </tr>
                );
              } else {
                return (
                  <tr key={index}>
                    <td />
                    <td className="table-filled-field">{window.web3.fromWei(Number(bet))}</td>
                  </tr>
                );
              }
            })
          }
        </tbody>
      </table>
    );

  };

  enableFinishGameButton = () => {
    this.setState({
      isFinishGameButtonEnabled: true,
    });
  };

  onFieldChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  renderFinishGameContainer = () => {
    return (
      <Button
        onClick={this.handleFinishGameButtonClick}
        disabled={!this.state.isFinishGameButtonEnabled}
      >
        Finish game
      </Button>
    )
  };

  handleFinishGameButtonClick = () => {
    const {windrawal} = this.props.contractInstance;
    windrawal(this.props.currentGame.id, (err) => {
      if (err) {
        console.log('err: ', err);
      } else {
        console.log('game ended');
      }
    });
  };

  // TODO: handle situation when your opponent did bet before you finished the game
  // TODO: in other places events will handle it, but it not changes component's state
  renderRaiseContainer = () => {
    return (
      <Row>
        <Col md={12} className="madness-game-raise-input-container">
          Raise:
          <FormControl
            type="text"
            value={this.state.betAmount}
            onChange={(event) => this.onFieldChange('betAmount', event.target.value)}
          />
        </Col>
        <Col md={12} className="madness-game-raise-button-container">
          <Button
            onClick={this.handleRaiseButtonClick}
          >
            Raise
          </Button>
        </Col>
      </Row>
    );
  };

  // TODO: switch to person who raised and waiting finish game button enabling
  handleRaiseButtonClick = () => {
    if (window.web3.toWei(this.state.betAmount) < this.props.currentGame.player1TotalBet &&
      window.web3.toWei(this.state.betAmount) < this.props.currentGame.player2TotalBet) return;
    const {raise} = this.props.contractInstance;

    const transactionData = { value: window.web3.toWei(this.state.betAmount) };
    raise.sendTransaction(this.props.currentGame.id, transactionData, (err) => {
      if (err) {
        console.log('err: ', err);
      } else {
        console.log('raised');
      }
    });
  };

  renderFinishedGame = () => {
    return (
      <Row className="madness-current-game-container">
        <Col md={3}>
          <Row className="madness-game-item-title-container">
            <Col md={12} className="madness-game-item-title">
              Game #{this.props.currentGame.id} {this.props.currentGame.status}
            </Col>
            <Col md={12}>
              <img
                src={getGravatarUrl(this.props.currentGame.player1)}
                alt="no img"
              />
            </Col>
          </Row>
        </Col>
        <Col md={6} className="madness-game-item-data-container">
          Host total bet: {window.web3.fromWei(this.props.currentGame.player1TotalBet)} ETH {this.props.ethPrice ? this.renderHostRisk() : null}
          <br />
          Joined total bet: {window.web3.fromWei(this.props.currentGame.player2TotalBet)} ETH {this.props.ethPrice ? this.renderJoinedRisk() : null}
        </Col>
        <Col md={3} className="madness-game-item-data-container">
          Game is over
          <br />
          {this.props.currentGame.result === 'Win' ?
          (this.props.currentGame.player1 === this.props.currentAccount ? 'Congratulations, You won' : 'Sorry, You lost')
          : (this.props.currentGame.player2 === this.props.currentAccount ? 'Congratulations, You won' : 'Sorry, You lost')}!
        </Col>
      </Row>
    );
  };

  render() {
    if (this.props.currentGame.status === 'Hosted') {
      return (this.renderHostedGame());
    }
    if (this.props.currentGame.status === 'Joined') {
      return (this.renderJoinedGame());
    }
    if (this.props.currentGame.status === 'Ended') {
      return (this.renderFinishedGame());
    }
    return null;
  }
}

export default CurrentGame;