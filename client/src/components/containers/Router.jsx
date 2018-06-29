import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPageContainer from '../pages/MainPage/MainPageContainer';
import GameOfMadnessPageContainer from '../pages/GameOfMadnessPage/GameOfMadnessContainer';
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
          <Route exact path="/madness" component={GameOfMadnessPageContainer} />
        </Switch>
      </Router>
    );
  };
}

export default AppComponent;