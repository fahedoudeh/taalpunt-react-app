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

import { formatDate } from "../../helpers/formatDate";
import { asArray, take, orText } from "../../helpers/utils";

export default function Dashboard() {
  // lessons
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [lessonsErr, setLessonsErr] = useState("");

  // activities
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesErr, setActivitiesErr] = useState("");

  // posts
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsErr, setPostsErr] = useState("");

  useEffect(() => {
    // Lessons
    (async () => {
      setLessonsErr("");
      setLessonsLoading(true);
      try {
        const response = await getLessons();
        setLessons(take(asArray(response?.data), 5));
      } catch (error) {
        if (error.code === "ECONNABORTED")
          setLessonsErr("De server reageert traag. Probeer het zo nog eens.");
        else setLessonsErr("Kon lessen niet laden.");
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
        if (error.code === "ECONNABORTED")
          setActivitiesErr(
            "De server reageert traag. Probeer het zo nog eens."
          );
        else setActivitiesErr("Kon activiteiten niet laden.");
        console.error(
          "Activities error:",
          error?.response?.data || error.message
        );
      } finally {
        setActivitiesLoading(false);
      }
    })();

    // Board posts
    (async () => {
      setPostsErr("");
      setPostsLoading(true);
      try {
        const response = await getMessages();
        setPosts(take(asArray(response?.data), 5));
      } catch (error) {
        if (error.code === "ECONNABORTED")
          setPostsErr("De server reageert traag. Probeer het zo nog eens.");
        else setPostsErr("Kon berichten niet laden.");
        console.error(
          "Messages error:",
          error?.response?.data || error.message
        );
      } finally {
        setPostsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="dashboard">
      {/* Lessons */}
      <OverviewCard title="Aankomende lessen" moreTo="/lessons">
        {lessonsLoading && <Loader label="Lessen laden…" />}
        {!lessonsLoading && lessonsErr && <ErrorNotice message={lessonsErr} />}
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

      {/* Board posts */}
      <OverviewCard title="Board berichten" moreTo="/board">
        {postsLoading && <Loader label="Berichten laden…" />}
        {!postsLoading && postsErr && <ErrorNotice message={postsErr} />}
        {!postsLoading && !postsErr && posts.length === 0 && (
          <EmptyState
            title="Nog geen berichten"
            actionLabel="Bekijk board"
            to="/board"
          />
        )}
        {!postsLoading && !postsErr && posts.length > 0 && (
          <ul aria-label="Berichtenlijst">
            {posts.map((post) => (
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
    </div>
  );
}
