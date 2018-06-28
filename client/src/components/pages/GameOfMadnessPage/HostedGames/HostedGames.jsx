import React  from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import HostedGamesItemContainer from './HostedGamesItemContainer';

class HostedGames extends React.Component {

  renderGamesList = () => {
    if (this.props.hostedGamesList.length === 0) {
      return (
        <div>
          There are no currently open games
          <br />
          <Button
            onClick={() => {
              this.props.handleCurrentGameChange(null);
              this.props.handleActiveTabChange(3);
            }}
            bsStyle="primary"
          >
            Host game
          </Button>
        </div>
      );
    }
    return this.props.hostedGamesList.map((item, index) => {
      return (
        <HostedGamesItemContainer
          item={item}
          key={index}
        />
      );
    });
  };

  render() {
    return (
      <Col md={12}>
        {this.renderGamesList()}
      </Col>
    );
  }
}

export default HostedGames;
