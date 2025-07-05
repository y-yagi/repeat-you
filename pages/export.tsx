import type { NextPage } from "next";
import { useState } from "react";
import { Container, Header, Icon, Divider, Button } from "semantic-ui-react";

const Export: NextPage = () => {
  const [url, setUrl] = useState("");

  const generateURL = () => {
    if (typeof window === undefined) {
      return;
    }

    const ids = encodeURI(window.localStorage.getItem("played_ids") || "[]");
    const videos = encodeURI(window.localStorage.getItem("videos") || "{}");
    setUrl(`${window.location.origin}/import?ids=${ids}&videos=${videos}`);
  };

  return (
    <Container className="app-container">
      <Header as="h2" icon textAlign="center" color="teal">
        <Icon name="play" />
        <Header.Content>YouTube Repeater</Header.Content>
      </Header>
      <Divider hidden section />
      <Button basic color="blue" onClick={() => generateURL()}>
        Generate
      </Button>
      <div className="ui large input">
        <input type="text" readOnly value={url} style={{ width: "100%" }} />
      </div>
    </Container>
  );
};

export default Export;
