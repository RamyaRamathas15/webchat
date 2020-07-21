import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { AuthProvider } from "./Context/auth";
import PrivateRoute from "./Routes/PrivateRoute";
import SecondFactor from "./Components/Register/SecondFactor";
import LoginSecondFactor from "./Components/Login/LoginSecondFactor";
import Chat from './Components/Chat/Chat';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/home" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/secondfactor" component={SecondFactor} />
          <Route exact path="/chat" component={Chat} />
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
