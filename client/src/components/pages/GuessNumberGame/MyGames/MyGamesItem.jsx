import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Countdown from '../../../common/Countdown/Countdown';
import getGravatarUrl from '../../../../helpers/getGravatarUrl';
import './MyGamesItem.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class MyGamesItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFinishExpiredGameButton: false,
    };
  }

  renderCountodw = () => {
    if (this.props.item.status === 'Joined') {
      if (this.props.currentAccount === this.props.item.player1) {
        return (
          <React.Fragment>
            (<Countdown
              start={this.props.item.gameJoinTime}
              duration={60*60*24*7}
            />)
          </React.Fragment>
        );
      }
      if (this.props.currentAccount === this.props.item.player2) {
        return (
          <React.Fragment>
            (<Countdown
              start={this.props.item.gameJoinTime}
              duration={60*60*24*7}
              countdownEnded={this.enableFinishExpiredGameButton}
            />)
          </React.Fragment>
        );
      }
    }
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
        NotificationManager.error(err, 'Transaction failed', 7000);
      } else {
        NotificationManager.info('Transaction operating.', 'Transaction Info', 5000);
      }
    });
  };

  render() {
    const risk = (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.item.price)).toFixed(2)}USD)
      </React.Fragment>
    );
    return (
      <Row className="game-item-container">
        <Col mdOffset={3} md={6}>
          <Row>
            <Col md={3}>
              <Col md={12} className="game-item-title title-centralized">
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
            </Col>
            <Col md={9} className="number-game-item-payload-container">
              <Row>
                Status: {this.props.item.status} {this.renderCountodw()}
              </Row>
              <Row>
                Game price: {window.web3.fromWei(this.props.item.price)} ETH {this.props.ethPrice ? risk : null}
              </Row>
              <Row>
                {this.renderInteractionContainer()}
              </Row>
            </Col>
          </Row>
        </Col>
        <NotificationContainer />
      </Row>
    );
  }
}

export default MyGamesItem;