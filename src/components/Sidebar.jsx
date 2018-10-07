import React, { Component } from "react";
import { Input, Label, Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default class MenuExampleSizeVerticalLarge extends Component {
  state = { activeItem: "games" };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <div
        style={{
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          top: "0px",
          bottom: "0px",
          left: "0px",
          width: "250px",
          background: "rgb(27, 28, 29)",
          overflowX: "hidden",
          overflowY: "auto"
        }}
      >
        <Menu
          size="large"
          stackable
          vertical
          inverted
          style={{ flex: "1 1 0%" }}
        >
          <Menu.Item as="a" href="/">
            <Icon
              name="crosshairs"
              left="true"
              size="large"
              style={{
                float: "none",
                margin: "0em 0.35714286em 0em 0em",
                paddingRight: 35
              }}
            />
            Battle Royale Gallery
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/games"
            name="games"
            active={activeItem === "games"}
            onClick={this.handleItemClick}
          >
            <Icon
              name="gamepad"
              left="true"
              size="large"
              style={{
                float: "none",
                margin: "0em 0.35714286em 0em 0em",
                paddingRight: 35
              }}
            />
            Games
          </Menu.Item>

          {this.props.user && (
            <Menu.Item
              as={Link}
              to="/me"
              name="account"
              active={activeItem === "account"}
              onClick={this.handleItemClick}
            >
              <Icon
                name="vcard"
                left="true"
                size="large"
                style={{
                  float: "none",
                  margin: "0em 0.35714286em 0em 0em",
                  paddingRight: 35
                }}
              />
              Account
            </Menu.Item>
          )}
        </Menu>
      </div>
    );
  }
}
