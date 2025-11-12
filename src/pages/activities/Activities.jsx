import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadActivities() {
      const API = import.meta.env.VITE_API_URL;
      const PROJECT_ID = import.meta.env.VITE_NOVI_PROJECT_ID;
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Niet ingelogd. Log in om activiteiten te zien.");
        return;
      }

      try {
        const res = await axios.get(`${API}/events`, {
          headers: {
            "Content-Type": "application/json",
            "novi-education-project-id": PROJECT_ID,
            Authorization: `Bearer ${token}`,
          },
        });
        setActivities(res.data);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 403 || status === 401) {
          setError("Geen toegang (403/401). Controleer je rol of login.");
        } else {
          setError("Kon activiteiten niet laden.");
        }
        console.error("Activities error:", err?.response?.data || err.message);
      }
    }
    loadActivities();
  }, []);

  if (error) return <div style={{ padding: 16 }}>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>
      <ul>
        {activities.map((a) => (
          <li key={a.id}>{a.title || a.name || `Activity #${a.id}`}</li>
        ))}
      </ul>
      {!activities.length && !error && <p>Geen activiteiten gevonden.</p>}
    </div>
  );
}
