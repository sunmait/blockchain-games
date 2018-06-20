import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import './HostedGamesItem.css';

class HostedGamesItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpandedRow: false,
      betAmount: window.web3.fromWei(this.props.item.player1TotalBet),
    }
  }

  toggleExpandedRowState = () => {
    this.setState({
      isExpandedRow: !this.state.isExpandedRow,
    });
  };

  joinGame = () => {
    if (this.state.betAmount <= window.web3.fromWei(this.props.item.player1TotalBet)) {
      return;
    }
    const {joinGame} = this.props.contractInstance;
    const transactionData = { value: window.web3.toWei(this.state.betAmount) };
    joinGame.sendTransaction(this.props.item.id, transactionData, (err, result) => {
        if (err) {
          console.log('err', err);
        } else {
          console.log('game joined', result);
        }
      }
    );
  };

  handleFieldChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  render() {
    const expandedRow = (
      <Col md={12} className="madness-game-item-expanded-row">
        <Col md={3}>
          Your bet:
          <FormControl
            type="text"
            value={this.state.betAmount}
            onChange={(event) => this.handleFieldChange('betAmount', event.target.value)}
          />
        </Col>
        <Button
          className="pull-right"
          onClick={this.joinGame}
        >
          Join game
        </Button>
      </Col>
    );
    const risk = (
      <React.Fragment>
        ({(this.props.ethPrice * window.web3.fromWei(this.props.item.player1TotalBet)).toFixed(2)}USD)
      </React.Fragment>
    );
    return (
      <Row className="madness-game-item-container">
        <Col className="madness-game-item" onClick={this.toggleExpandedRowState}>
          Game #{this.props.item.id}
          <br />
          Host bet: {window.web3.fromWei(this.props.item.player1TotalBet)} ETH {this.props.ethPrice ? risk : null}
        </Col>
        {this.state.isExpandedRow ? expandedRow : null}
      </Row>
    );
  }
}

export default HostedGamesItem;