import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';

class HostGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      betAmount: 0
    }
  }

  hostGame = () => {
    if (this.state.betAmount < 100) return;
    const {hostGame} = this.props.contractInstance;
    hostGame.sendTransaction({ value: this.state.betAmount }, (err) => {
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
    return (
      <Row>
        Bet amount:
        <FormControl
          type="text"
          value={this.state.betAmount}
          onChange={(event) => this.handleFieldChange('betAmount', event.target.value)}
        />
        <Button
          onClick={this.hostGame}
          bsStyle="primary"
        >
          Host Game
        </Button>
      </Row>
    );
  }
}

export default HostGame;