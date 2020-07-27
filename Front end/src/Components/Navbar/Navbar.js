import React, { useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { Form } from "react-bootstrap";
import { AuthContext } from "../../Context/auth";
import { auth } from "../../backend/firebase";
import { withRouter } from "react-router";
import { firestore } from "../../backend/firebase";

const NavbarComponent = (props) => {
  const { currentUser } = useContext(AuthContext);

  const logout = () => {
    auth.signOut();
    const uid = localStorage.getItem("uid");
    firestore.collection("users").doc(uid).set(
      {
        online: false,
      },
      { merge: true }
    );
    props.history.push("/");
    localStorage.clear();
  };

  return (
    <div>
      <Navbar className="navbar_bg" expand="lg">
        <Navbar.Brand href="/">LMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {currentUser ? (
              <>
                <Nav.Link href="/files">File</Nav.Link>
                <Nav.Link href="/chat">Chat</Nav.Link>
                <Nav.Link href="/onlinesupport">Online support</Nav.Link>
              </>
            ) : (
                <></>
              )}
          </Nav>

          <Form>
            <NavDropdown title="Profile">
              {currentUser ? (
                <>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </>
              ) : (
                  <>
                    <NavDropdown.Item as={Link} to="/login">
                      Login
                  </NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/register">
                      Register
                  </NavDropdown.Item>
                  </>
                )}
            </NavDropdown>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default withRouter(NavbarComponent);
