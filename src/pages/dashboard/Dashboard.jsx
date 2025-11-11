import { useEffect, useState } from "react";
import { getActivities } from "../../services/activityService";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);
      try {
        //shared api client adds headers/token/timeout
        const { data } = await getActivities();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        // timeout-friendly message
        if (e.code === "ECONNABORTED") {
          setError("De server reageert traag. Probeer het zo nog eens.");
        } else if (e?.response?.status === 403 || e?.response?.status === 401) {
          setError("Geen toegang (403/401). Log in of controleer je rol.");
        } else {
          setError("Kon activiteiten niet laden.");
        }
        console.error("Activities error:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Laden…</div>;
  if (error)
    return <div style={{ padding: 16, color: "crimson" }}>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>
      <ul>
        {items.map((a) => (
          <li key={a.id}>{a.title || a.name || `Activity #${a.id}`}</li>
        ))}
      </ul>
      {!items.length && <p>Geen activiteiten gevonden.</p>}
    </div>
  );
}
