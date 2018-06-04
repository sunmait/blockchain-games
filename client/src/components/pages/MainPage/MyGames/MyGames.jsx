import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

class MyGames extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userGamesList: props.userGamesList,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      userGamesList: nextProps.userGamesList,
    });
  }

  renderGamesList = () => {
    if (this.state.userGamesList.length === 0) {
      return (
        <Row>
          There are no games
        </Row>
      );
    }
    return this.state.userGamesList.map((item, index) => {
      const key = index;
      return (
        <Row key={key} className="games-list-element-container">
          <Col md={6}>
            Game #{item.id}
            <br />
            Game price: {item.price} vei
          </Col>
          <Col md={6}>
            <Button
              onClick={() => {
                this.props.handleCurrentGameIdChange(item.id);
                this.props.handleActiveTabChange(3);
              }}
            >
              Check
            </Button>
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