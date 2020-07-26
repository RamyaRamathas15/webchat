import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { Form } from "react-bootstrap";

class NavbarComponent extends Component {
  render() {
    return (
      <div>
        <Navbar className="navbar_bg" expand="lg">
          <Navbar.Brand as={Link} to="/home">
            LMS
          </Navbar.Brand>

          <Navbar.Collapse>
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/homepage">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/chat">
                Chat
              </Nav.Link>
              <Nav.Link as={Link} to="/files">
                File
              </Nav.Link>
              <Nav.Link as={Link} to="/">
                Online support
              </Nav.Link>

              <Nav.Link as={Link} to="/">
                Contact Us
              </Nav.Link>
            </Nav>
            <Form>
              <NavDropdown title="Profile">
                <NavDropdown.Item as={Link} to="/login">
                  Login
                </NavDropdown.Item>

                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/register">
                  Register
                </NavDropdown.Item>
              </NavDropdown>
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default NavbarComponent;
