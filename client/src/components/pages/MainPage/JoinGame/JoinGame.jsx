import React from 'react';
import NumberPicker from '../../../common/NumberPicker/NumberPicker';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

class JoinGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNumber: null,
    }
  }

  handleValueChanged = (value) => {
    this.setState({
      selectedNumber: value,
    });
  };

  render() {
    return (
      <Row>
        <Col md={4}>
          <NumberPicker
            title="Choose your number"
            handleValueChanged={(value) => this.handleValueChanged(value)}
          />
        </Col>
        <Col md={4}>
          <Button
            onClick={() => this.props.joinGame(this.state.selectedNumber)}
            bsStyle="primary"
          >
            Join Game
          </Button>
        </Col>
      </Row>
    );
  }
}

export default JoinGame;