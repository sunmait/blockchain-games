import React from 'react';
import Nav from 'react-bootstrap/lib/Nav.js';
import Navbar from 'react-bootstrap/lib/Navbar.js';
import Button from 'react-bootstrap/lib/Button';
import {LinkContainer} from 'react-router-bootstrap';
import NavItem from 'react-bootstrap/lib/NavItem';
import './Header.css';

class Header extends React.Component {
  render() {
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to="/">
              <NavItem>
                <Button bsStyle="link">
                  Guess Number Game
                </Button>
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/madness">
              <NavItem>
                <Button bsStyle="link">
                  Game Of Madness
                </Button>
              </NavItem>
            </LinkContainer>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
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