import React, { Component } from "react";
import "./ChatBox.css";
import { Card } from "react-bootstrap";
// import ReactLoading from 'react-loading';
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
  openListSticker = () => {
    this.setState({ isShowSticker: !this.state.isShowSticker });
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
  onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ isLoading: true });
      this.currentPhotoFile = event.target.files[0];
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf(LoginString.PREFIX_IMAGE) === 0) {
        this.uploadPhoto();
      } else {
        this.setState({ isLoading: false });
        this.props.showToast(0, "This file is not an image");
      }
    } else {
      this.setState({ isLoading: false });
    }
  };
  uploadPhoto = () => {
    if (this.currentPhotoFile) {
      const timestamp = moment().valueOf().toString();

      const uploadTask = myStorage
        .ref()
        .child(timestamp)
        .put(this.currentPhotoFile);

      uploadTask.on(
        LoginString.UPLOAD_CHANGED,
        null,
        (err) => {
          this.setState({ isLoading: false });
          this.props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.setState({ isLoading: false });
            this.onSendMessage(downloadURL, 1);
          });
        }
      );
    } else {
      this.setState({ isLoading: false });
      this.props.showToast(0, "File is null");
    }
  };

  render() {
    return (
      <div>
        <Card className="chatbox">
          <div className="headerChatBoard">
            <img
              className="viewAvatarItem"
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
              className="icOpenGallery"
              src={gallery}
              alt="icon open gallery"
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
          {/* {this.state.isLoading ? (
                        <div className="viewLoading">
                            <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                            />
                        </div>
                    ):null} */}
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
              <div className="viewItemRight" key={item.timestamp}>
                <span className="textContentItem">{item.content}</span>
              </div>
            );
          } else if (item.type == 1) {
            viewListMessage.push(
              <div className="viewWrapItemLeft" key={item.timestamp}>
                <img className="imhg" src={item.content} />
              </div>
            );
          }
        } else if (item.type === 0) {
          viewListMessage.push(
            <div className="viewWrapItemLeft" key={item.timestamp}>
              <span className="textContentItem">{item.content}</span>
            </div>
          );
        }
      });
      return viewListMessage;
    }
  };
}
