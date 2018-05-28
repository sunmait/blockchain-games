import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from '../pages/MainPage/MainPage';
import Header from './Header/Header';

class AppComponent extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Switch>
            <Route exact path="/" component={MainPage} />
          </Switch>
        </div>
      </Router>
    );
  };
}

export default AppComponent;