import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Countdown from '../../../common/Countdown/Countdown';

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

  render() {
    const hostRisk = (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.item.player1TotalBet)).toFixed(2)}USD)
      </React.Fragment>
    );
    const joinedRisk = (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.item.player2TotalBet)).toFixed(2)}USD)
      </React.Fragment>
    );
    return (
      <Row className="madness-game-item-container">
        <Col md={3}>
          <div
            onClick={this.goToGame}
          >
            Game #{this.props.item.id}
          </div>
          <br />
          Host total bet: {window.web3.fromWei(this.props.item.player1TotalBet)} ETH {this.props.ethPrice ? hostRisk : null}
          <br />
          Joined total bet: {window.web3.fromWei(this.props.item.player2TotalBet)} ETH {this.props.ethPrice ? joinedRisk : null}
        </Col>
        <Col md={3}>
          Game status: {this.props.item.status}
        </Col>
        <Col md={3}>
          Countdown:
          <Countdown
            start={this.props.item.lastRaiseTime}
            duration={3}
            countdownEnded={this.enableFinishGameButton}
          />
        </Col>
        <Col md={3}>
          {this.renderFinishGameButton()}
        </Col>
      </Row>
    );
  }
}

export default MyGamesItem;