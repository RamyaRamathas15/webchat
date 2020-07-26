import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter, Redirect } from "react-router";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../Context/auth";
import axios from "axios";
import Navbar from "../Navbar/Navbar.js";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setError("");
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      value ? setEmailError("") : setEmailError("Value is Required");
    } else if (name === "password") {
      setPassword(value);
      value ? setPasswordError("") : setPasswordError("Value is Required");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!(email && password)) {
      setLoading(false);
      setError("Please fill all mandatory fields");
      return false;
    }
    if (emailError || passwordError) {
      setLoading(false);
      setError("Please check the error");
      return false;
    }

    const userResponse = await axios.get(
      `https://us-central1-clear-gantry-283402.cloudfunctions.net/app/findUser/${email}`
    );

    if (userResponse.data.uid !== undefined) {
      const getUserResponse = await axios.get(
        `https://us-central1-clear-gantry-283402.cloudfunctions.net/app/getUserDetails/${userResponse.data.uid}/${password}`
      );

      if (getUserResponse.data) {
        if (!getUserResponse.data) {
          setLoading(false);
          setError("Please enter correct password");
          return false;
        } else {
          const userid = userResponse.data.uid;
          const response = await axios.get(
            `https://dhrzvmfzw6.execute-api.us-east-1.amazonaws.com/dev/question?uid=${userid}`
          );
          setLoading(false);
          history.push({
            pathname: "/loginsecondfactor",
            state: {
              uid: userResponse.data.uid,
              email,
              password,
              question: response.data.body,
              response: getUserResponse.data,
            },
          });
        }
      }
    } else {
      setLoading(false);
      setError("Email not registered");
      return false;
    }
  };

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/home" />;
  }

  return (
    <>
      <Navbar />
      <Container>
        <br></br>
        <Row>
          <Col sm={6}>
            <h1>Login</h1>
            <Form>
              <Form.Group controlId="formBasicLginEmail">
                <Form.Label>Email address*</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={email}
                  onChange={onChangeHandler}
                  onBlur={onChangeHandler}
                />
                <div>{emailError}</div>
              </Form.Group>

              <Form.Group controlId="formBasicLoginPassword">
                <Form.Label>Password*</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={onChangeHandler}
                  onBlur={onChangeHandler}
                />
                <div>{passwordError}</div>
              </Form.Group>
              <h4>{error}</h4>
              <Button
                variant="primary"
                onClick={onSubmitHandler}
                disabled={loading}
              >
                {loading && (
                  <i
                    className="fa fa-refresh fa-spin"
                    style={{ marginRight: "5px" }}
                  ></i>
                )}
                Submit
              </Button>
              <NavLink to="/register" className="link">
                <p>Doesn't have an account? Sign Up here.</p>
              </NavLink>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withRouter(Login);
