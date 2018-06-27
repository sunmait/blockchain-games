import React from 'react';
import NumberPicker from '../../../common/NumberPicker/NumberPicker';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import FormControl from 'react-bootstrap/lib/FormControl';
import generateString from '../../../../helpers/stringGenerator';
import './HostGame.css';

class HostGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNumber: undefined,
      isModal: false,
      secretWord: '',
      gamePrice: 0.000045,
    };
  }

  handleValueChanged = (value) => {
    this.setState({
      selectedNumber: value,
    });
  };

  hostGame = () => {
    if (!Number(this.state.selectedNumber)) {
      return;
    }
    if (this.state.selectedNumber < 1 || this.state.selectedNumber > 10) {
      return;
    }
    if (this.state.gamePrice < 0.000045) {
      return;
    }
    const {hostGame} = this.props.contractInstance;
    const secretWord = generateString(16);
    const hiddenNumber = window.web3.sha3(window.web3.toHex(this.state.selectedNumber) + secretWord);
    hostGame.sendTransaction(hiddenNumber, window.web3.toWei(this.state.gamePrice),
      {
        value: window.web3.toWei(this.state.gamePrice),
      },
      (err) => {
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
    });
    this.props.handleActiveTabChange(2);
  };

  copyToClipboard = () => {
    const copyText = document.getElementById("secret-word-container");
    const modalBox = document.getElementById("game-hosted-payload-container");
    const textArea = document.createElement("textArea");
    textArea.value = copyText.textContent;
    modalBox.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  };

  message = () => {
    return (
      <Modal id="game-hosted-payload-container" show={this.state.isModal}>
        <Modal.Header>
          <p>You should hold secret and the value that you chose.</p>
          <p>You will need these values to finish the game.</p>
        </Modal.Header>
        <Modal.Body>
          <p>Your number: {this.state.selectedNumber}</p>
          <Row>
            <Col md={12}>
              Your secret: <span id="secret-word-container">{this.state.secretWord}</span>
              <Button
                className="btn-sm"
                onClick={this.copyToClipboard}
                style={{marginLeft: 5}}
              >
                <span
                  className="glyphicon glyphicon-copy"
                />
              </Button>
            </Col>
          </Row>
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
    const risk = (
      <React.Fragment>
        ({(this.props.ethPrice * this.state.gamePrice).toFixed(2)}USD)
      </React.Fragment>
    );
    return (
      <Row>
        <Row>
          <Col mdOffset={1} md={3}>
            <NumberPicker
              title={this.state.selectedNumber || 'Select'}
              handleValueChanged={(value) => this.handleValueChanged(value)}
            />
          </Col>
          <Col md={4}>
            Bet amount:
            <FormControl
              className="game-price-input"
              type="text"
              value={this.state.gamePrice}
              onChange={(event) => this.handleFieldChange('gamePrice', event.target.value)}
            />
            ETH {this.props.ethPrice ? risk : null}
          </Col>
        </Row>
        <Row>
          <Col mdOffset={5} md={3} className="number-game-interaction-button-container">
            <Button
              onClick={this.hostGame}
              bsStyle="primary"
            >
              Host Game
            </Button>
          </Col>
        </Row>
        {this.message()}
      </Row>
    );
  }
}

export default HostGame;