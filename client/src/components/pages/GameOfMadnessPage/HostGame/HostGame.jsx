import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';

class HostGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      betAmount: 0.000045,
    };
  }

  hostGame = () => {
    if (this.state.betAmount < 0.000045) {
      return;
    }
    const {hostGame} = this.props.contractInstance;
    const transactionData = { value: window.web3.toWei(this.state.betAmount) };
    hostGame.sendTransaction(transactionData, (err) => {
      if (err) {
        // TODO: handle this case
        console.log('err');
      }
    });
  };

  handleFieldChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  render() {
    const risk = (
      <React.Fragment>
        ({(this.props.ethPrice * this.state.betAmount).toFixed(2)}USD)
      </React.Fragment>
    );
    return (
      <Col mdOffset={4} md={4}>
        Bet amount:
        <FormControl
          type="text"
          value={this.state.betAmount}
          onChange={(event) => this.handleFieldChange('betAmount', event.target.value)}
        />
        ETH {this.props.ethPrice ? risk : null}
        <br />
        <Button
          onClick={this.hostGame}
          bsStyle="primary"
        >
          Host Game
        </Button>
      </Col>
    );
  }
}

export default HostGame;