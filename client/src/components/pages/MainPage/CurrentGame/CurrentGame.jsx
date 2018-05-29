import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import JoinGameContainer from '../JoinGame/JoinGameContainer';

class CurrentGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'join',
    }
  }

  handleValueChanged = (value) => {
    this.setState({
      selectedNumber: value,
    });
  };

  renderGame = () => {
    if (this.state.status === 'join') {
      return (
        <JoinGameContainer />
      );
    } else if (this.state.status === 'joined') {
      return (
        <Row>
          You are in game with value: ... .
        </Row>
      );
    }
    return (
      <p>
        Current Game.
      </p>
    );
  };

  render() {
    return (
      <Row>
        {this.renderGame()}
      </Row>
    );
  }
}

export default CurrentGame;