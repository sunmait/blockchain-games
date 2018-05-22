import React, { Component } from 'react';
import smthg from '../../../assets/images/smthg.png';
import './MainPage.css';

class MainPage extends Component {
  render() {
    return (
      <div className="main-page">
        <header className="main-page-header">
          <h1 className="main-page-title">One day here is gonna be smthg.</h1>
        </header>
        <div className="main-page-body">
          <img className="main-page-body-picture" src={smthg} alt="smthg" />
        </div>
      </div>
    );
  }
}

export default MainPage;
