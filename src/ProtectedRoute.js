import React from "react";

import { Route, Redirect } from "react-router-dom";
import { getLocalStorageProperty } from "./util/LocalStorageHelper";
import PropTypes from "prop-types";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = getLocalStorageProperty("flavors-admin-token");

  return (
    <Route
      {...rest}
      render={(props) => {
        if (token) {
          return <Component {...props} />;
        } else {
          return <Redirect to={"/signin"} />;
        }
      }}
    />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.func,
};
