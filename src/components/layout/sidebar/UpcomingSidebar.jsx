import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLessons } from "../../../services/lessonService";
import { getMessages } from "../../../services/messageService";
import { sortByNewest } from "../../../helpers/utils";
import { formatDate } from "../../../helpers/formatDate";

export default function UpcomingSidebar() {
  const [lessons, setLessons] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lessonsRes, messagesRes] = await Promise.all([
        getLessons(),
        getMessages(),
      ]);

      const allLessons = lessonsRes?.data || [];
      const allMessages = messagesRes?.data || [];

      setLessons(sortByNewest(allLessons.slice(0, 3), "date"));
      setMessages(sortByNewest(allMessages.slice(0, 3)));
    } catch (err) {
      console.error("Sidebar fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* LESSONS CARD - BLUE BORDER */}
      <div className="sidebar-card sidebar-card--lessons">
        <h3 className="sidebar-card__title">Binnenkort</h3>
        {loading ? (
          <p className="sidebar-card__empty">Laden...</p>
        ) : lessons.length === 0 ? (
          <p className="sidebar-card__empty">Geen aankomende lessen</p>
        ) : (
          <ul className="sidebar-list">
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="sidebar-list-item sidebar-list-item--orange"
              >
                <Link
                  to={`/lessons/${lesson.id}`}
                  className="sidebar-list-link"
                >
                  <span className="sidebar-list-title">{lesson.title}</span>
                  <span className="sidebar-list-meta">
                    {formatDate(lesson.date, false)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MESSAGES CARD - ORANGE BORDER */}
      <div className="sidebar-card sidebar-card--messages">
        <h3 className="sidebar-card__title">Laatste berichten</h3>
        {loading ? (
          <p className="sidebar-card__empty">Laden...</p>
        ) : messages.length === 0 ? (
          <p className="sidebar-card__empty">Geen berichten</p>
        ) : (
          <ul className="sidebar-list">
            {messages.map((message) => (
              <li
                key={message.id}
                className="sidebar-list-item sidebar-list-item--blue"
              >
                <Link to="/board" className="sidebar-list-link">
                  <span className="sidebar-list-title">{message.title}</span>
                  <span className="sidebar-list-meta">{message.type}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
