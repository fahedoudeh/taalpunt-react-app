// src/pages/board/MessageDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import { getMessageById } from "../../services/messageService";
import { formatDate } from "../../helpers/formatDate";

export default function MessageDetail() {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await getMessageById(id);
        setMessage(res?.data ?? null);
      } catch (e) {
        if (e.code === "ECONNABORTED")
          setErr("De server reageert traag. Probeer het zo nog eens.");
        else setErr("Kon bericht niet laden.");
        console.error("MessageDetail error:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader label="Bericht laden…" />;
  if (err) return <ErrorNotice message={err} />;
  if (!message) return <ErrorNotice message="Bericht niet gevonden." />;

  return (
    <article className="message-detail">
      <header>
        <h1>{message.title ?? message.subject ?? "Bericht"}</h1>
        {message.date && <p className="muted">{formatDate(message.date)}</p>}
      </header>
      <section>
        <p>{message.body ?? message.content ?? "—"}</p>
      </section>
      <footer style={{ marginTop: "1rem" }}>
        <Link to="/board">← Terug naar board</Link>
      </footer>
    </article>
  );
}
