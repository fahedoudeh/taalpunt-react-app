import { useEffect, useState } from "react";
import { getMessages } from "../../services/messageService";

export default function Board() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);
      try {
        // api client adds headers/token/timeout
        const { data } = await getMessages();
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.code === "ECONNABORTED") {
          setError("De server reageert traag. Probeer het zo nog eens.");
        } else if (e?.response?.status === 403 || e?.response?.status === 401) {
          setError("Geen toegang (403/401). Log in of controleer je rol.");
        } else {
          setError("Kon berichten niet laden.");
        }
        console.error("Messages error:", e?.response?.data || e.message);
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
      <h2>Berichten</h2>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>{m.title || m.content || `Bericht #${m.id}`}</li>
        ))}
      </ul>
      {!messages.length && <p>Geen berichten gevonden.</p>}
    </div>
  );
}
