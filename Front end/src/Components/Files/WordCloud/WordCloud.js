import React, {Component} from "react";
import LoginString from "../../../backend/LoginStrings";
import axios from "axios";
import "./WordCloud.css";

const WORDCLOUD_URL = "https://wordcloud-ednqegx5tq-uc.a.run.app/home";

export default class WordCloud extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordcloud: null,
      isLoading: false
    };
  }

  componentDidMount() {
    this.renderWordCloud();
  }

  renderWordCloud() {
    const organization = localStorage.getItem(LoginString.Organization);

    this.setState({
      isLoading: true
    });
    axios.get(`${WORDCLOUD_URL}?organization=${organization}`).then(res => {
      console.log(res.data);
      this.setState({
        wordcloud: {
          __html: res.data
        }
      });
      this.setState({
        isLoading: false
      });
    });
  }

  render() {
    return (
      <div className="wordcloud-wrapper mt-4 ">
        <div
          className="img-container mt-4 text-center"
          style={!this.state.wordcloud ? {display: "none"} : {}}
        >
          <div className="row mb-4">
            <div className="input-group col-sm-2 offset-sm-8">
              <button
                type="button"
                class="btn btn-warning"
                onClick={() => {
                  this.renderWordCloud();
                }}
              >
                Refresh
              </button>
            </div>
          </div>
          <div
            dangerouslySetInnerHTML={this.state.wordcloud}
            style={this.state.isLoading ? {display: "none"} : {}}
          />
          <div
            class="spinner-border text-primary"
            role="status"
            style={!this.state.isLoading ? {display: "none"} : {}}
          >
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
}
