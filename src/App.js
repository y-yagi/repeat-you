import React, { Component } from "react";
import {
  Container,
  Header,
  Icon,
  Divider,
  Grid,
  List,
  Form,
  Button,
  Input,
} from "semantic-ui-react";
import YoutubePlayer from "react-youtube-player";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.ids = JSON.parse(localStorage.getItem("played_ids")) || [];
    this.videos = JSON.parse(localStorage.getItem("videos")) || {};
    this.state = { videoId: this.ids[0], editingId: "" };

    this.videoId = "";
    this.historyMax = 20;

    this.handleChangeFormValue = this.handleChangeFormValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickId = this.handleClickId.bind(this);
    this.handleDestoryHistory = this.handleDestoryHistory.bind(this);
    this.handleEditName = this.handleEditName.bind(this);
    this.handleSaveName = this.handleSaveName.bind(this);
    this.videoName = this.videoName.bind(this);
  }

  onVideoEnd(event) {
    event.target.seekTo(0, true);
    event.target.playVideo();
  }

  handleChangeFormValue(event) {
    this.videoId = event.target.value;
  }

  handleSubmit(event) {
    this.setState({ videoId: this.videoId });
    this.addToHistory(this.videoId);
    event.preventDefault();
  }

  handleClickId(id, event) {
    this.ids.splice(this.ids.indexOf(id), 1);
    this.ids.unshift(id);
    localStorage.setItem("played_ids", JSON.stringify(this.ids));

    this.setState({ videoId: id });
    event.preventDefault();
  }

  addToHistory(id) {
    if (this.ids.includes(id)) {
      return;
    }

    if (this.ids.length >= this.historyMax) {
      this.ids.pop();
    }

    this.ids.unshift(id);
    localStorage.setItem("played_ids", JSON.stringify(this.ids));
  }

  handleDestoryHistory(id, event) {
    const index = this.ids.indexOf(id);
    if (index === -1) {
      return;
    }

    this.ids.splice(index, 1);
    localStorage.setItem("played_ids", JSON.stringify(this.ids));
    delete this.videos[id];
    localStorage.setItem("videos", JSON.stringify(this.videos));
    this.setState({ videoId: "" });
    event.preventDefault();
  }

  handleEditName(id, event) {
    this.setState({ editingId: id });
    event.preventDefault();
  }

  handleSaveName(id, event) {
    if (event.key === "Escape") {
      this.setState({ editingId: "" });
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    delete this.videos[id];
    this.videos[id] = event.target.value;
    localStorage.setItem("videos", JSON.stringify(this.videos));

    this.setState({ editingId: "" });
    event.preventDefault();
  }

  videoName(id) {
    const name = this.videos[id];

    if (name === undefined) {
      return id;
    } else {
      return name;
    }
  }

  renderIdList(ids) {
    const showOrEditId = (id) => {
      if (id === this.state.editingId) {
        return (
          <Input
            size="mini"
            defaultValue={this.videoName(id)}
            onKeyPress={(e) => this.handleSaveName(id, e)}
          />
        );
      } else {
        return (
          <List.Content
            floated="left"
            as="a"
            onClick={(e) => this.handleClickId(id, e)}
          >
            {this.videoName(id)}
          </List.Content>
        );
      }
    };

    const listIds = ids.map((id) => (
      <List.Item key={id.toString()}>
        {showOrEditId(id)}
        <input name="id" value={id} type="hidden" />
        <List.Content floated="right">
          <Button
            basic
            color="blue"
            onClick={(e) => this.handleEditName(id, e)}
          >
            Edit
          </Button>
          <Button
            basic
            color="red"
            onClick={(e) => this.handleDestoryHistory(id, e)}
          >
            Destroy
          </Button>
        </List.Content>
      </List.Item>
    ));

    return (
      <List divided verticalAlign="middle">
        {listIds}
      </List>
    );
  }

  render() {
    return (
      <Container className="app-container">
        <Header as="h2" icon textAlign="center" color="teal">
          <Icon name="play" />
          <Header.Content>YouTube Repeater</Header.Content>
        </Header>
        <Divider hidden section />
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <input
              placeholder="video ID"
              onChange={this.handleChangeFormValue}
              required={true}
            />
          </Form.Field>
          <Button type="submit">Play</Button>
        </Form>
        <Divider hidden section />
        <Grid>
          <Grid.Column width={11}>
            <div className="ui embed">
              {this.state.videoId && (
                <YoutubePlayer
                  videoId={this.state.videoId}
                  playbackState="playing"
                  onEnd={this.onVideoEnd}
                  configuration={{
                    autoplay: 1,
                    showinfo: 0,
                  }}
                />
              )}
            </div>
          </Grid.Column>
          <Grid.Column width={5}>
            <Header size="medium">History</Header>
            {this.renderIdList(this.ids)}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default App;
