import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import MyGamesItemContainer from './MyGamesItemContainer';

class MyGames extends React.Component {
  renderGamesList = () => {
    if (this.props.userGamesList.length === 0) {
      return (
        <Row className="text-centralized">
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
      <React.Fragment>
        {this.renderGamesList()}
      </React.Fragment>
    );
  }
}

export default MyGames;