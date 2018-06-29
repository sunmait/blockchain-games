import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPageContainer from '../pages/MainPage/MainPageContainer';
import GuessNumberGameContainer from '../pages/GuessNumberGame/GuessNumberGameContainer';
import GameOfMadnessContainer from '../pages/GameOfMadnessPage/GameOfMadnessContainer';
import web3Initialization from '../../helpers/web3Initialization';
import getEthPrice from '../../helpers/getEthPrice';

class AppComponent extends React.Component {
  componentDidMount() {
    window.addEventListener('load', this.onLoad.bind(this), false);
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.onLoad.bind(this), false);
  }

  onLoad = () => {
    web3Initialization();
    getEthPrice()
      .then(response => {
        this.props.setEthPrice(response);
      });
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={MainPageContainer} />
          <Route exact path="/number-game" component={GuessNumberGameContainer} />
          <Route exact path="/madness-game" component={GameOfMadnessContainer} />
        </Switch>
      </Router>
    );
  };
}

export default AppComponent;