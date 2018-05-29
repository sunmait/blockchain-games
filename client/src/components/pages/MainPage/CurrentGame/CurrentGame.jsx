import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import NumberPicker from '../../../common/NumberPicker/NumberPicker';

class CurrentGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentGameId: this.props.currentGameId,
      status: 'join',
      selectedNumber: null,
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
        <Row>
          <Col md={4}>
            Game #{this.state.currentGameId}
            <NumberPicker
              title="Choose your number"
              handleValueChanged={(value) => this.handleValueChanged(value)}
            />
          </Col>
          <Col md={4}>
            <Button
              onClick={() => this.props.joinGame(this.state.currentGameId, this.state.selectedNumber)}
              bsStyle="primary"
            >
              Join Game
            </Button>
          </Col>
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