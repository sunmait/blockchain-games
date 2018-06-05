import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

class MyGames extends React.Component {
  renderRevealButton = (item) => {
    if (item.status === 'Joined') {
      return (
        <Button
          onClick={() => {
            this.props.handleCurrentGameChange(item.id);
            this.props.handleActiveTabChange(3);
          }}
        >
          Reveal
        </Button>
      );
    }
    if (item.status === 'Ended') {
      return (
        <Button
          onClick={() => {
            this.props.handleCurrentGameChange(item.id);
            this.props.handleActiveTabChange(3);
          }}
        >
          Check result
        </Button>
      )
    }
    return null;
  };

  renderGamesList = () => {
    if (this.props.userGamesList.length === 0) {
      return (
        <Row>
          There are no games
        </Row>
      );
    }
    return this.props.userGamesList.map((item, index) => {
      const key = index;
      return (
        <Row key={key} className="games-list-element-container">
          <Col md={6}>
            Game #{item.id}
            <br />
            Game price: {item.price} vei
          </Col>
          <Col md={6}>
            Game status: {item.status}
            {this.renderRevealButton(item)}
          </Col>
        </Row>
      );
    });
  };

  render() {
    return (
      <Row>
        <Col md={10}>
          {this.renderGamesList()}
        </Col>
      </Row>
    );
  }
}

export default MyGames;