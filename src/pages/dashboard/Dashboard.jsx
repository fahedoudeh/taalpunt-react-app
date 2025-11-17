// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import OverviewCard from "../../components/dashboard/OverviewCard";
import Loader from "../../components/ui/loader/Loader";
import EmptyState from "../../components/ui/empty/EmptyState";
import ErrorNotice from "../../components/ui/error/ErrorNotice";

import { getLessons } from "../../services/lessonService";
import { getActivities } from "../../services/activityService";
import { getMessages } from "../../services/messageService";
import { getKapelleWeather } from "../../services/weatherService";

import { formatDate } from "../../helpers/formatDate";
import { asArray, take, orText } from "../../helpers/utils";

import { useAuth } from "../../contexts/AuthContext";

import "./Dashboard.css";

// Simple mapping for Open-Meteo weather codes
function describeWeather(code) {
  if (code === undefined || code === null) return "onbekend weer";

  if (code === 0) return "helder";
  if (code === 1 || code === 2) return "gedeeltelijk bewolkt";
  if (code === 3) return "bewolkt";

  if (code === 45 || code === 48) return "mistig";
  if (code === 51 || code === 53 || code === 55) return "motregen";
  if (code === 61 || code === 63 || code === 65) return "regen";
  if (code === 71 || code === 73 || code === 75) return "sneeuw";
  if (code === 80 || code === 81 || code === 82) return "buien";
  if (code === 95) return "onweersbuien";

  return "onbekend weer";
}

// Decide which icon to show
function getWeatherIconType(code) {
  if (code === 0) return "sun";
  if (code === 1 || code === 2 || code === 3) return "cloud";
  if (
    code === 51 ||
    code === 53 ||
    code === 55 ||
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 80 ||
    code === 81 ||
    code === 82
  )
    return "rain";
  if (code === 71 || code === 73 || code === 75) return "snow";
  if (code === 95) return "storm";
  if (code === 45 || code === 48) return "fog";
  return "cloud";
}

