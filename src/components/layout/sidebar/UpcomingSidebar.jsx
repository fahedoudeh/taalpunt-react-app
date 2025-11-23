import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getLessons } from "../../../services/lessonService";
import { getActivities } from "../../../services/activityService";
import { getMessages } from "../../../services/messageService";
import {
  sortByNewest,
  sortByUpcomingDateTime,
  take,
} from "../../../helpers/utils";
import { formatDate } from "../../../helpers/formatDate";

export default function UpcomingSidebar() {
  const [upcomingItems, setUpcomingItems] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function fetchSidebarData() {
      setError("");

      try {
        const [lessonsRes, activitiesRes, postsRes] = await Promise.allSettled([
          getLessons(),
          getActivities(),
          getMessages(),
        ]);

        // Lessons
        const lessons =
          lessonsRes.status === "fulfilled" &&
          Array.isArray(lessonsRes.value?.data)
            ? lessonsRes.value.data
            : [];

        // Activities
        const activities =
          activitiesRes.status === "fulfilled" &&
          Array.isArray(activitiesRes.value?.data)
            ? activitiesRes.value.data
            : [];

        // Posts (community only: no teachersOnly)
        const allPosts =
          postsRes.status === "fulfilled" && Array.isArray(postsRes.value?.data)
            ? postsRes.value.data
            : [];

        const communityPosts = allPosts.filter((post) => !post.teachersOnly);

        // Build upcoming list (lessons + activities) → soonest first
        const upcomingLessons = sortByUpcomingDateTime(
          lessons,
          "date",
          "startTime"
        );
        const upcomingActivities = sortByUpcomingDateTime(
          activities,
          "date",
          "startTime"
        );

        const combinedUpcoming = [
          ...upcomingLessons.map((lesson) => ({
            type: "lesson",
            id: lesson.id,
            title: lesson.title || "Les",
            date: lesson.date,
            startTime: lesson.startTime,
            location: lesson.location,
          })),
          ...upcomingActivities.map((activity) => ({
            type: "activity",
            id: activity.id,
            title: activity.title || "Activiteit",
            date: activity.date,
            startTime: activity.startTime,
            location: activity.location,
          })),
        ];

        // Only keep the next 4 upcoming items
        const nextUpcoming = take(combinedUpcoming, 4);

        // Latest 4 community posts, newest first
        const latest = take(sortByNewest(communityPosts, "createdAt"), 4);

        if (!isCancelled) {
          setUpcomingItems(nextUpcoming);
          setLatestPosts(latest);
        }
      } catch (e) {
        console.error("UpcomingSidebar error:", e?.response?.data || e.message);
        if (!isCancelled) {
          setError("Kon zijbalk-gegevens niet laden.");
        }
      }
    }

    fetchSidebarData();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      {/* Binnenkort: komende lessen + activiteiten */}
      <section className="side__section">
        <h3 className="side__title">Binnenkort</h3>
        {error && (
          <p style={{ fontSize: "0.8rem", color: "#b91c1c", margin: 0 }}>
            {error}
          </p>
        )}

        {!error && upcomingItems.length === 0 && (
          <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: 0 }}>
            Geen komende lessen of activiteiten.
          </p>
        )}

        {!error && upcomingItems.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {upcomingItems.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                style={{
                  fontSize: "0.82rem",
                  marginBottom: "0.25rem",
                  color: "#111827",
                }}
              >
                <Link
                  to={
                    item.type === "lesson"
                      ? `/lessons/${item.id}`
                      : `/activities/${item.id}`
                  }
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      marginRight: "0.25rem",
                    }}
                  >
                    {item.type === "lesson" ? "Les:" : "Activiteit:"}
                  </span>
                  {item.title}
                  {item.date && (
                    <span style={{ display: "block", color: "#6b7280" }}>
                      {formatDate(item.date, false)}
                      {item.startTime ? ` • ${item.startTime}` : ""}
                    </span>
                  )}
                  {item.location && (
                    <span style={{ display: "block", color: "#9ca3af" }}>
                      {item.location}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Laatste berichten: laatste community board posts */}
      <section className="side__section">
        <h3 className="side__title">Laatste berichten</h3>

        {!error && latestPosts.length === 0 && (
          <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: 0 }}>
            Nog geen berichten op het board.
          </p>
        )}

        {!error && latestPosts.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {latestPosts.map((post) => (
              <li
                key={post.id}
                style={{
                  fontSize: "0.82rem",
                  marginBottom: "0.25rem",
                  color: "#111827",
                }}
              >
                <Link
                  to="/board"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {post.title || post.subject || "Bericht"}
                  </span>
                  {post.createdAt && (
                    <span style={{ display: "block", color: "#6b7280" }}>
                      {formatDate(post.createdAt, true)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
