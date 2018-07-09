import React  from 'react';
import Button from 'react-bootstrap/lib/Button';
import HostedGamesItemContainer from './HostedGamesItemContainer';

class HostedGames extends React.Component {

  renderGamesList = () => {
    if (this.props.hostedGamesList.length === 0) {
      return (
        <div className="text-centralized">
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
    return this.props.hostedGamesList.slice().reverse().map((item, index) => {
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
      <React.Fragment>
        {this.renderGamesList()}
      </React.Fragment>
    );
  }
}

export default HostedGames;
