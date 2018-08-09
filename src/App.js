import React, { Component } from "react";
import {
  Container,
  Header,
  Icon,
  Divider,
  Grid,
  List,
  Form,
  Button
} from "semantic-ui-react";
import YoutubePlayer from "react-youtube-player";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.ids = JSON.parse(localStorage.getItem("played_ids")) || [];
    this.state = { videoId: this.ids[0] };

    this.videoId = "";
    this.historyMax = 10;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickId = this.clickId.bind(this);
    this.destoryHistory = this.destoryHistory.bind(this);
  }

  onEnd(event) {
    event.target.seekTo(0, true);
    event.target.playVideo();
  }

  handleChange(event) {
    this.videoId = event.target.value;
  }

  handleSubmit(event) {
    this.setState({ videoId: this.videoId });
    this.updateHistory(this.videoId);
    event.preventDefault();
  }

  clickId(id, event) {
    this.setState({ videoId: id });
    event.preventDefault();
  }

  updateHistory(id) {
    if (this.ids.includes(id)) {
      return;
    }

    if (this.ids.length >= this.historyMax) {
      this.ids.pop();
    }

    this.ids.unshift(id);
    localStorage.setItem("played_ids", JSON.stringify(this.ids));
  }

  destoryHistory() {
    this.ids = [];
    localStorage.setItem("played_ids", JSON.stringify(this.ids));
    this.setState({ videoId: "" });
  }

  renderIdList(ids) {
    const listIds = ids.map(id => (
      <List.Item key={id.toString()} as="a" onClick={e => this.clickId(id, e)}>
        {id}
      </List.Item>
    ));

    return <List>{listIds}</List>;
  }

  render() {
    return (
      <Container>
        <Header as="h2" icon textAlign="center" color="teal">
          <Icon name="play" />
          <Header.Content>YouTube Repeater</Header.Content>
        </Header>
        <Divider hidden section />
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <input
              placeholder="video ID"
              onChange={this.handleChange}
              required="true"
            />
          </Form.Field>
          <Button type="submit">Play</Button>
        </Form>
        <Divider hidden section />
        <Grid>
          <Grid.Column width={12}>
            <div className="ui embed">
              {this.state.videoId && (
                <YoutubePlayer
                  videoId={this.state.videoId}
                  playbackState="playing"
                  onEnd={this.onEnd}
                  configuration={{
                    autoplay: 1,
                    showinfo: 0
                  }}
                />
              )}
            </div>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header size="medium">Histories</Header>
            {this.renderIdList(this.ids)}
            {this.ids[0] && (
              <div>
                <Divider section />
                <Button basic color="red" onClick={this.destoryHistory}>
                  Destroy
                </Button>
              </div>
            )}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default App;
