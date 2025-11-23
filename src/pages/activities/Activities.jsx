import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getActivities } from "../../services/activityService";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import EmptyState from "../../components/ui/empty/EmptyState";
import { formatDate } from "../../helpers/formatDate";
import { asArray } from "../../helpers/utils";
import { Calendar, Clock, MapPin } from "lucide-react";
import "./Activities.css";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await getActivities();
        setActivities(asArray(res?.data));
      } catch (e) {
        if (e.code === "ECONNABORTED") {
          setErr("De server reageert traag. Probeer het zo nog eens.");
        } else {
          setErr("Kon activiteiten niet laden.");
        }
        console.error("Activities list error:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader label="Activiteiten laden..." />;
  if (err) return <ErrorNotice message={err} />;
  if (!activities.length) {
    return (
      <div className="activities-page">
        <EmptyState
          title="Nog geen activiteiten"
          message="Zodra er activiteiten zijn gepland, verschijnen ze hier."
        />
      </div>
    );
  }

  return (
    <div className="activities-page">
      <header className="activities-header">
        <h1>Activiteiten</h1>
        <p>
          Bijeenkomsten, koffiemomenten en extra taalactiviteiten van Taalpunt
          Kapelle.
        </p>
      </header>

      <div className="activities-grid">
        {activities.map((activity) => (
          <Link
            key={activity.id}
            to={`/activities/${activity.id}`}
            className="activity-card"
          >
            <div className="activity-card__header">
              <h3 className="activity-card__title">
                {activity.title || "Activiteit"}
              </h3>
            </div>

            <div className="activity-card__meta">
              <div className="activity-card__meta-item">
                <Calendar size={16} />
                <span>
                  {activity.date
                    ? formatDate(activity.date, false)
                    : "Datum volgt"}
                </span>
              </div>

              {activity.startTime && (
                <div className="activity-card__meta-item">
                  <Clock size={16} />
                  <span>
                    {activity.startTime}
                    {activity.endTime ? ` - ${activity.endTime}` : ""}
                  </span>
                </div>
              )}

              {activity.location && (
                <div className="activity-card__meta-item">
                  <MapPin size={16} />
                  <span>{activity.location}</span>
                </div>
              )}
            </div>

            {activity.description && (
              <p className="activity-card__description">
                {activity.description.length > 120
                  ? `${activity.description.substring(0, 120)}...`
                  : activity.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
