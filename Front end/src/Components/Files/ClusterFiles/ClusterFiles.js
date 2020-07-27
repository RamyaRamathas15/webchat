import React, {Component} from "react";
import LoginString from "../../../backend/LoginStrings";
import axios from "axios";

const CLUSTERFILES_URL = "https://us-central1-clear-gantry-283402.cloudfunctions.net/app/clusterfiles";

export default class ClusterFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clusteredFiles: [],
      isLoading: false
    };
  }

  componentDidMount() {
    const organization = localStorage.getItem(LoginString.Organization);
    this.setState({
      isLoading: true
    });

    axios.get(CLUSTERFILES_URL, {
      params: {
        organization
      }
    }).then(res => {
      this.parseResponse(res);
    });
  }

  parseResponse(res){
    console.log(res.data);
    this.setState({
      clusteredFiles: res.data,
      isLoading: false
    });

  }

  render() {
    return (
      <div class="accordion" id="accordionExample">
      <table className="table  text-left">
        <thead className="thead-dark">
          <tr>
            <th>File Name</th>
            <th>File Group</th>
          </tr>
        </thead>
        <tbody style={this.state.isLoading ? {display: "none"} : {}}>
          {this.state.clusteredFiles.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.group}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  }
}
