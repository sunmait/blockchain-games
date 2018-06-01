import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPageContainer from '../pages/MainPage/MainPageContainer';
import HeaderContainer from './Header/HeaderContainer';

class AppComponent extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <HeaderContainer />
          <Switch>
            <Route exact path="/" component={MainPageContainer} />
          </Switch>
        </div>
      </Router>
    );
  };
}

export default AppComponent;