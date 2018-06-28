import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Countdown from '../../../common/Countdown/Countdown';
import './MyGamesItem.css';
import getGravatarUrl from '../../../../helpers/getGravatarUrl';

class MyGamesItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFinishGameButton: false,
    }
  }

  enableFinishGameButton = () => {
    this.setState({
      isFinishGameButtonEnabled: true,
    });
  };

  finishGame = () => {
    const {withdrawal} = this.props.contractInstance;
    withdrawal(this.props.item.id, (err) => {
        if (err) {
          console.log('err: ', err);
        } else {
          console.log('game ended');
        }
      }
    );
  };

  renderInteractionContainer = () => {
    if (this.props.item.status === 'Joined') {
      if (this.props.currentAccount === this.props.item.playerWhoBetLast) {
        return this.renderFinishGameButton();
      } else {
        return this.renderRaiseButton();
      }
    }
  };

  renderRaiseButton = () => {
    return (
      <React.Fragment>
        <Col md={12} className="madness-game-interaction-button-container">
          <Button
            onClick={this.goToGame}
            disabled={!this.state.isFinishGameButtonEnabled}
          >
            Raise
          </Button>
        </Col>
      </React.Fragment>
    );
  };

  renderFinishGameButton = () => {
      return (
        <React.Fragment>
          <Col md={12} className="madness-game-interaction-button-container">
            <Button
              onClick={this.finishGame}
              disabled={!this.state.isFinishGameButtonEnabled}
            >
              Finish
            </Button>
          </Col>
        </React.Fragment>
      );
  };

  goToGame = () => {
    this.props.handleCurrentGameChange(this.props.item);
    this.props.handleActiveTabChange(3);
  };

  renderJoinedTotalBet = () => {
    const joinedRisk = (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.item.player2TotalBet)).toFixed(2)}USD)
      </React.Fragment>
    );
    if (this.props.item.player2TotalBet) {
      return (
        <React.Fragment>
          <div className="madness-game-bet-title">
            Joined total bet:
          </div>
          {window.web3.fromWei(this.props.item.player2TotalBet)} ETH {this.props.ethPrice ? joinedRisk : null}
        </React.Fragment>
      );
    }
    return null;
  };

  renderCountDown = () => {
    if (this.props.item.status === 'Joined') {
      const title = this.props.item.playerWhoBetLast === this.props.currentAccount ?
        "Your opponent's turn! " : 'Your turn!';
      return (
        <React.Fragment>
          {title}
          <Countdown
            start={this.props.item.lastRaiseTime || 0}
            duration={3}
            countdownEnded={this.enableFinishGameButton}
          />
        </React.Fragment>
      );
    }
    return null;
  };

  render() {
    const hostRisk = (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.item.player1TotalBet)).toFixed(2)}USD)
      </React.Fragment>
    );
    return (
      <Row className="madness-game-item-container madness-game-link-container" onClick={this.goToGame}>
        <Col mdOffset={3} md={6}>
          <Row>
            <Col md={3} className="madness-game-title-container">
              <Row>
                Game #{this.props.item.id} {this.props.item.status}
              </Row>
              <Row>
                <img
                  src={getGravatarUrl(this.props.item.player1)}
                  alt="no img"
                />
              </Row>
            </Col>
            <Col md={9}>
              <Row className="madness-game-my-games-countdown-container">
                {this.renderCountDown()}
              </Row>
              <Row>
                <div className="madness-game-bet-title">
                  Host total bet:
                </div>
                {window.web3.fromWei(this.props.item.player1TotalBet)} ETH {this.props.ethPrice ? hostRisk : null}
              </Row>
              <Row>
                {this.renderJoinedTotalBet()}
              </Row>
              <Row>
                {this.renderInteractionContainer()}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default MyGamesItem;