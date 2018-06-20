import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Countdown from '../../../common/Countdown/Countdown';
import './CurrentGame.css';

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
        <Col md={3}>
          Game #{this.props.currentGame.id}
          <br />
          Host total bet: {window.web3.fromWei(this.props.currentGame.player1TotalBet)} ETH {this.props.ethPrice ? this.renderHostRisk() : null}
        </Col>
        <Col md={3}>
          Game status: {this.props.currentGame.status}
        </Col>
      </Row>
    );
  };

  renderJoinedGame = () => {
    return (
      <React.Fragment>
        <Row className="madness-current-game-container">
          <Col md={3}>
            Game #{this.props.currentGame.id}
            <br />
            Host total bet: {window.web3.fromWei(this.props.currentGame.player1TotalBet)} ETH {this.props.ethPrice ? this.renderHostRisk() : null}
            <br />
            Joined total bet: {window.web3.fromWei(this.props.currentGame.player2TotalBet)} ETH {this.props.ethPrice ? this.renderJoinedRisk() : null}
          </Col>
          <Col md={3}>
            Game status: {this.props.currentGame.status}
          </Col>
          <Col md={3}>
            Countdown:
            <Countdown
              start={this.props.currentGame.lastRaiseTime}
              duration={3}
              countdownEnded={this.enableFinishGameButton}
            />
          </Col>
          <Col md={3}>
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
                    <td>{window.web3.fromWei(Number(bet))}</td>
                    <td />
                  </tr>
                );
              } else {
                return (
                  <tr key={index}>
                    <td />
                    <td>{window.web3.fromWei(Number(bet))}</td>
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
      <React.Fragment>
        Raise:
        <FormControl
          type="text"
          value={this.state.betAmount}
          onChange={(event) => this.onFieldChange('betAmount', event.target.value)}
        />
        <Button
          onClick={this.handleRaiseButtonClick}
        >
          Raise
        </Button>
      </React.Fragment>
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
          Game #{this.props.currentGame.id}
          <br />
          Host total bet: {window.web3.fromWei(this.props.currentGame.player1TotalBet)} ETH {this.props.ethPrice ? this.renderHostRisk() : null}
          <br />
          Joined total bet: {window.web3.fromWei(this.props.currentGame.player2TotalBet)} ETH {this.props.ethPrice ? this.renderJoinedRisk() : null}
        </Col>
        <Col md={3}>
          Game status: {this.props.currentGame.status}
        </Col>
        <Col md={3}>
          Game result: {this.props.currentGame.result === 'Win' ? 'Host won' : 'Joined won'}!
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