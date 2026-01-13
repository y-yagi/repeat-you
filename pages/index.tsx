import type { NextPage } from "next";
import {
  useEffect,
  useState,
  useCallback,
  SyntheticEvent,
  useRef,
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Youtube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";
import AppHeader from "../components/app-header";
import RepeatForm from "../components/repeat-form";

const Home: NextPage = () => {
  const historyMax = 20;

  const [videoId, setVideoId] = useState("");
  const [editingId, setEditingId] = useState("");

  const playerRef = useRef<YouTubePlayer | null>(null);

  const handleKeyPress = useCallback(async (e: KeyboardEvent) => {
    if (e.code !== "Space") {
      return;
    }

    const state = await playerRef.current?.getPlayerState();

    if (state === 1) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
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
    playerRef.current = event.target;
  };

  const handleSubmit = (videoId: string) => {
    addToHistory(videoId);
    setVideoId(videoId);
  };

  const handleClickId = (
    id: string,
    event: ReactMouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
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

  const handleSaveName = (
    id: string,
    event: ReactKeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      setEditingId("");
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

  const videos = JSON.parse(localStorage.getItem("videos") || "{}") || {};
  delete videos[id];
  videos[id] = event.currentTarget.value;
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

    if (!ids.length) {
      return <p className="history-empty">No videos saved yet.</p>;
    }

    return (
      <ul className="history-list">
        {ids.map((id: string) => (
          <li key={id} className="history-row">
            <div className="history-name">
              {id === editingId ? (
                <input
                  className="history-edit-input"
                  defaultValue={videoName(id)}
                  onKeyDown={(e) => handleSaveName(id, e)}
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  className="link-button"
                  onClick={(e) => handleClickId(id, e)}
                >
                  {videoName(id)}
                </button>
              )}
            </div>
            <div className="history-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={(e) => handleEditName(id, e)}
              >
                Edit
              </button>
              <a
                className="ghost-button"
                href={`https://www.youtube.com/watch?v=${id}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Goto
              </a>
              <button
                type="button"
                className="danger-button"
                onClick={(e) => handleDestoryHistory(id, e)}
              >
                Destroy
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main className="page-shell">
      <AppHeader />
      <section className="section">
        <RepeatForm onSubmit={handleSubmit} />
      </section>
      <section className="content-grid">
        <div className="video-panel">
          <div className="panel-header">
            <p className="panel-title">Player</p>
            <p className="panel-hint">Press Space to toggle play/pause</p>
          </div>
          <div className="video-frame">
            {videoId ? (
              <Youtube
                videoId={videoId}
                onEnd={onVideoEnd}
                onReady={onVideoReady}
                opts={{ playerVars: { autoplay: 1 } }}
              />
            ) : (
              <div className="video-placeholder">
                Enter a video ID to start looping it automatically.
              </div>
            )}
          </div>
        </div>
        <div className="history-panel">
          <div className="panel-header">
            <p className="panel-title">History</p>
            <p className="panel-hint">Saved locally on this device</p>
          </div>
          {renderIdList()}
        </div>
      </section>
    </main>
  );
};

export default Home;
