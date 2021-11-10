/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import "assets/css/material-dashboard-react.css?v=1.10.0";
import "dotenv/config";
// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import { ProtectedRoute } from "ProtectedRoute";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { verifyToken } from "util/JwtHelper";
import SignIn from "views/SignIn/SignIn";
import SignUp from "views/SignUp/SignUp";

verifyToken();
ReactDOM.render(
  <BrowserRouter>
    <ProtectedRoute path="/admin" component={Admin} />
    <ProtectedRoute path="/rtl" component={RTL} />
    <Switch>
      <ProtectedRoute
        path="/signup"
        exact
        // render={(props) => <SignUp {...props} />}
        component={SignUp}
      />
      <Route path="/signin" exact render={(props) => <SignIn {...props} />} />

      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
