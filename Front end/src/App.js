import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { AuthProvider } from "./Context/auth";
import PrivateRoute from "./Routes/PrivateRoute";
import LoginSecondFactor from "./Components/Login/LoginSecondFactor";
import Chat from "./Components/Chat/Chat";
import Profile from "./Components/Profile/Profile";
import FileUpload from "./Components/Files/FileUpload";
import Homepage from "./Components/Homepage/Homepage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          {/* <Route exact path="/secondfactor" component={SecondFactor} /> */}
          <PrivateRoute exact path="/chat" component={Chat} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/files" component={FileUpload} />
          {/* <Route path="/chat" render={props => <Chat showToast={this.showToast}{...props}/>}/>  */}
          <Route
            exact
            path="/loginsecondfactor"
            component={LoginSecondFactor}
          />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
