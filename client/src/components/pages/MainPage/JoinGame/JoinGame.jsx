import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

class JoinGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      evenOddSelectorTitle: 'Select your bet'
    };
  }

  handleValueChanged = (value) => {
    this.setState({
      selectedNumber: value,
    });
  };

  joinGame = () => {
    if (this.state.evenOddSelectorTitle !== 'Even' && this.state.evenOddSelectorTitle !== 'Odd') {
      return;
    }
    const {joinGame} = this.props.contractInstance;
    const playerBet = this.state.evenOddSelectorTitle === 'Even' ? 0 : 1;
    joinGame.sendTransaction(this.props.currentGame.id, playerBet,
      {
        value: this.props.currentGame.price,
      },
      (err, answer) => {
      if (err) {
        console.log('error', err);
      } else {
        console.log('answer', answer);
        this.setState({
          evenOddSelectorTitle: 'Select your bet',
        });
      }
    });
  };

  toggleDropdownButtonState = (value) => {
    this.setState({
      evenOddSelectorTitle: value,
    });
  };

  renderEvenOddSelector = () => {
    return (
      <DropdownButton
        id="event-odd-selector"
        title={this.state.evenOddSelectorTitle}
      >
        <MenuItem
          eventKey={1}
          onSelect={() => this.toggleDropdownButtonState('Even')}
        >
          Even
        </MenuItem>
        <MenuItem
          eventKey={2}
          onSelect={() => this.toggleDropdownButtonState('Odd')}
        >
          Odd
        </MenuItem>
      </DropdownButton>
    );
  };

  render() {
    return (
      <Row>
        <Col md={4}>
          Game #{this.props.currentGame.id}
          {this.renderEvenOddSelector()}
        </Col>
        <Col md={4}>
          <Button
            onClick={this.joinGame}
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