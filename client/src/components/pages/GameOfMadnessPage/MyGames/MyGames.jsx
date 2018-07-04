import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import MyGamesItemContainer from './MyGamesItemContainer';

class MyGames extends React.Component {
  renderGamesList = () => {
    if (this.props.userGamesList.length === 0) {
      return (
        <Row>
          There are no games
        </Row>
      );
    }
    return this.props.userGamesList.slice().reverse().map((item, index) => {
      return (
        <MyGamesItemContainer
          item={item}
          key={index}
        />
      )
    });
  };

  render() {
    return (
      <Row>
        <Col md={12}>
          {this.renderGamesList()}
        </Col>
      </Row>
    );
  }
}

export default MyGames;