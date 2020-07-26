import React from "react";
import { Route, Redirect } from "react-router-dom";
import LoginString from "../backend/LoginStrings";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const currentUser = localStorage.getItem(LoginString.Name);
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};

export default PrivateRoute;
