import React, {Component} from "react";
import axios from "axios";
import "./FileUpload.css";
import LoginString from '../../backend/LoginStrings';

const FILE_UPLOAD_URL = "https://us-central1-serverlessproject-284221.cloudfunctions.net/uploadFiles";
const SENTENCE_ENCODE_URL = "https://sentenceencoder-ednqegx5tq-uc.a.run.app/encode"
const FILE_INFO_URL = "https://us-central1-clear-gantry-283402.cloudfunctions.net/app/files";
const WORDCLOUD_URL = "https://wordcloud-ednqegx5tq-uc.a.run.app/home";

export default class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFiles: [],
      selectedFile: null
    };
  }

  componentDidMount() {
    const organization = localStorage.getItem(LoginString.Organization);

    axios.get(FILE_INFO_URL, {
      params: {
        organization
      }
    }).then(res => {
      this.setState({
        uploadedFiles: res.data
      });
    });
  }

  onFileChange = event => {
    this.setState({selectedFile: event.target.files[0]});
  };

  onFileUpload = async () => {
    if (this.state.selectedFile != null) {
      try {
        this.isLoading = true
        const formData = new FormData();
        const KEY = "myFile";

        formData.append(
          KEY,
          this.state.selectedFile,
          this.state.selectedFile.name
        );

        const organization = localStorage.getItem(LoginString.Organization);
        axios.post(FILE_UPLOAD_URL + `?organizationId=${organization}`, formData).then(async (res) => {
          const hash = await this.encodeText(res.data.files.myFile.name);
          let fileId = res.data.files.myFile.path.split("/");
          fileId = fileId[fileId.length-1];
          const user = localStorage.getItem(LoginString.Name);

          let fileInfo = {
            organization,
            hash,
            user,
            filename: res.data.files.myFile.name,
            file_id:fileId
          };

          const updatedFile = await axios.post(FILE_INFO_URL, fileInfo);
          this.updateFilesList(updatedFile.data);
        });
      } catch(error) {
        alert(error);
      } finally {
        this.isLoading = false
      }
    } else {
      alert("Please upload a file");
    }
  };

  updateFilesList = (file) => {
    let files = this.state.uploadedFiles;

    console.log(file)
    files.push({
      file_name: file.file_name,
      user: file.user
    });

    this.setState({
      uploadedFiles: files
    });
  };

  encodeText = async (text) => {
    try {
      const response = await axios.get(SENTENCE_ENCODE_URL + `?fileName=${text}`);
      return response.data.value;
    } catch (error) {
      alert(error)
    }
  }

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
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            {this.state.uploadedFiles.map((item, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{item.file_name}</td>
                <td>{item.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
