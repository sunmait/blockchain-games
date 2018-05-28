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
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/">
              <NavItem>
                <Button bsStyle="link">
                  Help
                </Button>
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/">
              <NavItem>
                <Button bsStyle="primary">
                  Host Game
                </Button>
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header;