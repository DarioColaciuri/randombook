import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, onSnapshot } from "firebase/firestore";
import "./CSS/Podium.css";

const Podium = () => {
  const [podiumData, setPodiumData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "canciones"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const songsList = querySnapshot.docs.map((doc) => doc.data());

      const completedSongs = songsList.filter(song => song.status === "complete");

      const transcriptionCounts = completedSongs.reduce((acc, song) => {
        const { transcription } = song;
        acc[transcription] = (acc[transcription] || 0) + 1;
        return acc;
      }, {});

      const sortedTranscriptions = Object.entries(transcriptionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3); 

      setPodiumData(sortedTranscriptions);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <h1>Podio</h1>
      <div className="podium">
        <div className="podium-item gold">
          <h2><i className="bi bi-emoji-smile-fill"></i><i title="vas bien" className="ok bi bi-cake2"></i></h2>
          {podiumData[0] && (
            <>
              <h3>{podiumData[0][0]}</h3>
              <p>{podiumData[0][1]}</p>
            </>
          )}
        </div>
        <div className="podium-item silver">
          <h2><i className="bi bi-emoji-neutral-fill"></i></h2>
          {podiumData[1] && (
            <>
              <h3>{podiumData[1][0]}</h3>
              <p>{podiumData[1][1]}</p>
            </>
          )}
        </div>
        <div className="podium-item bronze">
          <h2><i className="bi bi-emoji-frown-fill"></i><i title="ponete las pilas" className="warn bi bi-exclamation-triangle"></i></h2>
          {podiumData[2] && (
            <>
              <h3>{podiumData[2][0]}</h3>
              <p>{podiumData[2][1]}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Podium;