import React, { Component } from "react";
import "./Profile.css";
import TextField from "@material-ui/core/TextField";
import { Form, Container, Button, Row, Col } from "react-bootstrap";
import gallery from "../ChatBox/gallery.png";
import { firestore, auth } from "../../backend/firebase";
import LoginString from "../../backend/LoginStrings";
import Navbar from "../Navbar/Navbar.js";

export default class Profile extends Component {
  // onSubmit = () => {
  //     alert("Profile updated");
  //     this.props.history.push('/chat');
  // }
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      aboutme: "",
    };
    this.currentUserId = localStorage.getItem(LoginString.ID);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e, label) {
    const nextState = {};
    nextState[label] = e.target.value;
    this.setState(nextState);
  }
  onSubmit() {
    console.log(this.state.name);
    firestore.collection("users").doc(auth.getUid()).update({
      name: this.state.name,
      description: this.state.aboutme,
    });

    this.setState({
      isSubmitted: true,
    });
    this.props.history.push("/chat");
  }
  render() {
    return (
      <div>
        <Navbar />
        <h2 className="heading">Profile</h2>
        <form className="form" onSubmit={this.onSubmit}>
          <div className="form-fields">
            <br />
            <TextField
              className="text-field"
              required
              label="Name"
              onBlur={this.isSubmitDisabled}
              onChange={(e) => this.onChange(e, "name")}
              variant="outlined"
            />
            <br /> <br />
            <TextField
              className="textarea"
              label="About me"
              multiline
              rows={5}
              onChange={(e) => this.onChange(e, "aboutme")}
              variant="outlined"
            />
            <br />
            <input type="submit" value="Update" className="enquire-btn"></input>
          </div>
        </form>
      </div>
    );
  }
}
