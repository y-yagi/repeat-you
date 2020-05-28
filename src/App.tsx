import React, { useState } from "react";
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
import Youtube from "react-youtube";
import "./App.css";

interface Props {}

function App(props: Props) {
  const ids = JSON.parse(localStorage.getItem("played_ids") || "[]") || [];
  const videos = JSON.parse(localStorage.getItem("videos") || "{}") || {};
  const historyMax = 20;

  const [videoId, setVideoId] = useState(ids[0])
  const [editingId, setEditingId] = useState("")

  let newVideoId = ""

  function onVideoEnd(event) {
    event.target.seekTo(0, true);
    event.target.playVideo();
  }

  function handleChangeFormValue(event) {
    newVideoId = event.target.value
  }

  function handleSubmit(event) {
    setVideoId(newVideoId);
    addToHistory(newVideoId);
    event.preventDefault();
  }

  function handleClickId(id, event) {
    ids.splice(ids.indexOf(id), 1);
    ids.unshift(id);
    localStorage.setItem("played_ids", JSON.stringify(ids));

    setVideoId(id)
    event.preventDefault();
  }

  function addToHistory(id) {
    if (ids.includes(id)) {
      return;
    }

    if (ids.length >= historyMax) {
      ids.pop();
    }

    ids.unshift(id);
    localStorage.setItem("played_ids", JSON.stringify(ids));
  }

  function handleDestoryHistory(id, event) {
    const index = ids.indexOf(id);
    if (index === -1) {
      return;
    }

    ids.splice(index, 1);
    localStorage.setItem("played_ids", JSON.stringify(ids));
    delete videos[id];
    localStorage.setItem("videos", JSON.stringify(videos));
    setVideoId("")
    event.preventDefault();
  }

  function handleEditName(id, event) {
    setEditingId(id)
    event.preventDefault();
  }

  function handleSaveName(id, event) {
    if (event.key === "Escape") {
      setEditingId("")
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    delete videos[id];
    videos[id] = event.target.value;
    localStorage.setItem("videos", JSON.stringify(videos));

    setEditingId("")
    event.preventDefault();
  }

  function videoName(id) {
    const name = videos[id];

    if (name === undefined) {
      return id;
    } else {
      return name;
    }
  }

  function renderIdList(ids) {
    const showOrEditId = (id) => {
      if (id === editingId) {
        return (
          <Input
            size="mini"
            defaultValue={videoName(id)}
            onKeyPress={(e) => handleSaveName(id, e)}
          />
        );
      } else {
        return (
          <List.Content
            floated="left"
            as="a"
            onClick={(e) => handleClickId(id, e)}
          >
            {videoName(id)}
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
            onClick={(e) => handleEditName(id, e)}
          >
            Edit
          </Button>
          <Button
            basic
            color="green"
            as="a"
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            Goto
          </Button>
          <Button
            basic
            color="red"
            onClick={(e) => handleDestoryHistory(id, e)}
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

    return (
      <Container className="app-container">
        <Header as="h2" icon textAlign="center" color="teal">
          <Icon name="play" />
          <Header.Content>YouTube Repeater</Header.Content>
        </Header>
        <Divider hidden section />
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <input
              placeholder="video ID"
              onChange={handleChangeFormValue}
              required={true}
            />
          </Form.Field>
          <Button type="submit">Play</Button>
        </Form>
        <Divider hidden section />
        <Grid>
          <Grid.Column width={11}>
            <div className="ui embed">
              {videoId && (
                <Youtube
                  videoId={videoId}
                  onEnd={onVideoEnd}
                  opts={{playerVars: { autoplay: 1, showinfo: 0}}}
                />
              )}
            </div>
          </Grid.Column>
          <Grid.Column width={5}>
            <Header size="medium">History</Header>
            {renderIdList(ids)}
          </Grid.Column>
        </Grid>
      </Container>
    );
}

export default App;
