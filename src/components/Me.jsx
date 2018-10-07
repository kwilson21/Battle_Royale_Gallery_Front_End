import React, { Component } from "react";
import { Segment, Header } from "semantic-ui-react";
import jwtDecode from "jwt-decode";

class Me extends Component {
  state = {};

  componentDidMount() {
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);

      this.setState({ user });
    } catch (ex) {}
  }

  render() {
    return (
      <React.Fragment>
        {this.state.user ? (
          <Segment
            style={{ minHeight: "100vh" }}
            vertical
            secondary
            padded
            textAlign="center"
          >
            <Header as="h1">Account type</Header>
            {this.state.user.isAdmin ? "Administrator" : "Normal"}
            <Header as="h1">Username</Header>
            {this.state.user.name}
            <Header as="h1">Email</Header>
            {this.state.user.email}
          </Segment>
        ) : (
          <Header as="h1">User not found</Header>
        )}
      </React.Fragment>
    );
  }
}

export default Me;
