import React, { Component } from "react";
import { firestore } from "../../backend/firebase";
import LoginString from "../../backend/LoginStrings";
import "./Chat.css";
import ChatBox from "../ChatBox/ChatBox";
import Welcome from "../Welcome/Welcome";
import gallery from "../ChatBox/gallery.png";
import Navbar from "../Navbar/Navbar.js";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isOpenDialogConfirmLogout: false,
      currentPeerUser: null,
      notification: [],
      displayedContacts: [],
    };
    this.userName = localStorage.getItem(LoginString.Name);
    this.userID = localStorage.getItem(LoginString.ID);
    this.userPhoto = localStorage.getItem(LoginString.PhotoURL);

    this.currentUserMessages = [];
    this.searchUsers = [];
    this.notificationMessagesErase = [];
    this.onProfileClick = this.onProfileClick.bind(this);
    this.getListUser = this.getListUser.bind(this);
    this.renderListUser = this.renderListUser.bind(this);
    this.getClassnameforUserandNotification = this.getClassnameforUserandNotification.bind(
      this
    );
    this.updaterenderList = this.updaterenderList.bind(this);
  }
  onProfileClick = () => {
    this.props.history.push("/profile");
  };
  componentDidMount() {
    firestore
      .collection("users")
      .doc(this.userID)
      .get()
      .then((doc) => {
        doc.data().messages.map((item) => {
          this.currentUserMessages.push({
            notificationId: item.notificationId,
            number: item.number,
          });
        });
        this.setState({
          notification: this.currentUserMessages,
        });
      });
    this.getListUser();
  }
  getListUser = async () => {
    const result = await firestore.collection("users").get();
    if (result.docs.length > 0) {
      let listUsers = [];
      listUsers = [...result.docs];
      listUsers.forEach((item, index) => {
        this.searchUsers.push({
          key: index,
          documentKey: item.id,
          id: item.data().id,
          name: item.data().name,
          messages: item.data().messages,
          URL: item.data().URL,
        });
      });
      this.setState({
        isLoading: false,
      });
    }
    this.renderListUser();
  };
  getClassnameforUserandNotification = (itemId) => {
    let number = 0;
    let className = "";
    let check = false;
    if (
      this.state.currentPeerUser &&
      this.state.currentPeerUser.id === itemId
    ) {
      className = "wrapitem";
    } else {
      this.state.notification.forEach((item) => {
        if (item.notificationId?.length > 0) {
          if (item.notificationId === itemId) {
            check = true;
            number = item.number;
          }
        }
      });
      if (check === true) {
        className = "viewWrapItemNotification";
      } else {
        className = "listitem";
      }
    }
    return className;
  };
  updaterenderList = () => {
    firestore
      .collection("users")
      .doc(this.userID)
      .update({ messages: this.notificationMessagesErase });
    this.setState({
      notification: this.notificationMessagesErase,
    });
  };
  renderListUser = () => {
    if (this.searchUsers.length > 0) {
      let viewListUser = [];
      let classname = "";
      this.searchUsers.map((item) => {
        if (item.id != this.userID) {
          classname = this.getClassnameforUserandNotification(item.id);
          viewListUser.push(
            <button
              id={item.key}
              className={classname}
              onClick={() => {
                this.setState({ currentPeerUser: item });
            
              }}
            >
              <img className="profilepic" src={item.URL} alt="" />
              <div className="word-gap">
                <span className="textItem">{`${item.name}`}</span>
              </div>
              {classname === "viewWrapItemNotification" ? (
                <div className="notification">
                  <p id={item.key} className="newmessages">
                    New message
                  </p>
                </div>
              ) : null}
            </button>
          );
        }
      });
      this.setState({
        displayedContacts: viewListUser,
      });
    } else {
      console.log("no user present");
    }
  };
  searchHandler = (event) => {
    let searchQuery = event.target.value.toLowerCase(),
      displayedContacts = this.searchUsers.filter((l) => {
        let SearchValue = l.name.toLowerCase();
        return SearchValue.indexOf(searchQuery) !== -1;
      });
    this.displayedContacts = displayedContacts;
    this.displayedSearchedContacts();
  };
  displayedSearchedContacts = () => {
    if (this.searchUsers.length > 0) {
      let viewListUser = [];
      let classname = "";
      this.displayedContacts.map((item) => {
        if (item.id != this.userID) {
          classname = this.getClassnameforUserandNotification(item.id);
          viewListUser.push(
            <button
              id={item.key}
              className={classname}
              onClick={() => {
                this.setState({ currentPeerUser: item });
              }}
            >
              <img className="profilepic" src={item.URL} alt="" />
              <div className="viewWrapContentItem">
                <span className="textItem">{`${item.name}`}</span>
              </div>
              {classname === "viewWrapItemNotification" ? (
                <div className="notification">
                  <p id={item.key} className="newmessages">
                    New message
                  </p>
                </div>
              ) : null}
            </button>
          );
        }
      });
      this.setState({
        displayedContacts: viewListUser,
      });
    } else {
      console.log("no user present");
    }
  };
  render() {
    return (
      <div className="main">
        <Navbar />
        <div className="main-body">
          <div className="listofusers">
            <div className="profileviewleftside">
              
              <img
                className="ProfilePicture"
                alt=""
                src={this.userPhoto}
                onClick={this.onProfileClick}
              />
              <p className="text1">{this.userName}</p>
            
            </div>
            <div className="searchbar">
                <input
                  class="input-field"
                  type="text"
                  onChange={this.searchHandler}
                  placeholder="search"
                />
            </div>
            {this.state.displayedContacts}
          </div>
          <div className="viewboard">
            {this.state.currentPeerUser ? (
              <ChatBox
                currentPeerUser={this.state.currentPeerUser}
                showToast={this.props.showToast}
              />
            ) : (
              <Welcome
              userName={this.userName}
              userPhoto={this.userPhoto}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
