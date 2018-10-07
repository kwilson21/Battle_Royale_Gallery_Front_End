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
import { login } from "../services/authService";

class Login extends Component {
  state = {
    account: {
      email: "",
      password: ""
    },
    errors: {}
  };

  schema = {
    email: Joi.string(),
    password: Joi.string()
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
      await login(this.state.account);

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
            'url("https://stmed.net/sites/default/files/apocalyptic-wallpapers-30816-3156056.jpg")'
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
                  Login
                </Header>

                <Form error>
                  {!_.isEmpty(this.state.errors) ? (
                    <Message
                      error
                      header="Error"
                      content={"Email or password is incorrect."}
                    />
                  ) : null}

                  <Form.Input
                    onChange={event => {
                      this.handleChange(event, "email");
                    }}
                    icon="user"
                    iconPosition="left"
                    placeholder="Email address"
                  />

                  <Form.Input
                    onChange={event => {
                      this.handleChange(event, "password");
                    }}
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
                      Login
                    </Button>
                  </Grid>
                </Form>
              </Segment>
              <Segment padded secondary textAlign="center">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Login;
