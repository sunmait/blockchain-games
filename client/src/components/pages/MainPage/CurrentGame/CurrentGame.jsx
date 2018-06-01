import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import JoinGameContainer from '../JoinGame/JoinGameContainer';

class CurrentGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: this.props.gameStatus,
      hostNumber: '',
      hostSecret: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({
      status: nextProps.gameStatus,
    });
  }

  handleValueChanged = (value) => {
    this.setState({
      selectedNumber: value,
    });
  };

  revealWinner = () => {
    const {revealHiddenNumber} = this.props.contractInstance;
    revealHiddenNumber.call(this.props.gameId, this.state.hostNumber, this.state.hostSecret,
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
    console.log(this.state.status);
    if (this.state.status === 'Hosted') {
      return (
        <JoinGameContainer />
      );
    } else if (this.state.status === 'Ended') {
      return (
        <Row>
          Game ended.
        </Row>
      );
    } else if (this.state.status === 'Joined') {
      return (
        <Row>
          <Row>
            Insert your number:
            <input
              type="text"
              value={this.state.hostNumber}
              onChange={(event) => this.handleFieldChange('hostNumber', event.target.value)}
            />
          </Row>
          <Row>
            Insert your secret:
            <input
              type="text"
              value={this.state.hostSecret}
              onChange={(event) => this.handleFieldChange('hostSecret', event.target.value)}
            />
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