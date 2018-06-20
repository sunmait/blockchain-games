import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Countdown from '../../../common/Countdown/Countdown';
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
      if (this.props.currentAccount === item.hostAddress) {
        return (
          <React.Fragment>
            <Col md={12}>
              <Button
                className="pull-right"
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
                className="pull-right"
              />
            </Col>
          </React.Fragment>
        );
      }
      if (this.props.currentAccount === item.joinedAddress) {
        return (
          <React.Fragment>
            <Col md={12}>
              <Button
                className="pull-right"
                onClick={() => this.finishExpiredGame(item.id)}
                disabled={!this.state.isFinishExpiredGameButton}
              >
                Finish game
              </Button>
            </Col>
            <Col md={12}>
              <Countdown
                start={item.gameJoinTime}
                countdownEnded={this.enableFinishExpiredGameButton}
                className="pull-right"
              />
            </Col>
          </React.Fragment>
        );
      }
    }
    if (item.status === 'Ended') {
      return (
        <Button
          className="pull-right"
          onClick={() => {
            this.props.handleCurrentGameChange(item.id);
            this.props.handleActiveTabChange(3);
          }}
        >
          Check result
        </Button>
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
      <Row className="games-list-item-container">
        <Col md={6}>
          Game #{this.props.item.id}
          <br />
          Game price: {window.web3.fromWei(this.props.item.price)} ETH {this.props.ethPrice ? risk : null}
        </Col>
        <Col md={3}>
          Game status: {this.props.item.status}
        </Col>
        <Col md={3}>
          {this.renderRevealButton(this.props.item)}
        </Col>
      </Row>
    );
  }
}

export default MyGamesItem;