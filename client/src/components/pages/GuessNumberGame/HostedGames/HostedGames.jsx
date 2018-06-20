import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

class HostedGames extends Component {

  renderGamesList = () => {
    if (this.props.hostedGamesList.length === 0) {
      return (
        <div>
          There are no currently open games
          <br />
          <Button
            onClick={() => {
              this.props.handleActiveTabChange(3);
              this.props.handleCurrentGameChange(null);
            }}
            bsStyle="primary"
          >
            Host game
          </Button>
        </div>
      );
    }
    return this.props.hostedGamesList.map((item, index) => {
      const risk = (
        <React.Fragment>
          ({(this.props.ethPrice * window.web3.fromWei(item.price)).toFixed(2)}USD)
        </React.Fragment>
      );
      return (
        <Row key={index} className="games-list-item-container">
          <Col md={6}>
            Game #{item.id}
            <br />
            Bet amount: {window.web3.fromWei(item.price)} ETH {this.props.ethPrice ? risk : null}
          </Col>
          <Col md={6}>
            <Button
              className="pull-right"
              onClick={() => {
                this.props.handleActiveTabChange(3);
                this.props.handleCurrentGameChange(item.id);
              }}
            >
              Join Game
            </Button>
          </Col>
        </Row>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.renderGamesList()}
      </React.Fragment>
    );
  }
}

export default HostedGames;
