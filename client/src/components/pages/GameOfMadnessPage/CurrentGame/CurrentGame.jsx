import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Countdown from '../../../common/Countdown/Countdown';

class CurrentGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      betAmount: 0,
      isFinishGameButtonEnabled: false,
    }
  }

  renderHostedGame = () => {
    return null;
  };

  renderJoinedGame = () => {
    const hostRisk = (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.currentGame.player1TotalBet)).toFixed(2)}USD)
      </React.Fragment>
    );
    const joinedRisk = (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.currentGame.player2TotalBet)).toFixed(2)}USD)
      </React.Fragment>
    );
    return (
      <Row className="madness-game-item-container">
        <Col md={3}>
          Game #{this.props.currentGame.id}
          <br />
          Host total bet: {window.web3.fromWei(this.props.currentGame.player1TotalBet)} ETH {this.props.ethPrice ? hostRisk : null}
          <br />
          Joined total bet: {window.web3.fromWei(this.props.currentGame.player2TotalBet)} ETH {this.props.ethPrice ? joinedRisk : null}
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
    if (this.state.betAmount < this.props.currentGame.player1TotalBet &&
        this.state.betAmount < this.props.currentGame.player2TotalBet) return;
    const {raise} = this.props.contractInstance;

    const transactionData = { value: this.state.betAmount };
    raise.sendTransaction(this.props.currentGame.id, transactionData, (err) => {
      if (err) {
        console.log('err: ', err);
      } else {
        console.log('raised');
      }
    });
  };

  renderFinishedGame = () => {
    return null;
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