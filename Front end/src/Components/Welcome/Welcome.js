import React, { Component } from 'react';
import './Welcome.css';

export default class Welcome extends Component{
    render(){
        return(
            <div>
                <span>{`Welcome, ${this.props.currentUserName} `}</span>
                <span>Let's Connect</span>
            </div>
        )
    }
}