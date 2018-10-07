import React, { Component } from "react";
import Comments from "./Comments";
import {
  Segment,
  Image,
  Card,
  Label,
  Input,
  Container,
  Header,
  Grid,
  Button,
  Icon,
  Divider,
  Modal
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import {
  getGame,
  deleteGame,
  likeGame,
  dislikeGame,
  unlikeGame,
  undislikeGame
} from "../services/gameService";

import _ from "lodash";
import { toast } from "react-toastify";

import moment from "moment";
import arrayBufferToBase64 from "../utilities/imgDecoder";

moment.suppressDeprecationWarnings = true;

class Games extends Component {
  state = {
    open: false,
    img: null,
    game: {
      _id: "",
      name: "",
      developer: "",
      description: "",
      genre: {
        perspective: [],
        style: []
      },
      playernumber: "",
      released: Boolean,
      releasedate: Date,
      platform: [],
      price: 0,
      rating: {
        likecount: 0,
        dislikecount: 0,
        likes: [],
        dislikes: []
      },
      image: {
        data: null,
        contentType: ""
      },
      comments: [
        {
          name: "",
          text: ""
        }
      ]
    }
  };

  async componentDidMount() {
    try {
      const { data } = await getGame(this.props.match.params.id);

      this.setState({ game: data });

      let base64Flag = "data:" + data.image.contentType + ";base64,";
      let imageStr = arrayBufferToBase64(data.image.data.data);

      this.setState({ img: base64Flag + imageStr });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  handleLikeAndDislike = async (event, fieldName) => {
    if (fieldName === "like") {
      try {
        await likeGame(this.state.game._id);
        let game = this.state.game;

        game.rating[fieldName + "count"]++;

        this.setState(game);
      } catch (ex) {
        if (
          ex.response &&
          ex.response.status === 400 &&
          ex.response.data === "User already liked the game."
        ) {
          await unlikeGame(this.state.game._id);
          let game = this.state.game;

          game.rating[fieldName + "count"]--;

          this.setState(game);
        }
      }
    }
    if (fieldName === "dislike") {
      try {
        await dislikeGame(this.state.game._id);
        let game = this.state.game;

        game.rating[fieldName + "count"]++;

        this.setState(game);
      } catch (ex) {
        if (
          ex.response &&
          ex.response.status === 400 &&
          ex.response.data === "User already disliked the game."
        ) {
          await undislikeGame(this.state.game._id);
          let game = this.state.game;
          game.rating[fieldName + "count"]--;

          this.setState(game);
        }
      }
    }
  };

  handleDelete = async () => {
    try {
      await deleteGame(this.state.game._id);

      this.props.history.push("/games");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This game has already been deleted.");
      }

      this.closeModal();
    }
  };

  showModal = () => this.setState({ open: true });

  closeModal = () => this.setState({ open: false });

  render() {
    return (
      <React.Fragment>
        <Modal basic open={this.state.open} onClose={this.close}>
          <Header icon="x" content={`Delete ${this.state.game.name}`} />

          <Modal.Content>
            <p>Are you sure you want to delete {this.state.game.name}?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={() => this.closeModal()}
              basic
              color="red"
              inverted
            >
              <Icon name="remove" /> No
            </Button>
            <Button onClick={() => this.handleDelete()} color="green" inverted>
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>

        <Segment vertical secondary padded>
          <Container textAlign="center">
            <Header as="h1">{this.state.game.name}</Header>
            {this.props.user &&
              this.props.user.isAdmin && (
                <React.Fragment>
                  <Button
                    onClick={() => this.showModal()}
                    color="red"
                    icon
                    style={{ marginRight: 10 }}
                  >
                    <Icon name="x" />
                    &nbsp; Delete
                  </Button>
                  <Button
                    as={Link}
                    to={{
                      pathname: `/game/edit/${this.state.game._id}`,
                      game: this.state.game
                    }}
                    color="grey"
                    icon
                    style={{ marginRight: 10 }}
                  >
                    <Icon name="edit" />
                    &nbsp; Edit
                  </Button>
                </React.Fragment>
              )}
          </Container>
        </Segment>
        <Segment vertical secondary>
          <Grid centered>
            <Grid.Column width="12">
              <Card centered raised>
                <Image src={this.state.img} />
              </Card>

              <Grid centered style={{ marginTop: 5, marginBottom: 5 }}>
                <Label
                  onClick={event => this.handleLikeAndDislike(event, "like")}
                  as="a"
                  content={`${this.state.game.rating.likecount} likes`}
                  icon="thumbs up"
                />
                <Label
                  onClick={event => this.handleLikeAndDislike(event, "dislike")}
                  as="a"
                  content={`${this.state.game.rating.dislikecount} dislikes`}
                  icon="thumbs down"
                />
              </Grid>
              <Divider />
              <Grid verticalAlign="top" centered>
                <Grid.Column width="2">
                  <Header as="h3">Developer</Header>
                  <p>
                    {this.state.game.developer
                      ? this.state.game.developer
                      : "TBD"}
                  </p>
                </Grid.Column>
                <Grid.Column width="2">
                  <Header as="h3">Perspective</Header>
                  <p>
                    {!_.isEmpty(this.state.game.genre.perspective)
                      ? this.state.game.genre.perspective.map(p => (
                          <div>{p}</div>
                        ))
                      : "TBD"}
                  </p>
                </Grid.Column>
                <Grid.Column
                  width="2"
                  style={{
                    marginRight: "-80px"
                  }}
                >
                  <Header as="h3">Style</Header>
                  {!_.isEmpty(this.state.game.genre.style)
                    ? this.state.game.genre.style.map(s => {
                        if (s === "Shooter") {
                          return <Icon name="crosshairs" />;
                        }
                        if (s === "Melee") {
                          return <Icon name="hand rock" />;
                        }
                      })
                    : "TBD"}
                </Grid.Column>
                <Grid.Column width="2">
                  <Header as="h3">Release date</Header>
                  <p>
                    {this.state.game.releasedate
                      ? moment(this.state.game.releasedate).format("MM-DD-YYYY")
                      : "TBD"}
                  </p>
                </Grid.Column>
                <Grid.Column width="2">
                  <Header as="h3">Platforms</Header>
                  {this.state.game.platform
                    ? this.state.game.platform.map(p => {
                        if (p === "Playstation") {
                          return <Icon name="playstation" />;
                        }
                        if (p === "Xbox") {
                          return <Icon name="xbox" />;
                        }
                        if (p === "Windows") {
                          return <Icon name="windows" />;
                        }
                        if (p === "Linux") {
                          return <Icon name="linux" />;
                        }
                        if (p === "Android") {
                          return <Icon name="android" />;
                        }
                        if (p === "iOS" || p === "macOS") {
                          return <Icon name="apple" />;
                        }
                        if (p === "Nintendo Switch") {
                          return <Icon name="nintendo" />;
                        }
                      })
                    : "TBD"}
                </Grid.Column>
                <Grid.Column width="2">
                  <Header as="h3">Price</Header>
                  <p>
                    {this.state.game.price > 0
                      ? `$${this.state.game.price}`
                      : "Free to play"}
                  </p>
                </Grid.Column>
              </Grid>
              <Header textAlign="center" as="h3">
                Description
              </Header>
              <Container textAlign="center">
                <p>
                  {this.state.game.description
                    ? this.state.game.description
                    : "TBD"}
                </p>
              </Container>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment
          tertiary
          vertical
          style={{ minHeight: 406, paddingBottom: 30, paddingTop: 30 }}
        >
          <Grid padded width="12">
            <div style={{ margin: "auto", width: "40%" }}>
              <Segment>
                <Comments
                  gameId={this.state.game._id}
                  comments={this.state.game.comments}
                />
              </Segment>
            </div>
          </Grid>
        </Segment>
      </React.Fragment>
    );
  }
}

export default Games;
