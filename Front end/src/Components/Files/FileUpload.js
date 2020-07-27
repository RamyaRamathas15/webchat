import React, {Component} from "react";
import axios from "axios";
import "./FileUpload.css";
import LoginString from '../../backend/LoginStrings';
import WordCloud from './WordCloud/WordCloud';
import ClusterFiles from './ClusterFiles/ClusterFiles';
import Navbar from "../Navbar/Navbar";

const FILE_UPLOAD_URL = "https://us-central1-serverlessproject-284221.cloudfunctions.net/uploadFiles";
const SENTENCE_ENCODE_URL = "https://sentenceencoder-ednqegx5tq-uc.a.run.app/encode"
const FILE_INFO_URL = "https://us-central1-clear-gantry-283402.cloudfunctions.net/app/files";

export default class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFiles: [],
      selectedFile: null,
      isLoading: false,
      isFileUploading: false
    };
  }

  componentDidMount() {
    const organization = localStorage.getItem(LoginString.Organization);
    this.setState({
      isLoading: true
    });

    axios.get(FILE_INFO_URL, {
      params: {
        organization
      }
    }).then(res => {
      this.setState({
        uploadedFiles: res.data,
        isLoading: false
      });
    });
  }

  onFileChange = event => {
    this.setState({selectedFile: event.target.files[0]});
  };

  onFileUpload = async () => {
    if (this.state.selectedFile != null) {
      try {
        this.setState({
          isFileUploading: true
        });
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
        this.setState({
          isFileUploading: false
        });
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
      <>
      <Navbar/>
      <div className="container pt-4">
        <h3 className="text-center mt-4">Cloud Storage</h3>
        <nav className="mt-4">
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="nav-file-tab" data-toggle="tab" href="#nav-file" role="tab" aria-controls="nav-file" aria-selected="true">Files List</a>
            <a class="nav-item nav-link" id="nav-word-cloud-tab" data-toggle="tab" href="#nav-word-cloud" role="tab" aria-controls="nav-word-cloud" aria-selected="false">Word Cloud</a>
            <a class="nav-item nav-link" id="nav-cluster-files-tab" data-toggle="tab" href="#nav-cluster-files" role="tab" aria-controls="nav-cluster-files" aria-selected="false">Cluster Files</a>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div class="tab-pane fade show active text-center" id="nav-file" role="tabpanel" aria-labelledby="nav-file-tab">
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
                <div></div>
              </div>
            </div>

            <table className="table  text-left">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody style={this.state.isLoading ? {display: "none"} : {}}>
                {this.state.uploadedFiles.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.file_name}</td>
                    <td>{item.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              class="spinner-border text-primary"
              role="status"
              style={!this.state.isLoading ? {display: "none"} : {}}
            >
            <span class="sr-only">Loading...</span>
          </div>
          </div>
          <div class="tab-pane fade" id="nav-word-cloud" role="tabpanel" aria-labelledby="nav-word-cloud-tab">
            <WordCloud></WordCloud>
          </div>
          <div class="tab-pane fade" id="nav-cluster-files" role="tabpanel" aria-labelledby="nav-cluster-files-tab">
            <ClusterFiles></ClusterFiles>
          </div>
        </div>
        </div>
      </>
    );
  }
}
