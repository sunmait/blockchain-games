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
        <Row key={index} className="game-item-container">
          <Col mdOffset={3} md={6}>
            <Row>
              <Col md={2}>
                <img
                  src={getGravatarUrl(item.player1)}
                  alt="no img"
                />
              </Col>
              <Col md={10}>
                <Row className="game-item-title">
                  Game #{item.id}
                </Row>
                <Row className="game-item-payload">
                  Bet amount: {window.web3.fromWei(item.price)} ETH {this.props.ethPrice ? risk : null}
                </Row>
                <Row className="game-item-interaction-button-container">
                  <Button
                    onClick={() => {
                      this.props.handleActiveTabChange(3);
                      this.props.handleCurrentGameChange(item.id);
                    }}
                  >
                    Join Game
                  </Button>
                </Row>
              </Col>
            </Row>
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
