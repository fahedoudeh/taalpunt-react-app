// src/components/layout/sidebar/UpcomingSidebar.jsx
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
import "./UpcomingSidebar.css";

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

        const lessons =
          lessonsRes.status === "fulfilled" &&
          Array.isArray(lessonsRes.value?.data)
            ? lessonsRes.value.data
            : [];

        const activities =
          activitiesRes.status === "fulfilled" &&
          Array.isArray(activitiesRes.value?.data)
            ? activitiesRes.value.data
            : [];

        const allPosts =
          postsRes.status === "fulfilled" && Array.isArray(postsRes.value?.data)
            ? postsRes.value.data
            : [];

        const communityPosts = allPosts.filter((post) => !post.teachersOnly);

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
          })),
          ...upcomingActivities.map((activity) => ({
            type: "activity",
            id: activity.id,
            title: activity.title || "Activiteit",
            date: activity.date,
            startTime: activity.startTime,
          })),
        ];

        const nextUpcoming = take(combinedUpcoming, 3);
        const latest = take(sortByNewest(communityPosts, "createdAt"), 3);

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
      {/* Card 1: Binnenkort */}
      <div className="sidebar-card">
        <h3 className="sidebar-card__title">Binnenkort</h3>

        {error && <p className="sidebar-card__error">{error}</p>}

        {!error && upcomingItems.length === 0 && (
          <p className="sidebar-card__empty">Geen komende items</p>
        )}

        {!error && upcomingItems.length > 0 && (
          <div className="upcoming-grid">
            {upcomingItems.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                to={
                  item.type === "lesson"
                    ? `/lessons/${item.id}`
                    : `/activities/${item.id}`
                }
                className="upcoming-subcard"
              >
                <span className="upcoming-subcard__badge">
                  {item.type === "lesson" ? "Les" : "Activiteit"}
                </span>
                <span className="upcoming-subcard__title">{item.title}</span>
                {item.date && (
                  <span className="upcoming-subcard__meta">
                    {formatDate(item.date, false)}
                    {item.startTime ? ` • ${item.startTime}` : ""}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Card 2: Laatste Berichten */}
      <div className="sidebar-card">
        <h3 className="sidebar-card__title">Laatste berichten</h3>

        {!error && latestPosts.length === 0 && (
          <p className="sidebar-card__empty">Geen berichten</p>
        )}

        {!error && latestPosts.length > 0 && (
          <div className="berichten-grid">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                to={`/board/${post.id}`}
                className="berichten-subcard"
              >
                <span className="berichten-subcard__title">
                  {post.title || post.subject || "Bericht"}
                </span>
                {post.createdAt && (
                  <span className="berichten-subcard__meta">
                    {formatDate(post.createdAt, true)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
