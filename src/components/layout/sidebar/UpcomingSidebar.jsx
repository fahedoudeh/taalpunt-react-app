// src/components/layout/sidebar/UpcomingSidebar.jsx
import { useEffect, useState } from "react";
import { getLessons } from "../../../services/lessonService";
import { getActivities } from "../../../services/activityService";
import { getUpcomingByDate } from "../../../helpers/utils";
import { formatDate } from "../../../helpers/formatDate";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function UpcomingSidebar() {
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsErr, setLessonsErr] = useState("");

  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesErr, setActivitiesErr] = useState("");

  useEffect(() => {
    // Lessons
    (async () => {
      setLessonsErr("");
      setLessonsLoading(true);
      try {
        const res = await getLessons();
        const list = Array.isArray(res?.data) ? res.data : [];
        setLessons(getUpcomingByDate(list, "date", 3));
      } catch (e) {
        if (e.code === "ECONNABORTED") {
          setLessonsErr("De server reageert traag. Probeer het zo nog eens.");
        } else {
          setLessonsErr("Kon lessen niet laden.");
        }
        console.error(
          "Upcoming lessons error:",
          e?.response?.data || e.message
        );
      } finally {
        setLessonsLoading(false);
      }
    })();

    // Activities
    (async () => {
      setActivitiesErr("");
      setActivitiesLoading(true);
      try {
        const res = await getActivities();
        const list = Array.isArray(res?.data) ? res.data : [];
        setActivities(getUpcomingByDate(list, "date", 3));
      } catch (e) {
        if (e.code === "ECONNABORTED") {
          setActivitiesErr(
            "De server reageert traag. Probeer het zo nog eens."
          );
        } else {
          setActivitiesErr("Kon activiteiten niet laden.");
        }
        console.error(
          "Upcoming activities error:",
          e?.response?.data || e.message
        );
      } finally {
        setActivitiesLoading(false);
      }
    })();
  }, []);

  return (
    <section className="side__section">
      <h3 className="side__title">Binnenkort</h3>

      {/* Lessen */}
      <div className="side__card" style={{ marginBottom: ".5rem" }}>
        <div className="side__word">Lessen</div>
        {lessonsLoading && <div className="side__muted">Laden…</div>}
        {lessonsErr && <div className="side__muted">{lessonsErr}</div>}
        {!lessonsLoading && !lessonsErr && (
          <ul className="side__list">
            {lessons.length === 0 && (
              <li className="side__muted">Geen aankomende lessen</li>
            )}
            {lessons.map((l) => (
              <li key={l.id}>
                <Link className="side__link" to={`/lessons/${l.id}`}>
                  {l.title ?? "Les"} — {formatDate(l.date, false)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Activiteiten */}
      <div className="side__card">
        <div className="side__word">Activiteiten</div>
        {activitiesLoading && <div className="side__muted">Laden…</div>}
        {activitiesErr && <div className="side__muted">{activitiesErr}</div>}
        {!activitiesLoading && !activitiesErr && (
          <ul className="side__list">
            {activities.length === 0 && (
              <li className="side__muted">Geen aankomende activiteiten</li>
            )}
            {activities.map((a) => (
              <li key={a.id}>
                <Link className="side__link" to={`/activities/${a.id}`}>
                  {a.title ?? "Activiteit"} — {formatDate(a.date, false)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
