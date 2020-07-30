import React, { Component } from "react";
import "./ChatBox.css";
import { Card } from "react-bootstrap";
import { firestore, auth, myStorage } from "../../backend/firebase";
import LoginString from "../../backend/LoginStrings";
import Navbar from "../Navbar/Navbar.js";
import moment from "moment";
import gallery from "./gallery.png";
import send from "./save.png";

export default class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isShowSticker: false,
      inputValue: "",
    };
    this.currentUserName = localStorage.getItem(LoginString.Name);
    this.currentUserId = localStorage.getItem(LoginString.ID);
    this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL);
    this.currentPeerUser = this.props.currentPeerUser;
    this.groupChatId = null;
    this.listMessage = [];
    this.currentPeerUserMessages = [];
    this.removeListener = null;
    this.currentPhotoFile = null;

    firestore
      .collection("users")
      .doc(this.currentPeerUser.documentKey)
      .get()
      .then((docRef) => {
        this.currentPeerUserMessages = docRef.data().messages;
      });
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  componentWillReceiveProps(newProps) {
    if (newProps.currentPeerUser) {
      this.currentPeerUser = newProps.currentPeerUser;
      this.getListHistory();
    }
  }
  componentWillUnmount() {
    if (this.removeListener) {
      this.removeListener();
    }
  }
  componentDidMount() {
    this.getListHistory();
  }
  getListHistory = () => {
    if (this.removeListener) {
      this.removeListener();
    }
    this.listMessage.length = 0;
    this.setState({ isLoading: true });
    if (
      this.hashString(this.currentUserId) <=
      this.hashString(this.currentPeerUser.id)
    ) {
      this.groupChatId = `${this.currentUserId}-${this.currentPeerUser.id}`;
    } else {
      this.groupChatId = `${this.currentPeerUser.id}-${this.currentUserId}`;
    }
    this.removeListener = firestore
      .collection("Messages")
      .doc(this.groupChatId)
      .collection(this.groupChatId)
      .onSnapshot(
        (Snapshot) => {
          Snapshot.docChanges().forEach((change) => {
            if (change.type === LoginString.DOC) {
              this.listMessage.push(change.doc.data());
            }
          });
          this.setState({ isLoading: false });
        },
        (err) => {
          this.props.showToast(0, err.toString());
        }
      );
  };
  onSendMessage = (content, type) => {
    if (this.state.isShowSticker && type === 2) {
      this.setState({ isShowSticker: false });
    }
    if (content.trim() === "") {
      return;
    }
    const timestamp = moment().valueOf().toString();

    const itemMessage = {
      idFrom: this.currentUserId,
      idTo: this.currentPeerUser.id,
      timestamp: timestamp,
      content: content.trim(),
      type: type,
    };
    firestore
      .collection("Messages")
      .doc(this.groupChatId)
      .collection(this.groupChatId)
      .doc(timestamp)
      .set(itemMessage)
      .then(() => {
        this.setState({ inputValue: "" });
      });
  };
  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({});
    }
  };
  onKeyPress = (event) => {
    if (event.key === "Enter") {
      this.onSendMessage(this.state.inputValue, 0);
    }
  };
  

  render() {
    return (
      <div>
        <Card className="chatbox">
          <div className="chatBoard">
            <img
              className="profilepic"
              src={this.currentPeerUser.URL}
              alt=""
            />
            <span className="textHeaderChatBoard">
              <p style={{ fontSize: "20px" }}>{this.currentPeerUser.name}</p>
            </span>
          </div>
          <div className="viewListContentChat">
            {this.renderListMessage()}
            <div
              style={{ float: "left", clear: "both" }}
              ref={(l) => {
                this.messagesEnd = l;
              }}
            />
          </div>
          <div className="viewBottom">
            <img
              className="gallery"
              src={gallery}
              onClick={() => this.refInput.click()}
            />
            <input
              ref={(el) => {
                this.refInput = el;
              }}
              accept="image/*"
              className="viewInputGallery"
              type="file"
              onChange={this.onChoosePhoto}
            />
            <input
              className="viewInput"
              placeholder="Type a message"
              value={this.state.inputValue}
              onChange={(event) => {
                this.setState({ inputValue: event.target.value });
              }}
              onKeyPress={this.onKeyPress}
            />
            <img
              className="icSend"
              src={send}
              onClick={() => {
                this.onSendMessage(this.state.inputValue, 0);
              }}
            />
          </div>
        </Card>
      </div>
    );
  }

  hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
      hash = hash & hash;
    }
    return hash;
  };
  renderListMessage = () => {
    if (this.listMessage.length > 0) {
      let viewListMessage = [];
      this.listMessage.forEach((item, index) => {
        if (item.idFrom === this.currentUserId) {
          if (item.type === 0) {
            viewListMessage.push(
              <div className="Right" key={item.timestamp}>
                <span className="textContentItem">{item.content}</span>
              </div>
            );
          } else if (item.type == 1) {
            viewListMessage.push(
              <div className="Left" key={item.timestamp}>
                <img className="imhg" src={item.content} />
              </div>
            );
          }
        } else if (item.type === 0) {
          viewListMessage.push(
            <div className="Left" key={item.timestamp}>
              <span className="textContentItem">{item.content}</span>
            </div>
          );
        }
      });
      return viewListMessage;
    }
  };
}
