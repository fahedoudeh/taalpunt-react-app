import { useEffect, useState } from "react";
import { getLessons } from "../../services/lessonService";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);
      try {
        // service client adds headers/token/timeout automatically
        const { data } = await getLessons();
        setLessons(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.code === "ECONNABORTED") {
          setError("De server reageert traag. Probeer het zo nog eens.");
        } else if (e?.response?.status === 403 || e?.response?.status === 401) {
          setError("Geen toegang (403/401). Log in of controleer je rol.");
        } else {
          setError("Kon lessen niet laden.");
        }
        console.error("Lessons error:", e?.response?.data || e.message);
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
      <h2>Lessen</h2>
      <ul>
        {lessons.map((l) => (
          <li key={l.id}>{l.title || `Les #${l.id}`}</li>
        ))}
      </ul>
      {!lessons.length && <p>Geen lessen gevonden.</p>}
    </div>
  );
}
