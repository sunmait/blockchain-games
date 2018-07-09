import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Countdown from '../../../common/Countdown/Countdown';
import getGravatarUrl from '../../../../helpers/getGravatarUrl';
import './MyGamesItem.css';
import { NotificationManager } from 'react-notifications';

class MyGamesItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCountdownFinished: false,
      isFinishExpiredGameButton: false,
    };
  }

  renderCountdown = () => {
    if (this.props.item.status === 'Joined') {
      if (this.state.isCountdownFinished) {
        return (
          <div className="countdown-container">
            (Countdown finished)
          </div>
        )
      }
      if (this.props.currentAccount === this.props.item.player1) {
        return (
          <div className="countdown-container">
            (<Countdown
              start={this.props.item.gameJoinTime || 0}
              duration={60*60*24*7}
              countdownEnded={this.handleCountdownEnding}
            />)
          </div>
        );
      }
      if (this.props.currentAccount === this.props.item.player2) {
        return (
          <div className="countdown-container">
            (<Countdown
              start={this.props.item.gameJoinTime || 0}
              duration={60*60*24*7}
              countdownEnded={() => {
                this.enableFinishExpiredGameButton();
                this.handleCountdownEnding();
              }}
            />)
          </div>
        );
      }
    }
  };

  handleCountdownEnding = () => {
    this.setState({
      isCountdownFinished: true,
    });
  };

  renderInteractionContainer = () => {
    if (this.props.item.status === 'Ended') {
      return (
        <Col md={12} className="game-item-interaction-button-container">
          <Button
            onClick={() => {
              this.props.handleCurrentGameChange(this.props.item.id);
              this.props.handleActiveTabChange(3);
            }}
          >
            Check result
          </Button>
        </Col>
      );
    }
    if (this.props.item.status === 'Hosted') {
      return (
        <React.Fragment>
          Waiting for an opponent
        </React.Fragment>
      );
    }
    if (this.props.item.status === 'Joined') {
      if (this.props.currentAccount === this.props.item.player1) {
        return (
          <Col md={12} className="game-item-interaction-button-container">
            <Button
              onClick={() => {
                this.props.handleCurrentGameChange(this.props.item.id);
                this.props.handleActiveTabChange(3);
              }}
            >
              Reveal
            </Button>
          </Col>
        );
      }
      if (this.props.currentAccount === this.props.item.player2) {
        return (
          <Col md={12} className="game-item-interaction-button-container">
            <Button
              onClick={() => this.finishExpiredGame()}
              disabled={!this.state.isFinishExpiredGameButton}
            >
              Finish game
            </Button>
          </Col>
        );
      }
    }
  };

  enableFinishExpiredGameButton = () => {
    this.setState({
      isFinishExpiredGameButton: true,
    });
  };

  finishExpiredGame = () => {
    const {withdrawal} = this.props.contractInstance;
    withdrawal(this.props.item.id, (err) => {
      if (err) {
        NotificationManager.error(err.message, 'Transaction failed', 7000);
      } else {
        NotificationManager.info('Transaction operating.', 'Transaction Info', 5000);
      }
    });
  };

  render() {
    const risk = `(${(this.props.ethPrice * this.props.localWeb3.fromWei(this.props.item.price)).toFixed(2)}USD)`;
    return (
      <Row className="game-list-item-container">
        <Col mdOffset={3} md={6}>
          <Row>
            <Col md={2} className="game-list-img">
              <img
                src={getGravatarUrl(this.props.localWeb3.sha3(this.props.item.player1).slice(2))}
                alt="no img"
              />
            </Col>
            <Col md={10} className="game-item-payload-container">
              <Row>
                <Col className="game-item-title">
                  Game #{this.props.item.id}
                </Col>
              </Row>
              <Row>
                <div className="game-item-payload-title">
                  Status:
                </div> {this.props.item.status} {this.renderCountdown()}
              </Row>
              <Row>
                <div className="game-item-payload-title">
                  Game price:
                </div> {this.props.localWeb3.fromWei(this.props.item.price)} ETH {this.props.ethPrice ? risk : null}
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