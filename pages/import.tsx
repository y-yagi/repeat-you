import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Header, Icon, Divider } from "semantic-ui-react";

const Import: NextPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const { ids, videos } = router.query;
    if (ids?.length === 0 || videos?.length === 0) {
      setMessage("input value error");
      return;
    }

    window.localStorage.setItem("played_ids", decodeURI(ids as string));
    window.localStorage.setItem("videos", decodeURI(videos as string));
    setMessage("import finish");
  }, [router.query]);

  return (
    <Container className="app-container">
      <Header as="h2" icon textAlign="center" color="teal">
        <Icon name="play" />
        <Header.Content>YouTube Repeater</Header.Content>
      </Header>
      <Divider hidden section />
      <div className="ui input">
        <p>{message}</p>
      </div>
    </Container>
  );
};

export default Import;
