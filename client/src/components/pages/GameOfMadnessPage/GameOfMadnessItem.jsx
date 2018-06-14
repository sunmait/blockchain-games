import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import './GameOfMadnessItem.css';

class GameOfMadnessItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpandedRow: false,
    }
  }

  toggleExpandedRowState = () => {
    this.setState({
      isExpandedRow: !this.state.isExpandedRow,
    });
  };

  render() {
    const expandedRow = (
      <Col md={12} className="madness-game-item-expanded-row">
        <Button
          className="pull-right"
        >
          Join game
        </Button>
      </Col>
    );
    return (
      <Row className="madness-game-item-container">
        <Col className="madness-game-item" onClick={this.toggleExpandedRowState}>
          Game #{this.props.item.id}
          <br />
          Price: {this.props.item.price} Vei
        </Col>
        {this.state.isExpandedRow ? expandedRow : null}
      </Row>
    );
  }
}

export default GameOfMadnessItem;