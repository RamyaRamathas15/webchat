import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Navbar from '../Navbar/Navbar.js';

const emailPattern = RegExp(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,})+$/);
const passwordPattern = RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}/);

const Register = ({ history }) => {
  const [nameField, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizationError, setOrganizationError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setError("");
    const { name, value } = e.target;
    if (name === "name") {
      setName(() => {
        value ? setNameError("") : setNameError("Value is Required");
        return value;
      });
    } else if (name === "email") {
      setEmail(() => {
        value ? setEmailError("") : setEmailError("Value is Required");
        emailPattern.test(value)
          ? setEmailError("")
          : setEmailError("Please enter valid email address");
        return value;
      });
    } else if (name === "password") {
      setPassword(value);
      value ? setPasswordError("") : setPasswordError("Value is Required");
      passwordPattern.test(value)
        ? setPasswordError("")
        : setPasswordError("Weak Password");

      confirmPassword !== password
        ? setConfirmPasswordError("Password doesn't match")
        : setConfirmPasswordError("");
    } else if (name === "confirmpassword") {
      setConfirmPassword(value);
      value !== password
        ? setConfirmPasswordError("Password doesn't match")
        : setConfirmPasswordError("");
    } else if (name === "organization") {
      setOrganization(value);
      value
        ? setOrganizationError("")
        : setOrganizationError("Value is Required");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!(nameField && email && password && confirmPassword && organization)) {
      setError("Please fill all mandatory fields");
      setLoading(false);
      return false;
    }
    if (
      nameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      organizationError
    ) {
      setError("Please check the error");
      setLoading(false);
      return false;
    }

    const userResponse = await axios.get(
      `https://us-central1-clear-gantry-283402.cloudfunctions.net/app/findUser/${email}`
    );

    if (userResponse.data.uid === undefined) {
      const createResponse = await axios.post(
        `https://us-central1-clear-gantry-283402.cloudfunctions.net/app/createUser`,
        {
          email,
          password,
        }
      );

      const createResponsefire = await axios.post(
        `https://us-central1-clear-gantry-283402.cloudfunctions.net/app/postUserDetails`,
        {
          id: createResponse.data.uid,
          email: email,
          password: password,
          name: nameField,
          organization: organization,
        }
      );

      if (
        createResponse.data.uid !== undefined &&
        createResponsefire.data !== ""
      ) {
        setLoading(false);
        history.push({
          pathname: "/secondfactor",
          state: {
            uid: createResponse.data.uid,
            name: nameField,
            email,
            password,
            organization,
          },
        });
      } else {
        await axios.delete(
          `https://us-central1-clear-gantry-283402.cloudfunctions.net/app/deleteUser/${createResponse.data.uid}`
        );

        await axios.delete(
          `https://us-central1-clear-gantry-283402.cloudfunctions.net/app/deleteUserDetails/${createResponse.data.uid}`
        );
        setLoading(false);
        setError("error");
        return false;
      }
    } else {
      setLoading(false);
      setError("Email already present");
      return false;
    }

    setLoading(false);
  };

  return (
    <>
    <Navbar/>
      <Container>
        <br></br>
        <Row>
          <Col sm={6}>
            <h1>REGISTER</h1>
            <Form>
              <Form.Group controlId="formBasicName">
                <Form.Label>Name*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  value={nameField}
                  onChange={onChangeHandler}
                  onBlur={onChangeHandler}
                />
                <div>{nameError}</div>
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
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

              <Form.Group controlId="formBasicPassword">
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
              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password*</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmpassword"
                  value={confirmPassword}
                  onChange={onChangeHandler}
                  onBlur={onChangeHandler}
                />
                <div>{confirmPasswordError}</div>
              </Form.Group>
              <Form.Group controlId="formBasicOrganization">
                <Form.Label>Organization*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Organization"
                  name="organization"
                  value={organization}
                  onChange={onChangeHandler}
                  onBlur={onChangeHandler}
                />
                <div>{organizationError}</div>
              </Form.Group>
              <h4>{error}</h4>
              <Button
                variant="primary"
                disabled={loading}
                onClick={onSubmitHandler}
              >
                {loading && (
                  <i
                    className="fa fa-refresh fa-spin"
                    style={{ marginRight: "5px" }}
                  ></i>
                )}
                Submit
              </Button>

              <NavLink to="/login" className="link">
                <p>Already have an account? Login here.</p>
              </NavLink>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withRouter(Register);
