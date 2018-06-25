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

  renderGameInteractionButton = () => {
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
          Joined total bet: {window.web3.fromWei(this.props.item.player2TotalBet)} ETH {this.props.ethPrice ? joinedRisk : null}
        </React.Fragment>
      );
    }
    return null;
  };

  renderCountDown = () => {
    if (this.props.item.status === 'Joined') {
      const title = this.props.item.playerWhoBetLast === this.props.currentAccount ?
        "Your opponent's turn" : 'Your turn';
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
      <Row className="madness-game-item-container">
        <Col md={7}>
          <Col md={4} className="madness-game-item-title-container">
            <Row>
              <Col md={12}>
                <div className="madness-game-item-title madness-game-link-container"
                     onClick={this.goToGame}
                >
                  Game #{this.props.item.id}
                </div> {this.props.item.status}
              </Col>
              <Col md={12}>
                <img
                  src={getGravatarUrl(this.props.item.player1)}
                  alt="no img"
                />
              </Col>
            </Row>
          </Col>
          <Col md={8} className="madness-game-item-data-container">
            Host total bet: {window.web3.fromWei(this.props.item.player1TotalBet)} ETH {this.props.ethPrice ? hostRisk : null}
            <br />
            {this.renderJoinedTotalBet()}
          </Col>
        </Col>
        <Col md={3} className="madness-game-item-data-container">
          {this.renderCountDown()}
        </Col>
        <Col md={2} className="madness-game-interaction-button-container">
          {this.renderGameInteractionButton()}
        </Col>
      </Row>
    );
  }
}

export default MyGamesItem;