import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class MyGamesItem extends React.Component {

  render() {
    return (
      <Row className="madness-game-item-container">
        <Col md={6}>
          Game #{this.props.item.id}
          <br />
          Host total bet: {this.props.item.player1TotalBet} Vei
          <br />
          Joined total bet: {this.props.item.player2TotalBet} Vei
        </Col>
        <Col md={3}>
          Game status: {this.props.item.status}
        </Col>
        <Col md={3}>
          Last raise time: {this.props.item.lastRaiseTime}
        </Col>
      </Row>
    );
  }
}

export default MyGamesItem;