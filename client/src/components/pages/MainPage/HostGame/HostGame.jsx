import React from 'react';
import NumberPicker from '../../../common/NumberPicker/NumberPicker';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import FormControl from 'react-bootstrap/lib/FormControl';
import generateString from '../../../../helpers/stringGenerator';

class HostGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNumber: null,
      isModal: false,
      secretWord: '',
      gamePrice: 0,
    };
  }

  handleValueChanged = (value) => {
    this.setState({
      selectedNumber: value,
    });
  };

  hostGame = () => {
    const {hostGame} = this.props.contractInstance;
    const secretWord = generateString(16);
    const hiddenNumber = window.web3.sha3(window.web3.toHex(this.state.selectedNumber) + secretWord);
    hostGame.sendTransaction(hiddenNumber, this.state.gamePrice,
      {
        value: this.state.gamePrice,
      },
      (err, answer) => {
      if (err) {
        console.log('err', err);
      } else {
        this.setState({
          secretWord,
          isModal: true,
        });
      }
    });
  };

  closeModal = () => {
    this.setState({
      isModal: false,
      secretWord: '',
      selectedNumber: null,
    });
  };

  message = () => {
    return (
      <Modal show={this.state.isModal}>
        <Modal.Header>
          <p>You should hold secret and the value that you chose.</p>
          <p>You will need these values to finish the game.</p>
        </Modal.Header>
        <Modal.Body>
          <p>Your number: {this.state.selectedNumber}</p>
          <p>Your secret: {this.state.secretWord}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.closeModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  handleFieldChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  render() {
    return (
      <Row>
        <Row>
          <Col md={4}>
            <NumberPicker
              title={this.state.selectedNumber || 'Select'}
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
        <Row>
          <Col md={3}>
            Game price:
            <FormControl
              type="text"
              value={this.state.gamePrice}
              onChange={(event) => this.handleFieldChange('gamePrice', event.target.value)}
            />
          </Col>
        </Row>
        {this.message()}
      </Row>
    );
  }
}

export default HostGame;