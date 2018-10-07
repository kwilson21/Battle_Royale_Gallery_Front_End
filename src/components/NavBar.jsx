import React, { Component } from "react";
import {
  Button,
  Menu,
  Icon,
  Segment,
  Breadcrumb
} from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../services/authService";

export default class NavBar extends Component {
  handleLogout = () => {
    logout();
    window.location = "/";
  };

  render() {
    let content = [];

    for (let i = 0; i < this.props.nav.length; i++) {
      if (i + 1 === this.props.nav.length) {
        content.push(
          <Breadcrumb.Section
          key={i}
            as={NavLink}
            onClick={() => this.props.rollBackNavBar(i)}
            to={this.props.nav[i][0]}
          >
            {this.props.nav[i][1]}
          </Breadcrumb.Section>
        );
      } else {
        content.push(
          <React.Fragment>
            <Breadcrumb.Section
              as={NavLink}
              onClick={() => this.props.rollBackNavBar(i)}
              to={this.props.nav[i][0]}
            >
              {this.props.nav[i][1]}
            </Breadcrumb.Section>
            <Breadcrumb.Divider icon="right angle" />
          </React.Fragment>
        );
      }
    }
    return (
      <Segment vertical basic secondary>
        <Menu secondary pointing borderless>
          <Menu.Item>
            <Breadcrumb size="large">
              <Icon color="blue" name="home" />
              {content}
            </Breadcrumb>
          </Menu.Item>

          <Menu.Menu position="right">
            {!this.props.user ? (
              <React.Fragment>
                <Menu.Item>
                  <Button as={Link} to="/login" basic color="blue">
                    <Icon name="sign-in" />
                    Log-in
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button as={Link} to="/signup" primary>
                    <Icon name="rocket" />
                    Sign up
                  </Button>
                </Menu.Item>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Menu.Item>
                  <Button
                    onClick={event => this.handleLogout()}
                    basic
                    color="blue"
                  >
                    <Icon name="sign-out" />
                    Log-out
                  </Button>
                </Menu.Item>
              </React.Fragment>
            )}
          </Menu.Menu>
        </Menu>
      </Segment>
    );
  }
}
