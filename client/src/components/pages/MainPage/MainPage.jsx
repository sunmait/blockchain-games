import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import './MainPage.css';
import {LinkContainer} from 'react-router-bootstrap';
import madnessGameImg from '../../../assets/images/madness-game.jpg';
import numberGameImg from '../../../assets/images/number-game.png';
import '../../../assets/main.css';

class MainPage extends React.Component {
  render() {
    if (!this.props.localWeb3 || !this.props.currentAccount) {
      return (
        <div>
          Metamask is loading.
        </div>
      );
    }
    return (
      <div className="main-page-container">
        <Col mdOffset={1} md={5} className="main-page-item-container">
          <LinkContainer exact to="/number-game">
            <Col className="main-page-item">
              <img className="img-item" src={numberGameImg} alt="no-img" />
            </Col>
          </LinkContainer>
        </Col>
        <Col md={5} className="main-page-item-container">
          <LinkContainer exact to="/madness-game">
            <Col className="main-page-item">
              <img className="img-item" src={madnessGameImg} alt="no-img" />
            </Col>
          </LinkContainer>
        </Col>
      </div>
    );
  }
}

export default MainPage;