// Tiny inline SVG weather icon
function WeatherIcon({ type }) {
  const size = 36;

  if (type === "sun") {
    return (
      <svg
        className="weather-icon"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="10" />
        <line x1="24" y1="4" x2="24" y2="0" />
        <line x1="24" y1="48" x2="24" y2="44" />
        <line x1="4" y1="24" x2="0" y2="24" />
        <line x1="48" y1="24" x2="44" y2="24" />
        <line x1="9" y1="9" x2="5" y2="5" />
        <line x1="39" y1="39" x2="43" y2="43" />
        <line x1="9" y1="39" x2="5" y2="43" />
        <line x1="39" y1="9" x2="43" y2="5" />
      </svg>
    );
  }

  if (type === "rain") {
    return (
      <svg
        className="weather-icon"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path d="M15 30h18a9 9 0 0 0 0-18 11 11 0 0 0-21-2A8 8 0 0 0 15 30z" />
        <line x1="16" y1="32" x2="13" y2="40" />
        <line x1="24" y1="32" x2="21" y2="40" />
        <line x1="32" y1="32" x2="29" y2="40" />
      </svg>
    );
  }

  if (type === "snow") {
    return (
      <svg
        className="weather-icon"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path d="M15 30h18a9 9 0 0 0 0-18 11 11 0 0 0-21-2A8 8 0 0 0 15 30z" />
        <circle cx="16" cy="36" r="2" />
        <circle cx="24" cy="39" r="2" />
        <circle cx="32" cy="36" r="2" />
      </svg>
    );
  }

  if (type === "storm") {
    return (
      <svg
        className="weather-icon"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path d="M15 30h18a9 9 0 0 0 0-18 11 11 0 0 0-21-2A8 8 0 0 0 15 30z" />
        <polyline points="22 32 18 40 24 39 21 46" />
      </svg>
    );
  }

  if (type === "fog") {
    return (
      <svg
        className="weather-icon"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path d="M15 30h18a9 9 0 0 0 0-18 11 11 0 0 0-21-2A8 8 0 0 0 15 30z" />
        <line x1="10" y1="34" x2="38" y2="34" />
        <line x1="12" y1="38" x2="36" y2="38" />
      </svg>
    );
  }

  // default: cloud
  return (
    <svg
      className="weather-icon"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path d="M15 30h18a9 9 0 0 0 0-18 11 11 0 0 0-21-2A8 8 0 0 0 15 30z" />
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  // lessons
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [lessonsErr, setLessonsErr] = useState("");

  // activities
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesErr, setActivitiesErr] = useState("");

  // posts (community + teacher)
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsErr, setPostsErr] = useState("");

  // weather (Kapelle)
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherErr, setWeatherErr] = useState("");

  useEffect(() => {
    // Lessons
    (async () => {
      setLessonsErr("");
      setLessonsLoading(true);
      try {
        const response = await getLessons();
        setLessons(take(asArray(response?.data), 5));
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          setLessonsErr("De server reageert traag. Probeer het zo nog eens.");
        } else {
          setLessonsErr("Kon lessen niet laden.");
        }
        console.error("Lessons error:", error?.response?.data || error.message);
      } finally {
        setLessonsLoading(false);
      }
    })();

    // Activities (backend: /events)
    (async () => {
      setActivitiesErr("");
      setActivitiesLoading(true);
      try {
        const response = await getActivities();
        setActivities(take(asArray(response?.data), 5));
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          setActivitiesErr(
            "De server reageert traag. Probeer het zo nog eens."
          );
        } else {
          setActivitiesErr("Kon activiteiten niet laden.");
        }
        console.error(
          "Activities error:",
          error?.response?.data || error.message
        );
      } finally {
        setActivitiesLoading(false);
      }
    })();

    // Board posts (community + teacher)
    (async () => {
      setPostsErr("");
      setPostsLoading(true);
      try {
        const response = await getMessages();
        // take a few more, we split later
        setPosts(take(asArray(response?.data), 10));
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          setPostsErr("De server reageert traag. Probeer het zo nog eens.");
        } else {
          setPostsErr("Kon berichten niet laden.");
        }
        console.error(
          "Messages error:",
          error?.response?.data || error.message
        );
      } finally {
        setPostsLoading(false);
      }
    })();

    // Weather (Kapelle)
    (async () => {
      setWeatherErr("");
      setWeatherLoading(true);
      try {
        const response = await getKapelleWeather();
        const current = response?.data?.current_weather;
        if (current) {
          setWeather({
            temperature: current.temperature,
            code: current.weathercode,
          });
        } else {
          setWeatherErr("Geen weergegevens beschikbaar.");
        }
      } catch (error) {
        console.error("Weather error:", error?.response?.data || error.message);
        setWeatherErr("Kon het weerbericht niet laden.");
      } finally {
        setWeatherLoading(false);
      }
    })();
  }, []);

  const displayName = user?.username || user?.email || "Taalpunt gebruiker";
  const role = user?.role || null;
  const roles = user?.roles || [];

  // Split posts (if you use teachersOnly flag)
  const communityPosts = posts.filter((post) => !post.teachersOnly);
  const teacherPosts = posts.filter((post) => post.teachersOnly);

  const isTeacher =
    role === "teacher" ||
    role === "docent" ||
    role === "admin" ||
    roles.includes("teacher") ||
    roles.includes("docent") ||
    roles.includes("admin");

  const lessonsCount = lessons.length;
  const activitiesCount = activities.length;

  // Today in Dutch: "donderdag 20 november 2025"
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  const weatherType = weather ? getWeatherIconType(weather.code) : "cloud";

  return (
    <div className="dashboard">
      {/* Hero / welcome section */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-left">
          <p className="dashboard-hero-label">
            {isTeacher ? "Welkom terug, docent 👋" : "Welkom terug 👋"}
          </p>

          <h1 className="dashboard-hero-title">
            {displayName}
            {role && (
              <span className="dashboard-role-pill">
                {isTeacher
                  ? role === "admin"
                    ? "Admin"
                    : "Docent"
                  : "Cursist"}
              </span>
            )}
          </h1>

          <p className="dashboard-hero-subtitle">
            Overzicht van je lessen, activiteiten en het Taalpunt board.
          </p>

          <p className="dashboard-hero-meta">
            Vandaag heb je{" "}
            <strong>
              {lessonsCount} {lessonsCount === 1 ? "les" : "lessen"}
            </strong>{" "}
            en{" "}
            <strong>
              {activitiesCount}{" "}
              {activitiesCount === 1 ? "activiteit" : "activiteiten"}
            </strong>{" "}
            in Taalpunt.
          </p>
        </div>

        <div className="dashboard-hero-right">
          <div className="dashboard-date-card">
            <span className="dashboard-date-label">Vandaag</span>
            <span className="dashboard-date-value">{formattedDate}</span>
          </div>

          <div className="dashboard-weather-card">
            <div className="dashboard-weather-header">
              <span className="dashboard-weather-location">Kapelle</span>
              <span className="dashboard-weather-label">Weer nu</span>
            </div>

            {weatherLoading && (
              <p className="dashboard-weather-text">Weer laden…</p>
            )}

            {!weatherLoading && weatherErr && (
              <p className="dashboard-weather-text dashboard-weather-text--error">
                {weatherErr}
              </p>
            )}

            {!weatherLoading && weather && !weatherErr && (
              <div className="dashboard-weather-main">
                <WeatherIcon type={weatherType} />
                <div className="dashboard-weather-info">
                  <span className="dashboard-weather-temp">
                    {Math.round(weather.temperature)}°C
                  </span>
                  <span className="dashboard-weather-desc">
                    {describeWeather(weather.code)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="dashboard-grid">
        {/* Lessons */}
        <OverviewCard title="Aankomende lessen" moreTo="/lessons">
          {lessonsLoading && <Loader label="Lessen laden…" />}
          {!lessonsLoading && lessonsErr && (
            <ErrorNotice message={lessonsErr} />
          )}
          {!lessonsLoading && !lessonsErr && lessons.length === 0 && (
            <EmptyState
              title="Nog geen lessen"
              actionLabel="Ga naar lessen"
              to="/lessons"
            />
          )}
          {!lessonsLoading && !lessonsErr && lessons.length > 0 && (
            <ul aria-label="Lessenlijst">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link to={`/lessons/${lesson.id}`}>
                    {orText(lesson.title, "Les")}
                    {lesson.date ? ` — ${formatDate(lesson.date, false)}` : ""}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </OverviewCard>

        {/* Activities */}
        <OverviewCard title="Activiteiten" moreTo="/activities">
          {activitiesLoading && <Loader label="Activiteiten laden…" />}
          {!activitiesLoading && activitiesErr && (
            <ErrorNotice message={activitiesErr} />
          )}
          {!activitiesLoading && !activitiesErr && activities.length === 0 && (
            <EmptyState
              title="Nog geen activiteiten"
              actionLabel="Bekijk activiteiten"
              to="/activities"
            />
          )}
          {!activitiesLoading && !activitiesErr && activities.length > 0 && (
            <ul aria-label="Activiteitenlijst">
              {activities.map((activity) => (
                <li key={activity.id}>
                  <Link to={`/activities/${activity.id}`}>
                    {orText(activity.title, "Activiteit")}
                    {activity.date
                      ? ` — ${formatDate(activity.date, false)}`
                      : ""}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </OverviewCard>

        {/* Community Board posts */}
        <OverviewCard title="Board berichten" moreTo="/board">
          {postsLoading && <Loader label="Berichten laden…" />}
          {!postsLoading && postsErr && <ErrorNotice message={postsErr} />}
          {!postsLoading && !postsErr && communityPosts.length === 0 && (
            <EmptyState
              title="Nog geen berichten"
              actionLabel="Bekijk board"
              to="/board"
            />
          )}
          {!postsLoading && !postsErr && communityPosts.length > 0 && (
            <ul aria-label="Berichtenlijst">
              {take(communityPosts, 5).map((post) => (
                <li key={post.id}>
                  <Link to={`/board/${post.id}`}>
                    {orText(post.title ?? post.subject, "Bericht")}
                    {post.date ? ` — ${formatDate(post.date, false)}` : ""}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </OverviewCard>

        {/* Teacher Board preview – only for teachers/admin */}
        {isTeacher && (
          <OverviewCard title="Docentenboard" moreTo="/teachers-board">
            {postsLoading && <Loader label="Berichten laden…" />}
            {!postsLoading && postsErr && <ErrorNotice message={postsErr} />}
            {!postsLoading && !postsErr && teacherPosts.length === 0 && (
              <EmptyState
                title="Nog geen docentenberichten"
                actionLabel="Naar docentenboard"
                to="/teachers-board"
              />
            )}
            {!postsLoading && !postsErr && teacherPosts.length > 0 && (
              <ul aria-label="Docentenberichtenlijst">
                {take(teacherPosts, 5).map((post) => (
                  <li key={post.id}>
                    <Link to="/teachers-board">
                      {orText(post.title ?? post.subject, "Bericht")}
                      {post.date ? ` — ${formatDate(post.date, false)}` : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </OverviewCard>
        )}
      </section>
    </div>
  );
}
