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
        <Row className="text-centralized">
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
        </Row>
      );
    }
    return this.props.hostedGamesList.slice().reverse().map((item, index) => {
      const risk = `(${(this.props.ethPrice * this.props.localWeb3.fromWei(item.price)).toFixed(2)}USD)`;
      return (
        <Row key={index} className="game-list-item-container">
          <Col mdOffset={3} md={6}>
            <Row>
              <Col md={2} className="game-list-img">
                <img
                  src={getGravatarUrl(this.props.localWeb3.sha3(item.player1).slice(2))}
                  alt="no img"
                />
              </Col>
              <Col md={10}>
                <Row className="game-item-title">
                  Game #{item.id}
                </Row>
                <Row className="game-item-payload">
                  Bet amount: {this.props.localWeb3.fromWei(item.price)} ETH {this.props.ethPrice ? risk : null}
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
