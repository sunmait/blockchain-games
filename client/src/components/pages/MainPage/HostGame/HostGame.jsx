import React from 'react';
import NumberPicker from '../../../common/NumberPicker/NumberPicker';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

class HostGame extends React.Component {
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

  hostGame = () => {
    const {hostGame} = this.props.contractInstance;
    hostGame(this.state.selectedNumber, (err, answer) => {
      if (err) {
        console.log('err', err);
      } else {
        console.log('smthg', answer);
      }
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
            onClick={this.hostGame}
            bsStyle="primary"
          >
            Host Game
          </Button>
        </Col>
      </Row>
    );
  }
}

export default HostGame;