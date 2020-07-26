import React, {Component} from "react";
import axios from "axios";
import "./FileUpload.css";

const FILE_SERIVCE_URL = "https://us-central1-serverlessproject-284221.cloudfunctions.net/uploadFiles";

export default class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFiles: [],
      selectedFile: null
    };
  }

  componentDidMount() {
    axios.get(FILE_SERIVCE_URL).then(res => {
      this.setState({
        uploadedFiles: res.data
      });
      console.log(this.state.uploadedFiles);
    });
  }

  onFileChange = event => {
    this.setState({selectedFile: event.target.files[0]});
  };

  onFileUpload = async () => {
    if (this.state.selectedFile != null) {
      const formData = new FormData();
      const KEY = "myFile";

      formData.append(
        KEY,
        this.state.selectedFile,
        this.state.selectedFile.name
      );

      axios.post(FILE_SERIVCE_URL + "?organizationId=1223242424242", formData).then(res => {
        let files = this.state.uploadedFiles;

        files.push({
          filename: res.data.files.myFile.name,
          createdTime: res.data.files.myFile.mtime
        });
        this.setState({
          uploadedFiles: files
        });
      });
    } else {
      alert("Please upload a file");
    }
  };

  render() {
    return (
      <div className="container pt-4">
        <h3 className="text-center mt-4">Cloud Storage</h3>
        <h4 className="text-center text-danger">By NuNu... 🚗🔥</h4>
        <div className="row mt-4">
          <div className="input-group col-sm-4 offset-sm-8">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                onChange={this.onFileChange}
              />
              <label className="custom-file-label">Choose file</label>
            </div>
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                onClick={this.onFileUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>

        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>File Name</th>
              <th>Uploaded Time</th>
            </tr>
          </thead>
          <tbody>
            {this.state.uploadedFiles.map((item, index) => (
              <tr>
                <td>{index}</td>
                <td>{item.filename}</td>
                <td>{item.createdTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
