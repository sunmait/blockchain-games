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
      isFinishGameButton: false,
    }
  }

  renderHostedGame = () => {
    return null;
  };

  renderJoinedGame = () => {
    return (
      <Row className="madness-game-item-container">
        <Col md={3}>
          Game #{this.props.currentGame.id}
          <br />
          Host total bet: {this.props.currentGame.player1TotalBet} Vei
          <br />
          Joined total bet: {this.props.currentGame.player2TotalBet} Vei
        </Col>
        <Col md={3}>
          Game status: {this.props.currentGame.status}
        </Col>
        <Col md={3}>
          Countdown:
          <Countdown
            start={this.props.currentGame.lastRaiseTime}
            duration={60*3}
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
      isFinishGameButton: true,
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
        disabled={!this.state.isFinishGameButton}
      >
        Finish game
      </Button>
    )
  };

  handleFinishGameButtonClick = () => {
    const {windrawal} = this.props.contractInstance;
    windrawal(
      this.props.currentGame.id,
      (err, result) => {
        if (err) {
          console.log('err: ', err);
        } else {
          console.log('game ended');
        }
      }
    );
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

  handleRaiseButtonClick = () => {
    if (this.state.betAmount < this.props.currentGame.player1TotalBet &&
        this.state.betAmount < this.props.currentGame.player2TotalBet) return;
    const {raise} = this.props.contractInstance;
    raise.sendTransaction(
      this.props.currentGame.id,
      {
        value: this.state.betAmount,
      },
      (err, result) => {
        if (err) {
          console.log('err: ', err);
        } else {
          console.log('raised');
        }
      }
    );
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