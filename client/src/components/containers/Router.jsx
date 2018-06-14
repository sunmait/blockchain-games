import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPageContainer from '../pages/MainPage/MainPageContainer';
import GameOfMadnessPageContainer from '../pages/GameOfMadnessPage/GameOfMadnessContainer';

class AppComponent extends React.Component {
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