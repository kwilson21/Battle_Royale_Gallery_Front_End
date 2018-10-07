import React, { Component } from "react";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import GameForm from "./components/GameForm";
import MainLayout from "./components/MainLayout";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import NotFound from "./components/NotFound";

import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <Switch>
          <Route path="/game/add" component={GameForm} />
          <Route path="/game/edit/:id" component={GameForm} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/not-found" component={NotFound} />
          <main className="main-container">
            <Route component={MainLayout} />
          </main>
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
