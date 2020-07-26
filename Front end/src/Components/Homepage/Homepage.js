import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import { auth } from "../../backend/firebase";
import firebase from "../../backend/firebase";
import Navbar from '../Navbar/Navbar.js';
import './Homepage.css';

export default class Welcome extends Component{
    render(){
        return(
            <div>
                <Navbar/>
                <h2 className="text">Home</h2>
            </div>
        )
    }
}