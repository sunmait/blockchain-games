import React from 'react';
import Nav from 'react-bootstrap/lib/Nav.js';
import Navbar from 'react-bootstrap/lib/Navbar.js';
import Button from 'react-bootstrap/lib/Button';
import {LinkContainer} from 'react-router-bootstrap';
import NavItem from 'react-bootstrap/lib/NavItem';
import './Header.css';
import getGravatarUrl from '../../../helpers/getGravatarUrl';

class Header extends React.Component {
  render() {
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer exact to="/number-game">
              <Button bsStyle="link">
                Guess Number Game
              </Button>
            </LinkContainer> /
            <LinkContainer exact to="/madness-game">
              <Button bsStyle="link">
                Game Of Madness
              </Button>
            </LinkContainer>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem className="user-avatar-container">
              <img
                src={getGravatarUrl(this.props.gravatarAddress)}
                alt="no img"
              />
            </NavItem>
            <NavItem>
              <Button
                bsStyle="link"
              >
                Help
              </Button>
            </NavItem>
            <NavItem>
              <Button
                bsStyle="primary"
                onClick={this.props.onHostGameClick}
              >
                Host Game
              </Button>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header;