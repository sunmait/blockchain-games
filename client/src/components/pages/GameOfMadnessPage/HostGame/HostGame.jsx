import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';

class HostGame extends React.Component {

  hostGame = () => {
    const {hostGame} = this.props.contractInstance;
    hostGame.sendTransaction(
      {
        value: 10 ** 18,
      },
      (err, result) => {
        if (err) {
          console.log('err');
        } else {
          console.log('game hosted');
        }
      }
    );
  };

  render() {
    return (
      <Row>
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