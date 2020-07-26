import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { auth } from "../../backend/firebase";
import firebase from "../../backend/firebase";
import Navbar from "../Navbar/Navbar.js";
import "./Homepage.css";

export default class Welcome extends Component {
  render() {
    return (
      <>
        <Navbar />
        <div className="">
          <div className="">
            <h2 className="text">Services</h2>
          </div>
          <div className="servicesDiv">
            <div className="serviceDiv">Multi-factor Authentication</div>
            <div className="serviceDiv">Online Support</div>
            <div className="serviceDiv">Data Processing</div>
            <div className="serviceDiv">Real Time Chat</div>
            <div className="serviceDiv">Machine Learning</div>
          </div>
        </div>
      </>
    );
  }
}
