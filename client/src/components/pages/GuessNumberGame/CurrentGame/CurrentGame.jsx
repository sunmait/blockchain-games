import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import JoinGameContainer from '../JoinGame/JoinGameContainer';
import './CurrentGame.css';

class CurrentGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hostNumber: '',
      hostSecret: '',
    }
  }

  handleValueChanged = (value) => {
    this.setState({
      selectedNumber: value,
    });
  };

  revealWinner = () => {
    const {revealHiddenNumber} = this.props.contractInstance;
    revealHiddenNumber(this.props.currentGame.id, this.state.hostNumber, this.state.hostSecret,
      (err, answer) => {
        if (err) {
          console.log('err: ', err);
        } else {
          console.log('answer: ', answer);
        }
      });
  };

  handleFieldChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  renderGame = () => {
    if (this.props.currentGame.status === 'Hosted') {
      return (
        <JoinGameContainer />
      );
    } else if (this.props.currentGame.status === 'Ended') {
      let result = '';
      if (this.props.currentGame.result === 'Win') {
        result = 'Hosted game player Win';
      } else if (this.props.currentGame.result === 'Loss') {
        result = 'Joined game player Win';
      }
      return (
        <Row>
          Game ended with result: {result}.
        </Row>
      );
    } else if (this.props.currentGame.status === 'Joined') {
      return (
        <Row>
          <Col md={8}>
            Input your number and secret to finish this game.
            <Row>
              <Col md={6}>
                Your number:
                <FormControl
                  type="text"
                  value={this.state.hostNumber}
                  onChange={(event) => this.handleFieldChange('hostNumber', event.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                Your secret:
                <FormControl
                  type="text"
                  value={this.state.hostSecret}
                  onChange={(event) => this.handleFieldChange('hostSecret', event.target.value)}
                />
              </Col>
            </Row>
          </Col>
          <Col md={4} className="number-game-interaction-button-container">
            <Button
              onClick={() => {
                this.revealWinner();
              }}
            >
              Reveal winner
            </Button>
          </Col>
        </Row>
      )
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