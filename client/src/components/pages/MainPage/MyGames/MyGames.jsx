import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

class MyGames extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userGamesList: [],
    }
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

  getUserGamesPricesByIds = (gamesIds) => {
    const {getGameById} = this.props.contractInstance;
    return gamesIds.map(gameId => {
      return new Promise((resolve) => {
        getGameById(
          gameId,
          (err, result) => {
            if (err) {
              console.log('err: ', err);
            } else {
              const gamePrice = Number(result[2]);
              resolve({
                id: gameId,
                price: gamePrice,
              });
            }
          }
        )
      });
    });
  };

  getUserGamesIds = () => {
    const {getUserGamesIds} = this.props.contractInstance;
    getUserGamesIds((err, answer) => {
      if (err) {
        console.log('error', err);
      } else {
        const userGamesList = answer.map(item => {
          return Number(item);
        });
        Promise.all(this.getUserGamesPricesByIds(userGamesList))
          .then((response) => {
            this.setState({
              userGamesList: response,
            });
          });
      }
    });
  };

  render() {
    return (
      <Row>
        <Col md={10}>
          {this.renderGamesList()}
        </Col>
        <Col md={2}>
          <Button
            onClick={this.getUserGamesIds}
          >
            <span
              className="glyphicon glyphicon-refresh"
            />
          </Button>
        </Col>
      </Row>
    );
  }
}

export default MyGames;