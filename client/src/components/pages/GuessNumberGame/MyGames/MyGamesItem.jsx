import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Countdown from '../../../common/Countdown/Countdown';
import getGravatarUrl from '../../../../helpers/getGravatarUrl';
import './MyGamesItem.css';

class MyGamesItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFinishExpiredGameButton: false,
    };
  }

  renderRevealButton = (item) => {
    if (item.status === 'Joined') {
      if (this.props.currentAccount === item.player1) {
        return (
          <React.Fragment>
            <Col md={12} className="number-game-interaction-button-container">
              <Button
                onClick={() => {
                  this.props.handleCurrentGameChange(item.id);
                  this.props.handleActiveTabChange(3);
                }}
              >
                Reveal
              </Button>
            </Col>
            <Col md={12}>
              <Countdown
                start={item.gameJoinTime}
                duration={60*60*24*7}
              />
            </Col>
          </React.Fragment>
        );
      }
      if (this.props.currentAccount === item.player2) {
        return (
          <React.Fragment>
            <Col md={12} className="number-game-interaction-button-container">
              <Button
                onClick={() => this.finishExpiredGame(item.id)}
                disabled={!this.state.isFinishExpiredGameButton}
              >
                Finish game
              </Button>
            </Col>
            <Col md={12} className="countdown-container">
              <Countdown
                start={item.gameJoinTime}
                duration={60*60*24*7}
                countdownEnded={this.enableFinishExpiredGameButton}
              />
            </Col>
          </React.Fragment>
        );
      }
    }
    if (item.status === 'Ended') {
      return (
        <Col md={12} className="number-game-interaction-button-container">
          <Button
            onClick={() => {
              this.props.handleCurrentGameChange(item.id);
              this.props.handleActiveTabChange(3);
            }}
          >
            Check result
          </Button>
        </Col>
      )
    }
    return null;
  };

  enableFinishExpiredGameButton = () => {
    this.setState({
      isFinishExpiredGameButton: true,
    });
  };

  finishExpiredGame = (gameId) => {
    const {withdrawal} = this.props.contractInstance;
    withdrawal(gameId, (err, answer) => {
      if (err) {
        console.log('err: ', err);
      } else {
        console.log('answer: ', answer);
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
      <Row className="number-game-item-container">
        <Col md={3}>
          <Row className="number-game-item-title-container">
            <Col md={12} className="number-game-item-title">
              Game #{this.props.item.id} {this.props.item.status}
            </Col>
            <Col md={12}>
              <img
                src={getGravatarUrl(this.props.item.player1)}
                alt="no img"
              />
            </Col>
          </Row>
        </Col>
        <Col md={5} className="number-game-item-data-container">
          Game price: {window.web3.fromWei(this.props.item.price)} ETH {this.props.ethPrice ? risk : null}
        </Col>
        <Col md={4}>
          {this.renderRevealButton(this.props.item)}
        </Col>
      </Row>
    );
  }
}

export default MyGamesItem;