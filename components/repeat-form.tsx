import type { FC, FormEvent } from "react";
import { useState } from "react";

interface RepeatFormProps {
  onSubmit: (videoId: string) => void;
}

const RepeatForm: FC<RepeatFormProps> = ({ onSubmit }) => {
  const [videoId, setVideoId] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = videoId.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setVideoId("");
  };

  return (
    <form className="repeat-form" onSubmit={handleSubmit}>
      <input
        className="repeat-form__input"
        name="videoId"
        placeholder="Enter a YouTube video ID"
        onChange={(e) => setVideoId(e.target.value)}
        value={videoId}
        required
        autoComplete="off"
      />
      <button
        className="primary-button"
        type="submit"
        disabled={videoId.trim().length === 0}
      >
        Play
      </button>
    </form>
  );
};

export default RepeatForm;
