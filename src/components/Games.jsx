import React, { Component } from "react";
import GameCard from "./GameCard";
import {
  Segment,
  Input,
  Container,
  Header,
  Grid,
  Button,
  Icon,
  Divider,
  Dimmer,
  Loader,
  Image
} from "semantic-ui-react";
import { getAllGames } from "../services/gameService";
import _ from "lodash";
import { Link } from "react-router-dom";

class Games extends Component {
  state = {
    games: [],
    query: undefined,

    name: { show: true, asc: false },
    releasedate: { show: false, asc: true },
    rating: { show: false, asc: true },
    price: { show: false, asc: true },
    style: { show: false, asc: true }
  };

  gamesInDb = true;

  async componentDidMount() {
    const { data } = await getAllGames();

    if (!data) {
      this.gamesInDb = false;
    }

    this.setState({
      games: _.reverse(_.sortBy(data, "name", "desc"))
    });
  }

  handleSort = fieldName => {
    let unsortedGames = this.state;
    let sortedGames;
    let ascOrder;

    switch (fieldName) {
      case "name":
        ascOrder = !unsortedGames.name.asc;
        unsortedGames.name.asc = !unsortedGames.name.asc;
        unsortedGames.name.show = true;
        unsortedGames.releasedate.show = false;
        unsortedGames.rating.show = false;
        unsortedGames.price.show = false;
        unsortedGames.style.show = false;
        break;

      case "releasedate":
        ascOrder = !unsortedGames.releasedate.asc;
        unsortedGames.releasedate.asc = !unsortedGames.releasedate.asc;
        unsortedGames.name.show = false;
        unsortedGames.releasedate.show = true;
        unsortedGames.rating.show = false;
        unsortedGames.price.show = false;
        unsortedGames.style.show = false;
        break;

      case "rating":
        ascOrder = !unsortedGames.rating.asc;
        unsortedGames.rating.asc = !unsortedGames.rating.asc;
        unsortedGames.name.show = false;
        unsortedGames.releasedate.show = false;
        unsortedGames.rating.show = true;
        unsortedGames.price.show = false;
        unsortedGames.style.show = false;
        break;

      case "price":
        ascOrder = !unsortedGames.price.asc;
        unsortedGames.price.asc = !unsortedGames.price.asc;
        unsortedGames.name.show = false;
        unsortedGames.releasedate.show = false;
        unsortedGames.rating.show = false;
        unsortedGames.price.show = true;
        unsortedGames.style.show = false;
        break;
    }

    if (ascOrder) {
      sortedGames = _.sortBy(unsortedGames.games, fieldName, "asc");
    } else {
      sortedGames = _.reverse(_.sortBy(unsortedGames.games, fieldName, "asc"));
    }

    this.setState({ games: sortedGames });
  };

  handleSearch = event => {
    let filteredGames;
    if (event.target.value) {
      filteredGames = this.state.games.filter(g =>
        g.name.toLowerCase().startsWith(event.target.value.toLowerCase())
      );
    }
    this.setState({ query: filteredGames });
  };

  handleLikeAndDislike = (event, fieldName, game) => {
    game.rating[fieldName]++;

    this.setState({ games: [game] });
  };

  render() {
    return (
      <React.Fragment>
        <Segment padded secondary vertical>
          <Container textAlign="center">
            <Header as="h1">Games</Header>

            {this.props.user &&
              this.props.user.isAdmin && (
                <Button
                  as={Link}
                  to="/game/add"
                  color="blue"
                  icon
                  style={{ marginRight: 10 }}
                >
                  <Icon name="plus" />
                  &nbsp; Add a game
                </Button>
              )}

            <Input
              onChange={this.handleSearch}
              icon="search"
              placeholder="Search..."
              style={{ marginRight: 10, marginBottom: 10 }}
            />
            <Button.Group>
              <Button onClick={event => this.handleSort("name")}>
                {this.state.name.show ? (
                  this.state.name.asc ? (
                    <Icon name="triangle up" />
                  ) : (
                    <Icon name="triangle down" />
                  )
                ) : null}
                Name
              </Button>
              <Button onClick={event => this.handleSort("releasedate")}>
                {this.state.releasedate.show ? (
                  this.state.releasedate.asc ? (
                    <Icon name="triangle up" />
                  ) : (
                    <Icon name="triangle down" />
                  )
                ) : null}
                New
              </Button>
              <Button onClick={event => this.handleSort("rating")}>
                {this.state.rating.show ? (
                  this.state.rating.asc ? (
                    <Icon name="triangle up" />
                  ) : (
                    <Icon name="triangle down" />
                  )
                ) : null}
                Rating
              </Button>
              <Button onClick={event => this.handleSort("price")}>
                {this.state.price.show ? (
                  this.state.price.asc ? (
                    <Icon name="triangle up" />
                  ) : (
                    <Icon name="triangle down" />
                  )
                ) : null}
                Price
              </Button>
            </Button.Group>
          </Container>
        </Segment>
        <Segment style={{ minHeight: "100vh" }} vertical secondary>
          {this.state.query ? (
            <Grid
              textAlign="left"
              style={{ marginLeft: "50px", marginRight: "25px" }}
            >
              {this.state.query.map(game => (
                <GameCard
                  addToNavBar={this.props.addToNavBar}
                  name={game.name}
                  likes={game.likecount}
                  dislikes={game.dislikecount}
                  gameId={game._id}
                  gameImg={game.image.data}
                  gameImgType={game.image.contentType}
                />
              ))}
            </Grid>
          ) : !this.gamesInDb ? (
            <h1>There are no games in database</h1>
          ) : this.state.games.length === 0 ? (
            <React.Fragment>
              <Dimmer active>
                <Loader
                  style={{ paddingBottom: 500 }}
                  size="massive"
                  indeterminate
                >
                  Loading games...
                </Loader>
                
              </Dimmer>
            </React.Fragment>
          ) : (
            <Grid
              textAlign="left"
              style={{ marginLeft: "50px", marginRight: "25px" }}
            >
              {this.state.games.map(game => (
                <GameCard
                  addToNavBar={this.props.addToNavBar}
                  name={game.name}
                  likes={game.rating.likecount}
                  dislikes={game.rating.dislikecount}
                  gameId={game._id}
                  gameImg={game.image ? game.image.data : null}
                  gameImgType={game.img ? game.image.contentType : null}
                />
              ))}
            </Grid>
          )}
        </Segment>
      </React.Fragment>
    );
  }
}

export default Games;
