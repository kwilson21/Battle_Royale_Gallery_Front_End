import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import { getCurrentUser } from "../services/authService";

import Games from "./Games";
import Game from "./Game";

import Me from "./Me";
import SideBar from "./Sidebar";
import NavBar from "./NavBar";

class MainLayout extends Component {
  constructor() {
    super();
    this.state = {
      nav: [["/", "Home"]]
    };
  }

  componentDidMount() {
    const user = getCurrentUser();

    this.setState({ user });
  }

  addToNavBar = (path, displayName) => {
    this.setState({ nav: [...this.state.nav, [path, displayName]] });
  };

  rollBackNavBar = destination => {
    this.setState({ nav: this.state.nav.slice(0, destination + 1) });
  };

  render() {
    return (
      <React.Fragment>
        <SideBar user={this.state.user} />
        <div className="page-content">
          <NavBar
            user={this.state.user}
            nav={this.state.nav}
            rollBackNavBar={this.rollBackNavBar}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Games user={this.state.user} addToNavBar={this.addToNavBar} />
              )}
            />
            <Route
              exact
              path="/games"
              render={() => (
                <Games user={this.state.user} addToNavBar={this.addToNavBar} />
              )}
            />
            <Route
              exact
              path="/game/:id"
              render={props => (
                <Game
                  {...props}
                  user={this.state.user}
                  addToNavBar={this.addToNavBar}
                />
              )}
            />
            <Route path="/me" component={Me} />

            <Redirect to="/not-found" />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default MainLayout;
