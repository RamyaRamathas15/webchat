import React, { Component } from 'react';
import './Profile.css';
import TextField from '@material-ui/core/TextField';
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import gallery from '../ChatBox/gallery.png';
import firebase from '../../backend/firebase';
import LoginString from '../../backend/LoginStrings';

export default class Profile extends Component{
    // onSubmit = () => {
    //     alert("Profile updated");
    //     this.props.history.push('/chat');
    // }
    constructor(props){
        super(props)
        this.state={
            studentName:""
        }
        this.currentUserId = localStorage.getItem(LoginString.ID);
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    onChange(){
        var nameValue = this.refs.name.value
        this.setState({studentName: nameValue}) 
    }
    onSubmit () {
        
        firebase.database().ref('users/'+this.state.currentUserId).set({
          name: this.state.studentName
        })
        console.log("updated")
        console.log(this.studentName)
        this.setState({
          isSubmitted: true
         
        })
        this.props.history.push('/chat');
      }
    render(){
        return(
            <div>
                <h2 className="heading">Profile</h2>
                 <form className="form" onSubmit={this.onSubmit} >
                        <div className="form-fields">
                   <img className="Profile-pic" src={gallery}/>
                   
                                   <br/>
                                
                                    <TextField
                                        className="text-field"
                                        required
                                        label="Name"
                                        ref="name"
                                        onBlur={this.isSubmitDisabled} 
                                        onChange={this.handleChange}
                                        variant="outlined"
                                    />

                             <br/>
                            
                             
                                    <TextField
                                        className="textarea"
                                        label="About me"
                                        multiline
                                        rows={5}
                                        onChange={this.handleChange}
                                        variant="outlined"
                                    />
                            
                           <br/>
                         
                                <input type="submit" value="Update" className="enquire-btn"></input>
                               
                                  
                              

                        </div>
                    </form>
            </div>
        )
    }
}