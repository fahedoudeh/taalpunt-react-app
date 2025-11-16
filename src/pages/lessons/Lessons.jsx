import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLessons } from "../../services/lessonService";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import EmptyState from "../../components/ui/empty/EmptyState";
import { formatDate } from "../../helpers/formatDate";
import "./Lessons.css";

export default function Lessons() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await getLessons();
        const list = Array.isArray(res?.data) ? res.data : [];
        setItems(list);
      } catch (e) {
        if (e.code === "ECONNABORTED")
          setErr("De server reageert traag. Probeer het zo nog eens.");
        else setErr("Kon lessen niet laden.");
        console.error("Lessons error:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (err) return <ErrorNotice message={err} />;
  if (items.length === 0) return <EmptyState message="Geen lessen gevonden." />;

  return (
    <section className="lessons">
      <h1 className="lessons__title">Lessen</h1>
      <ul className="lessons__list">
        {items.map((l) => (
          <li key={l.id} className="lessons__item">
            <Link className="lessons__link" to={`/lessons/${l.id}`}>
              <span className="lessons__name">{l.title ?? "Les"}</span>
              <span className="lessons__date">{formatDate(l.date, false)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
