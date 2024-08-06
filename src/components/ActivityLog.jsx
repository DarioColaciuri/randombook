import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import "./CSS/ActivityLog.css";

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "text"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logsList = querySnapshot.docs.map((doc) => doc.data().message);
      setLogs(logsList);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="logs-container">
      <div className="logs">
        {logs.map((log, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: log }} />
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;