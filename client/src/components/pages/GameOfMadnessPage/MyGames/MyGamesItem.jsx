import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Countdown from '../../../common/Countdown/Countdown';
import './MyGamesItem.css';

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
    const {windrawal} = this.props.contractInstance;
    windrawal(this.props.item.id, (err) => {
        if (err) {
          console.log('err: ', err);
        } else {
          console.log('game ended');
        }
      }
    );
  };

  renderFinishGameButton = () => {
    if (this.props.item.status === 'Joined') {
      if (this.props.currentAccount === this.props.item.playerWhoBetLast) {
        return (
          <React.Fragment>
            <Col md={12}>
              <Button
                className="pull-right"
                onClick={this.finishGame}
                disabled={!this.state.isFinishGameButtonEnabled}
              >
                Finish
              </Button>
            </Col>
            <Col md={12}>
            </Col>
          </React.Fragment>
        );
      }
    }
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
      return (
        <React.Fragment>
          Countdown:
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
        <Col md={6}>
          <Col md={6}>
            <div className="game-link-container"
                 onClick={this.goToGame}
            >
              Game #{this.props.item.id}
            </div>
          </Col>
          <Col md={6}>
            Game status: {this.props.item.status}
          </Col>
          <Col md={12} className="game-item-data-container">
            Host total bet: {window.web3.fromWei(this.props.item.player1TotalBet)} ETH {this.props.ethPrice ? hostRisk : null}
            <br />
            {this.renderJoinedTotalBet()}
          </Col>
        </Col>
        <Col md={3}>
          {this.renderCountDown()}
        </Col>
        <Col md={3}>
          {this.renderFinishGameButton()}
        </Col>
      </Row>
    );
  }
}

export default MyGamesItem;