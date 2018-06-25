import React, { Component } from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import getGravatarUrl from '../../../../helpers/getGravatarUrl';
import './HostedGames.css';

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
        <Row key={index} className="number-game-item-container">
          <Col md={3}>
            <Row className="number-game-item-title-container">
              <Col md={12} className="number-game-item-title">
                Game #{item.id}
              </Col>
              <Col md={12}>
                <img
                  src={getGravatarUrl(item.player1)}
                  alt="no img"
                />
              </Col>
            </Row>
          </Col>
          <Col md={5} className="number-game-item-data-container">
            Bet amount: {window.web3.fromWei(item.price)} ETH {this.props.ethPrice ? risk : null}
          </Col>
          <Col md={4} className="number-game-interaction-button-container">
            <Button
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
