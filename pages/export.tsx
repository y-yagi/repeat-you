import type { NextPage } from "next";
import { useState } from "react";
import AppHeader from "../components/app-header";

const Export: NextPage = () => {
  const [url, setUrl] = useState("");

  const generateURL = () => {
    if (typeof window === "undefined") {
      return;
    }

    const ids = encodeURI(window.localStorage.getItem("played_ids") || "[]");
    const videos = encodeURI(window.localStorage.getItem("videos") || "{}");
    setUrl(`${window.location.origin}/import?ids=${ids}&videos=${videos}`);
  };

  return (
    <main className="page-shell">
      <AppHeader description="Share your looping list with another device." />
      <section className="section">
        <div className="card">
          <div className="card__body">
            <p className="card__title">Generate import link</p>
            <p className="card__hint">
              We keep everything on your device. Generate a URL that copies your
              local history into another browser.
            </p>
            <div className="export-actions">
              <button className="primary-button" onClick={generateURL}>
                Generate
              </button>
              <input
                className="export-input"
                type="text"
                readOnly
                value={url}
                placeholder="Your link will appear here"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Export;
