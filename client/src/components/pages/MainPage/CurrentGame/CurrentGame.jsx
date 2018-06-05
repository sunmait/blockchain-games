import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import JoinGameContainer from '../JoinGame/JoinGameContainer';

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
      {
        gas: 999000,
        gasPrice: 20,
      },
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
      console.log(this.props.currentGame);
      return (
        <Row>
          Game ended.
        </Row>
      );
    } else if (this.props.currentGame.status === 'Joined') {
      return (
        <Row>
          <Row>
            <Col md={3}>
              Insert your number:
              <FormControl
                type="text"
                value={this.state.hostNumber}
                onChange={(event) => this.handleFieldChange('hostNumber', event.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              Insert your secret:
              <FormControl
                type="text"
                value={this.state.hostSecret}
                onChange={(event) => this.handleFieldChange('hostSecret', event.target.value)}
              />
            </Col>
          </Row>

          <Button
            onClick={() => {
              this.revealWinner();
            }}
          >
            Reveal winner
          </Button>
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