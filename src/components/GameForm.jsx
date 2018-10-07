import React, { Component } from "react";
import { Form, Segment, Grid, Header, Icon, Message } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { DateInput } from "semantic-ui-calendar-react";

import { FileButton } from "./FileButton";

import { saveGame } from "../services/gameService";

import _ from "lodash";

const perspective = [
  { key: "fp", text: "First-Person", value: "First-Person" },
  { key: "tp", text: "Third-Person", value: "Third-Person" }
];

const style = [
  { key: "s", text: "Shooter", value: "Shooter" },
  { key: "m", text: "Melee", value: "Melee" }
];

const platform = [
  { key: "p", text: "Playstation", value: "Playstation" },
  { key: "x", text: "Xbox", value: "Xbox" },
  { key: "w", text: "Windows", value: "Windows" },
  { key: "l", text: "Linux", value: "Linux" },
  { key: "a", text: "Android", value: "Android" },
  { key: "i", text: "iOS", value: "iOS" },
  { key: "m", text: "macOS", value: "macOS" },
  { key: "n", text: "Nintendo Switch", value: "Nintendo Switch" }
];

class GameForm extends Component {
  constructor(props) {
    super(props);

    if (props.location.game) {
      this.state = { game: props.location.game };
    } else {
      this.state = {
        errors: {},
        game: {
          name: "",
          description: "",
          platform: [],
          genre: { perspective: [], style: [] },
          price: 0,
          image: { data: undefined, contentType: "" },
          released: undefined,
          releasedate: undefined
        }
      };
    }
  }

  componentDidMount() {
    this.updateState();
  }

  updateState = () => {
    if (this.props.values !== undefined) {
      this.setState(this.props.values);
    }
  };

  imgUploaded = false;

  handleFileUpload = file => {
    let game = this.state.game;
    game.image.data = file;
    game.image.contentType = file.type;
    this.setState({ game }, () => (this.imgUploaded = true));
    this.imageName = file.name;
  };

  handleDateChange = (event, { name, value }) => {
    let game = this.state.game;
    game[name] = value;

    this.setState({ game });
  };

  handleChange = (event, fieldName) => {
    let game = this.state.game;
    game[fieldName] = event.target.value;
    this.setState({ game });
  };

  handleSelectChange = (event, result, fieldName) => {
    if (result) {
      const { value } = result;
      let game = this.state.game;

      switch (fieldName) {
        case "platform":
          game.platform = value;
          this.setState({ game });
          break;
        case "perspective":
          game.genre.perspective = value;
          this.setState({ game });
          break;
        case "style":
          game.genre.style = value;
          this.setState({ game });
          break;
      }
    }
  };

  handleSubmit = async () => {
    const game = this.state.game;

    if (game._id !== undefined) {
      delete game.rating;
      delete game.comments;
      delete game.__v;
    }

    if (!this.imgUploaded && game.image.data !== undefined) {
      game.image.data.name = undefined;
    }

    if (game.releasedate === undefined) {
      game.released = false;
    } else {
      game.released = true;
    }

    this.setState(game, async () => {
      try {
        await saveGame(this.state.game);
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          const errors = { ...this.state.errors };
          errors.name = ex.response.data;
          this.setState({ errors });
        }
      }

      this.props.history.push("/games");
    });
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
          backgroundImage: 'url("https://i.redd.it/ojlqmpxy03s01.jpg")'
        }}
      >
        <Grid centered padded>
          <Grid.Column
            width={7}
            style={{ padding: "120px 0", flex: "0 0 600px" }}
          >
            <Header style={{ paddingBottom: 30 }} as="h2">
              <Header style={{ paddingLeft: 110 }} as={Link} to="/">
                <Icon name="crosshairs" />
                Battle Royale Gallery
              </Header>
            </Header>
            <Segment>
              <Header textAlign="center" as="h1">
                {this.props.match.params.id ? "Edit game" : "Add game"}
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
                <Form.Group widths="equal">
                  <Form.Input
                    value={
                      this.state.game.name !== undefined
                        ? this.state.game.name
                        : ""
                    }
                    onChange={event => this.handleChange(event, "name")}
                    required
                    fluid
                    label="Name"
                    placeholder="Name"
                  />
                  <Form.Input
                    value={
                      this.state.game.developer !== undefined
                        ? this.state.game.developer
                        : ""
                    }
                    onChange={event => this.handleChange(event, "developer")}
                    fluid
                    label="Developer"
                    placeholder="Developer"
                  />
                </Form.Group>

                <Form.TextArea
                  value={
                    this.state.game.description !== undefined
                      ? this.state.game.description
                      : ""
                  }
                  onChange={event => this.handleChange(event, "description")}
                  label="Description"
                  placeholder="Game description"
                />

                <Form.Group widths="equal">
                  <Form.Select
                    value={
                      this.state.game.platform !== undefined
                        ? this.state.game.platform
                        : ""
                    }
                    onChange={(event, result) =>
                      this.handleSelectChange(event, result, "platform")
                    }
                    fluid
                    multiple
                    search
                    selection
                    label="Platform"
                    options={platform}
                    placeholder="Platform"
                  />
                  <Form.Select
                    value={
                      this.state.game.genre.perspective !== undefined
                        ? this.state.game.genre.perspective
                        : ""
                    }
                    onChange={(event, result) =>
                      this.handleSelectChange(event, result, "perspective")
                    }
                    fluid
                    multiple
                    search
                    selection
                    label="Perspective"
                    options={perspective}
                    placeholder="Perspective"
                  />
                  <Form.Select
                    value={
                      this.state.game.genre.style !== undefined
                        ? this.state.game.genre.style
                        : ""
                    }
                    onChange={(event, result) =>
                      this.handleSelectChange(event, result, "style")
                    }
                    fluid
                    multiple
                    search
                    selection
                    label="Style"
                    options={style}
                    placeholder="Style"
                  />
                </Form.Group>

                <Form.Group widths="equal">
                  <DateInput
                    dateFormat="MM-DD-YYYY"
                    name="releasedate"
                    placeholder="Release Date"
                    value={this.state.game.releasedate}
                    iconPosition="left"
                    label="Release Date"
                    onChange={this.handleDateChange}
                  />

                  <Form.Input
                    value={
                      this.state.game.price !== undefined
                        ? this.state.game.price
                        : ""
                    }
                    onChange={event => this.handleChange(event, "price")}
                    fluid
                    label="Price"
                    placeholder="Price"
                  />
                </Form.Group>

                <Grid centered>
                  <FileButton
                    onSelect={this.handleFileUpload}
                    style={{ marginTop: 14, marginBottom: 14 }}
                  />
                </Grid>
                {this.imageName}
                <Grid centered>
                  <Form.Button
                    onClick={event => this.handleSubmit()}
                    primary
                    style={{ marginBottom: 14 }}
                  >
                    Submit
                  </Form.Button>
                </Grid>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default GameForm;
