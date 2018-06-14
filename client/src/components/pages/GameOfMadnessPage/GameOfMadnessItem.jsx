import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import './GameOfMadnessItem.css';

class GameOfMadnessItem extends React.Component {
  render() {
    return (
      <Row className="games-list-element-container">
        <Col md={12}>
          Game #{this.props.item.id}
          Price: {this.props.item.price}
        </Col>
      </Row>
    );
  }
}

export default GameOfMadnessItem;