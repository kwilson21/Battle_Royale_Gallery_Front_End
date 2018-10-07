import React, { Component } from "react";
import { Button, Comment, Form, Header } from "semantic-ui-react";
import _ from "lodash";
import { toast } from "react-toastify";
import { addComment, deleteComment } from "../services/gameService";
import { getCurrentUser } from "../services/authService";

class Comments extends Component {
  state = {
    comments: [],
    newComment: { name: "", text: "" }
  };

  componentWillReceiveProps(nextProps) {
    if (
      // _.isArray(nextProps.comments) &&
      // !nextProps.comments[0].name &&
      // !nextProps.comments[0].text
      !_.isEmpty(nextProps.comments)
    ) {
      this.setState({ comments: nextProps.comments });
    }
  }

  handleChange = event => {
    this.setState({ newComment: { text: event.target.value } });
  };

  handleSubmit = async () => {
    try {
      const user = getCurrentUser();

      let newComment = this.state.newComment;

      if (user) newComment.name = user.name;

      this.setState(
        { newComment },
        async () => await addComment(this.props.gameId, this.state.newComment)
      );

      let comments = this.state.comments;

      if (_.isEmpty(this.state.newComment.name)) {
        let comment = this.state.newComment;
        comment.name = "Anonymous user";
        this.setState({ newComment: comment });
      }

      comments.push(this.state.newComment);

      this.setState({ comments });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("An erorr has occurred");
      }
    }
  };

  handleDelete = async (name, text) => {
    try {
      let comment = {};

      comment.name = name;
      comment.text = text;

      let comments = this.state.comments;

      const index = comments.indexOf(comment);

      comments.splice(index, 1);

      this.setState(
        { comments },
        async () => await deleteComment(this.props.gameId, comment)
      );
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("An erorr has occurred");
      }
    }
  };

  render() {
    const user = getCurrentUser();
    return (
      <Comment.Group>
        <Header as="h3" dividing>
          Comments
        </Header>

        {_.isEmpty(this.state.comments.name)
          ? this.state.comments.map(c => {
              return (
                <Comment key={this.state.comments.indexOf(c)}>
                  <Comment.Content>
                    <Comment.Author>{c.name}</Comment.Author>
                    <Comment.Text>{c.text}</Comment.Text>
                    <Comment.Actions>
                      {user &&
                        user.isAdmin && (
                          <Comment.Action
                            onClick={() => this.handleDelete(c.name, c.text)}
                          >
                            Delete
                          </Comment.Action>
                        )}
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>
              );
            })
          : null}
        <Form reply>
          <Form.TextArea onChange={event => this.handleChange(event)} />
          <Button
            onClick={event => {
              this.handleSubmit();
            }}
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            primary
          />
        </Form>
      </Comment.Group>
    );
  }
}

export default Comments;
