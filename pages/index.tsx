import type { NextPage } from "next";
import { useEffect, useState, useCallback, SyntheticEvent } from "react";
import Youtube from "react-youtube";
import {
  Container,
  Header,
  Icon,
  Divider,
  Grid,
  List,
  Button,
  Input,
} from "semantic-ui-react";
import RepeatForm from "../components/repeat-form";
import { YouTubePlayer } from "youtube-player/dist/types";

const Home: NextPage = () => {
  const historyMax = 20;

  const [videoId, setVideoId] = useState("");
  const [editingId, setEditingId] = useState("");

  let player: YouTubePlayer;

  const handleKeyPress = useCallback((e: any) => {
    if (e.code === "Space") {
      // 1: Playing
      if (player?.getPlayerState() === 1) {
        player?.pauseVideo();
      } else {
        player?.playVideo();
      }
    }
  }, []);

  useEffect(() => {
    const ids = JSON.parse(window.localStorage.getItem("played_ids") || "[]");
    setVideoId(ids[0]);

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const onVideoEnd = (event: { target: YouTubePlayer }) => {
    event.target.seekTo(0, true);
    event.target.playVideo();
  };

  const onVideoReady = (event: { target: YouTubePlayer }) => {
    player = event.target;
  };

  const handleSubmit = (videoId: string) => {
    addToHistory(videoId);
    setVideoId(videoId);
  };

  const handleClickId = (id: string, event: MouseEvent) => {
    const ids = JSON.parse(window.localStorage.getItem("played_ids") || "[]");

    ids.splice(ids.indexOf(id), 1);
    ids.unshift(id);
    window.localStorage.setItem("played_ids", JSON.stringify(ids));

    setVideoId(id);
    event.preventDefault();
  };

  const addToHistory = (id: string) => {
    const ids = JSON.parse(window.localStorage.getItem("played_ids") || "[]");

    if (ids.includes(id)) {
      return;
    }

    if (ids.length >= historyMax) {
      ids.pop();
    }

    ids.unshift(id);
    window.localStorage.setItem("played_ids", JSON.stringify(ids));
  };

  const handleDestoryHistory = (id: string, event: SyntheticEvent) => {
    const ids = JSON.parse(window.localStorage.getItem("played_ids") || "[]");
    const videos = JSON.parse(localStorage.getItem("videos") || "{}") || {};

    const index = ids.indexOf(id);
    if (index === -1) {
      return;
    }

    ids.splice(index, 1);
    window.localStorage.setItem("played_ids", JSON.stringify(ids));
    delete videos[id];
    window.localStorage.setItem("videos", JSON.stringify(videos));
    setVideoId("");
    event.preventDefault();
  };

  const handleEditName = (id: string, event: SyntheticEvent) => {
    setEditingId(id);
    event.preventDefault();
  };

  const handleSaveName = (id: string, event: any) => {
    if (event.key === "Escape") {
      setEditingId("");
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    const videos = JSON.parse(localStorage.getItem("videos") || "{}") || {};
    delete videos[id];
    videos[id] = event.target.value;
    window.localStorage.setItem("videos", JSON.stringify(videos));

    setEditingId("");
    event.preventDefault();
  };

  const videoName = (id: string) => {
    const videos = JSON.parse(localStorage.getItem("videos") || "{}") || {};
    const name = videos[id];

    if (name === undefined) {
      return id;
    } else {
      return name;
    }
  };

  const renderIdList = () => {
    if (typeof window === "undefined") {
      return;
    }

    const ids = JSON.parse(window.localStorage.getItem("played_ids") || "[]");

    const showOrEditId = (id: any) => {
      if (id === editingId) {
        return (
          <Input
            size="mini"
            defaultValue={videoName(id)}
            onKeyPress={(e: any) => handleSaveName(id, e)}
          />
        );
      } else {
        return (
          <List.Content
            floated="left"
            as="a"
            onClick={(e: MouseEvent) => handleClickId(id, e)}
          >
            {videoName(id)}
          </List.Content>
        );
      }
    };

    const listIds = ids.map((id: any) => (
      <List.Item key={id.toString()}>
        {showOrEditId(id)}
        <input name="id" value={id} type="hidden" />
        <List.Content floated="right">
          <Button basic color="blue" onClick={(e) => handleEditName(id, e)}>
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
  };

  return (
    <Container className="app-container">
      <Header as="h2" icon textAlign="center" color="teal">
        <Icon name="play" />
        <Header.Content>YouTube Repeater</Header.Content>
      </Header>
      <Divider hidden section />
      {RepeatForm(handleSubmit)}
      <Divider hidden section />
      <Grid>
        <Grid.Column width={11}>
          <div className="ui embed">
            {videoId && (
              <Youtube
                videoId={videoId}
                onEnd={onVideoEnd}
                onReady={onVideoReady}
                opts={{ playerVars: { autoplay: 1, showinfo: 0 } }}
              />
            )}
          </div>
        </Grid.Column>
        <Grid.Column width={5}>
          <Header size="medium">History</Header>
          {renderIdList()}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Home;
