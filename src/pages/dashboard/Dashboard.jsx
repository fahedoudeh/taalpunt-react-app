// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL; // e.g. https://.../api
    const PROJECT_ID = import.meta.env.VITE_NOVI_PROJECT_ID;
    const token = localStorage.getItem("token"); // we don’t have login yet → likely null

    axios
      .get(`${API}/events`, {
        headers: {
          "Content-Type": "application/json",
          "novi-education-project-id": PROJECT_ID,
          // add Authorization only if you already have a token (Phase 1 will give you one)
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      .then((res) => setActivities(res.data))
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          setError("Geen toegang (401/403). Log in om activiteiten te zien.");
        } else {
          setError("Kon activiteiten niet laden.");
        }
        console.error("Activities error:", err?.response?.data || err.message);
      });
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
