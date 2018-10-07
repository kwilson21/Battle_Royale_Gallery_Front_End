import React, { Component } from "react";
import {
  Form,
  Segment,
  Grid,
  Header,
  Button,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import _ from "lodash";
import { signUp } from "./../services/userService";
import { loginWithJwt } from "./../services/authService";

class Login extends Component {
  state = {
    account: {
      name: "",
      email: "",
      password: ""
    },
    errors: {}
  };

  schema = {
    email: Joi.string()
      .min(5)
      .max(50)
      .label("Email"),
    password: Joi.string()
      .min(5)
      .max(50)
      .label("Password"),
    name: Joi.string()
      .min(5)
      .max(50)
      .label("Username")
  };

  validate = () => {
    const options = {
      abortEarly: false
    };
    const result = Joi.validate(this.state.account, this.schema, options);

    if (!result.error) return null;

    const errors = {};

    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
    }

    return errors;
  };

  handleChange = (event, fieldName) => {
    let account = this.state.account;
    account[fieldName] = event.target.value;

    this.setState({ account });
  };

  handleSubmit = async () => {
    const errors = this.validate();

    this.setState({ errors: errors || {} });
    if (errors) return;

    // Submit to server
    try {
      const { headers } = await signUp(this.state.account);
      loginWithJwt(headers["x-auth-token"]);
      this.props.history.push("/");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.name = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div
        style={{
          minHeight: "100%",
          minWidth: "1024px",
          width: "100%",
          height: "auto",
          position: "absolute",
          overflowY: "auto",
          top: "0",
          left: "0",
          backgroundImage:
            'url("https://hdqwalls.com/download/fortnite-battle-royale-hd-wz-1920x1200.jpg")'
        }}
      >
        <Grid centered padded>
          <Grid.Column
            width={3}
            style={{ padding: "120px 0", flex: "0 0 400px" }}
          >
            <Header style={{ paddingBottom: 30 }} as="h2">
              <Header style={{ paddingLeft: 15 }} as={Link} to="/">
                <Icon name="crosshairs" />
                Battle Royale Gallery
              </Header>
            </Header>
            <Segment.Group>
              <Segment padded>
                <Header
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  textAlign="center"
                  as="h1"
                >
                  Sign Up
                </Header>

                <Form error>
                  {!_.isEmpty(this.state.errors) ? (
                    <Message
                      error
                      header="Error"
                      content={
                        <p>{Object.values(this.state.errors).map(e => e)}</p>
                      }
                    />
                  ) : null}
                  <Form.Input
                    onChange={event => this.handleChange(event, "name")}
                    icon="at"
                    iconPosition="left"
                    placeholder="Username"
                  />
                  <Form.Input
                    onChange={event => this.handleChange(event, "email")}
                    icon="user"
                    iconPosition="left"
                    placeholder="Email address"
                  />
                  <Form.Input
                    onChange={event => this.handleChange(event, "password")}
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="Password"
                  />

                  <Grid centered>
                    <Button
                      onClick={this.handleSubmit}
                      primary
                      style={{ marginTop: 14, marginBottom: 14 }}
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  </Grid>
                </Form>
              </Segment>
              <Segment padded secondary textAlign="center">
                Already have an account? <Link to="/login">Login</Link>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Login;
