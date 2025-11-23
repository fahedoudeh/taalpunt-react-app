// src/pages/activityDetail/ActivityDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getActivities } from "../../services/activityService";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import { formatDate } from "../../helpers/formatDate";
import "./ActivityDetail.css";

export default function ActivityDetail() {
  const { id } = useParams();
  const numericId = Number(id);

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await getActivities();
        const list = Array.isArray(res?.data) ? res.data : [];
        const found = list.find((item) => Number(item.id) === numericId);

        if (!found) {
          setErr("Activiteit niet gevonden.");
        } else {
          setActivity(found);
        }
      } catch (e) {
        if (e.code === "ECONNABORTED") {
          setErr("De server reageert traag. Probeer het zo nog eens.");
        } else {
          setErr("Kon activiteit niet laden.");
        }
        console.error("Activity detail error:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [numericId]);

  if (loading) {
    return <Loader label="Activiteit laden..." />;
  }

  if (err) {
    return (
      <div className="activity-detail-page">
        <ErrorNotice message={err} />
        <p className="activity-meta-text">
          <Link to="/activities">Terug naar activiteiten</Link>
        </p>
      </div>
    );
  }

  if (!activity) return null;

  return (
    <div className="activity-detail-page">
      <article className="activity-detail-card">
        <header className="activity-detail-header">
          <p className="activity-detail-date">
            {activity.date
              ? formatDate(activity.date, false)
              : "Datum nog niet bekend"}
          </p>
          <h1 className="activity-detail-title">{activity.title}</h1>
          <p className="activity-detail-meta">
            {activity.location && <span>📍 {activity.location}</span>}
            {activity.startTime && activity.endTime && (
              <span>
                🕒 {activity.startTime}–{activity.endTime}
              </span>
            )}
            {activity.type && <span>🏷️ {activity.type}</span>}
          </p>
        </header>

        {activity.description && (
          <section className="activity-detail-body">
            <p>{activity.description}</p>
          </section>
        )}

        <footer className="activity-detail-footer">
          <Link to="/activities" className="activity-detail-backlink">
            ← Terug naar alle activiteiten
          </Link>
        </footer>
      </article>
    </div>
  );
}
