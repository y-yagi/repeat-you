import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AppHeader from "../components/app-header";

const Import: NextPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState("Hold tight while we import your list…");

  useEffect(() => {
    const { ids, videos } = router.query;
    if (!ids || !videos) {
      return;
    }

    if ((ids as string)?.length === 0 || (videos as string)?.length === 0) {
      setMessage("Input value error. Make sure you pasted the full link.");
      return;
    }

    window.localStorage.setItem("played_ids", decodeURI(ids as string));
    window.localStorage.setItem("videos", decodeURI(videos as string));
    setMessage("Import complete! Resume practicing on the History tab.");
  }, [router.query]);

  return (
    <main className="page-shell">
      <AppHeader description="Copy a shared link to sync history onto this device." />
      <section className="section">
        <div className="card">
          <div className="card__body">
            <p className="card__title">Import status</p>
            <p className="card__hint">We only touch your browser storage.</p>
            <p className="import-message">{message}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Import;
