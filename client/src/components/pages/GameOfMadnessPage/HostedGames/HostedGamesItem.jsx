import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import './HostedGamesItem.css';
import getGravatarUrl from '../../../../helpers/getGravatarUrl';

class HostedGamesItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      betAmount: window.web3.fromWei(this.props.item.player1TotalBet),
    }
  }

  joinGame = () => {
    if (this.state.betAmount <= window.web3.fromWei(this.props.item.player1TotalBet)) {
      return;
    }
    const {joinGame} = this.props.contractInstance;
    const transactionData = { value: window.web3.toWei(this.state.betAmount) };
    joinGame.sendTransaction(this.props.item.id, transactionData, (err) => {
        if (err) {
          console.log('err', err);
        } else {
          this.props.handleActiveTabChange(2);
        }
      }
    );
  };

  handleFieldChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  render() {
    const risk = (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.item.player1TotalBet)).toFixed(2)}USD)
      </React.Fragment>
    );
    return (
      <Row className="madness-game-item-container">
        <Col md={3}>
          <Row className="madness-game-item-title-container">
            <Col md={12} className="madness-game-item-title">
              Game #{this.props.item.id}
            </Col>
            <Col md={12}>
              <img
                src={getGravatarUrl(this.props.item.player1)}
                alt="no img"
              />
            </Col>
          </Row>
        </Col>
        <Col md={5} className="madness-game-item-data-container">
          Host bet: {window.web3.fromWei(this.props.item.player1TotalBet)} ETH {this.props.ethPrice ? risk : null}
        </Col>
        <Col md={4}>
          <Row>
            <Col md={12} className="madness-game-join-input-container">
              Your bet:
              <FormControl
                type="text"
                value={this.state.betAmount}
                onChange={(event) => this.handleFieldChange('betAmount', event.target.value)}
              />
            </Col>
            <Col md={12} className="madness-game-join-button-container">
              <Button
                onClick={this.joinGame}
              >
                Join game
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default HostedGamesItem;