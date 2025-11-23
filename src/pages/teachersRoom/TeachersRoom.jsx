import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../../services/lessonService";
import { getHomework } from "../../services/homeworkService";
import { getEnrollments } from "../../services/enrollmentService";
import { getActivities, createActivity } from "../../services/activityService";
import { sortByNewest } from "../../helpers/utils";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import Button from "../../components/ui/button/Button";
import "./TeachersRoom.css";

// Kleine helper om lijsten “nieuwste eerst” te sorteren


// Kleine iconen voor actiekolom
function EditIcon(props) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 13.5 12.5 5l2.5 2.5L6.5 16H4v-2.5Z" fill="currentColor" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M7 4h6l-.5-1.5A1 1 0 0 0 11.6 2H8.4a1 1 0 0 0-.9.5L7 4Zm-3 1h12v1.5H4V5Zm2 2h8v7.5A1.5 1.5 0 0 1 12.5 16h-5A1.5 1.5 0 0 1 6 14.5V7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function TeachersRoom() {
  const { user } = useAuth();

  // Tabs / algemene status
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lessen
  const [lessons, setLessons] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  // Cursisten (inschrijvingen)
  const [enrollments, setEnrollments] = useState([]);

  // Huiswerk
  const [homeworkSubmissions, setHomeworkSubmissions] = useState([]);

  // Activiteiten
  const [activities, setActivities] = useState([]);
  const [showActivityForm, setShowActivityForm] = useState(false);

  // Overzicht-statistieken
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLessons: 0,
    pendingHomework: 0,
    upcomingActivities: 0,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      switch (activeTab) {
        case "overview":
          await fetchOverviewData();
          break;
        case "lessons":
          await fetchLessons();
          break;
        case "students":
          await fetchEnrollmentsData();
          break;
        case "homework":
          await fetchHomeworkData();
          break;
        case "activities":
          await fetchActivitiesData();
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Kon gegevens niet laden. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOverviewData = async () => {
    const [lessonsRes, enrollmentsRes, homeworkRes, activitiesRes] =
      await Promise.allSettled([
        getLessons(),
        getEnrollments(),
        getHomework(),
        getActivities(),
      ]);

    const lessonsList =
      lessonsRes.status === "fulfilled" ? lessonsRes.value.data : [];
    const enrollmentsList =
      enrollmentsRes.status === "fulfilled" ? enrollmentsRes.value.data : [];
    const homeworkList =
      homeworkRes.status === "fulfilled" ? homeworkRes.value.data : [];
    const activitiesList =
      activitiesRes.status === "fulfilled" ? activitiesRes.value.data : [];

    setStats({
      totalStudents: Array.isArray(enrollmentsList)
        ? enrollmentsList.length
        : 0,
      totalLessons: Array.isArray(lessonsList) ? lessonsList.length : 0,
      pendingHomework: Array.isArray(homeworkList)
        ? homeworkList.filter((h) => !h.reviewed).length
        : 0,
      upcomingActivities: Array.isArray(activitiesList)
        ? activitiesList.filter((a) => new Date(a.date) > new Date()).length
        : 0,
    });
  };

  const fetchLessons = async () => {
    const { data } = await getLessons();
    setLessons(sortByNewest(Array.isArray(data) ? data : [], "date"));
  };

  const fetchEnrollmentsData = async () => {
    const { data } = await getEnrollments();
    setEnrollments(Array.isArray(data) ? data : []);
  };

  const fetchHomeworkData = async () => {
    const { data } = await getHomework();
    setHomeworkSubmissions(Array.isArray(data) ? data : []);
  };

  const fetchActivitiesData = async () => {
    const { data } = await getActivities();
    setActivities(sortByNewest(Array.isArray(data) ? data : [], "date"));
  };

  const handleCreateLesson = async (lessonData) => {
    try {
      const payload = {
        title: lessonData.title,
        description: lessonData.description,
        date: lessonData.date,
        startTime: lessonData.startTime,
        endTime: lessonData.endTime,
        location: lessonData.location,
        level: lessonData.level,
        materialsUrl: lessonData.materialsUrl || "",
        teacherId: Number(user.id),
      };

      const { data } = await createLesson(payload);
      setLessons((prev) => sortByNewest([data, ...prev], "date"));
      setShowLessonForm(false);
      setEditingLesson(null);
      setError("");
    } catch (err) {
      console.error("Create lesson error:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
      }
      setError("Kon les niet aanmaken.");
    }
  };

  const handleUpdateLesson = async (lessonId, lessonData) => {
    try {
      const payload = {
        id: lessonId, 
        title: lessonData.title,
        description: lessonData.description,
        date: lessonData.date,
        startTime: lessonData.startTime,
        endTime: lessonData.endTime,
        location: lessonData.location,
        level: lessonData.level,
        materialsUrl: lessonData.materialsUrl || "",
        teacherId: Number(user.id),
      };

      console.log("Update payload:", payload);
      console.log("Date check:", {
        date: payload.date,
        dateType: typeof payload.date,
      });

      await updateLesson(lessonId, payload);
      setLessons((prev) =>
        sortByNewest(
          prev.map((l) => (l.id === lessonId ? { ...l, ...payload } : l)),
          "date"
        )
      );
      setEditingLesson(null);
      setShowLessonForm(false);
      setError("");
    } catch (err) {
      console.error("Update lesson error:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
      }
      setError("Kon les niet bijwerken.");
    }
  };
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Weet je zeker dat je deze les wilt verwijderen?")) {
      return;
    }

    try {
      await deleteLesson(lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err) {
      setError("Kon les niet verwijderen.");
      console.error("Delete lesson error:", err);
    }
  };

  const handleCreateActivity = async (activityData) => {
    try {
      const payload = {
        title: activityData.title,
        description: activityData.description,
        date: activityData.date,
        startTime: activityData.startTime,
        endTime: activityData.endTime,
        location: activityData.location,
        type: activityData.type || "Gemeenschapsevenement",
        creatorId: Number(user.id),
      };

      const { data } = await createActivity(payload);
      setActivities((prev) => sortByNewest([data, ...prev], "date"));
      setShowActivityForm(false);
      setError("");
    } catch (err) {
      console.error("Create activity error:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
      }
      setError("Kon activiteit niet aanmaken.");
    }
  };

  const renderOverview = () => (
    <div className="teachers-room__overview">
      <h2>Dashboard Overzicht</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__value">{stats.totalStudents}</div>
          <div className="stat-card__label">Totaal cursisten</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.totalLessons}</div>
          <div className="stat-card__label">Actieve lessen</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.pendingHomework}</div>
          <div className="stat-card__label">Te beoordelen huiswerk</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.upcomingActivities}</div>
          <div className="stat-card__label">Aankomende activiteiten</div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Snelle acties</h3>
        <div className="action-buttons">
          <Button
            onClick={() => {
              setActiveTab("lessons");
              setShowLessonForm(true);
            }}
          >
            + Nieuwe les
          </Button>
          <Button onClick={() => setActiveTab("homework")} variant="secondary">
            Huiswerk beoordelen
          </Button>
          <Button onClick={() => setActiveTab("students")} variant="secondary">
            Cursisten beheren
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLessons = () => (
    <div className="teachers-room__lessons">
      <div className="section-header">
        <h2>Lessen beheren</h2>
        <Button onClick={() => setShowLessonForm(true)}>+ Nieuwe les</Button>
      </div>

      {showLessonForm && (
        <div className="lesson-form">
          <h3>{editingLesson ? "Les bewerken" : "Nieuwe les aanmaken"}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const lessonData = {
                title: formData.get("title"),
                description: formData.get("description"),
                date: formData.get("date"),
                startTime: formData.get("startTime"),
                endTime: formData.get("endTime"),
                location: formData.get("location"),
                level: formData.get("level"),
                materialsUrl: formData.get("materialsUrl") || "",
              };

              if (editingLesson) {
                handleUpdateLesson(editingLesson.id, lessonData);
              } else {
                handleCreateLesson(lessonData);
              }
            }}
          >
            <input
              name="title"
              placeholder="Les titel"
              defaultValue={editingLesson?.title}
              required
            />
            <textarea
              name="description"
              placeholder="Beschrijving"
              defaultValue={editingLesson?.description}
              required
            />
            <input
              name="date"
              type="date"
              defaultValue={
                editingLesson?.date ? editingLesson.date.split("T")[0] : ""
              }
              required
            />
            <input
              name="startTime"
              type="time"
              defaultValue={editingLesson?.startTime || "10:00"}
              required
            />
            <input
              name="endTime"
              type="time"
              defaultValue={editingLesson?.endTime || "12:00"}
              required
            />
            <select
              name="level"
              defaultValue={editingLesson?.level || "A1"}
              required
            >
              <option value="A1">A1 - Beginner</option>
              <option value="A2">A2 - Basis</option>
              <option value="B1">B1 - Midden</option>
              <option value="B2">B2 - Gevorderd</option>
            </select>
            <input
              name="location"
              placeholder="Locatie"
              defaultValue={editingLesson?.location}
              required
            />
            <input
              name="materialsUrl"
              type="url"
              placeholder="Link naar materiaal (optioneel)"
              defaultValue={editingLesson?.materialsUrl}
            />
            <div className="form-actions">
              <Button type="submit">
                {editingLesson ? "Bijwerken" : "Aanmaken"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowLessonForm(false);
                  setEditingLesson(null);
                }}
              >
                Annuleren
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="lessons-list">
        {lessons.length === 0 ? (
          <p>Nog geen lessen aangemaakt.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Datum</th>
                <th>Tijd</th>
                <th>Locatie</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>{lesson.title}</td>
                  <td>
                    {lesson.date
                      ? new Date(lesson.date).toLocaleDateString("nl-NL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td>
                    {lesson.startTime && lesson.endTime
                      ? `${lesson.startTime}–${lesson.endTime}`
                      : "—"}
                  </td>
                  <td>{lesson.location}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="icon-btn"
                      title="Les bewerken"
                      onClick={() => {
                        setEditingLesson(lesson);
                        setShowLessonForm(true);
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="icon-btn"
                      title="Les verwijderen"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      <TrashIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="teachers-room__students">
      <h2>Cursisten overzicht</h2>
      {enrollments.length === 0 ? (
        <p>Nog geen cursisten ingeschreven.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Email</th>
              <th>Inschrijfdatum</th>
              <th>Status</th>
              <th>Voortgang</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{enrollment.studentName || "Onbekend"}</td>
                <td>{enrollment.studentEmail}</td>
                <td>
                  {new Date(enrollment.enrolledAt).toLocaleDateString("nl-NL")}
                </td>
                <td>
                  <span
                    className={`status status--${
                      enrollment.status || "active"
                    }`}
                  >
                    {enrollment.status || "Actief"}
                  </span>
                </td>
                <td>{enrollment.progress || 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderHomework = () => (
    <div className="teachers-room__homework">
      <h2>Huiswerk beoordelen</h2>
      {homeworkSubmissions.length === 0 ? (
        <p>Geen huiswerk om te beoordelen.</p>
      ) : (
        <div className="homework-list">
          {homeworkSubmissions.map((submission) => (
            <div key={submission.id} className="homework-card">
              <div className="homework-card__header">
                <h3>{submission.lessonTitle}</h3>
                <span
                  className={`status ${
                    submission.reviewed ? "status--reviewed" : "status--pending"
                  }`}
                >
                  {submission.reviewed ? "Beoordeeld" : "Te beoordelen"}
                </span>
              </div>
              <p>Cursist: {submission.studentName}</p>
              <p>
                Ingeleverd:{" "}
                {new Date(submission.submittedAt).toLocaleString("nl-NL")}
              </p>
              {!submission.reviewed && <Button size="sm">Beoordelen</Button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderActivities = () => (
    <div className="teachers-room__activities">
      <div className="section-header">
        <h2>Activiteiten beheren</h2>
        <Button onClick={() => setShowActivityForm(true)}>
          + Nieuwe activiteit
        </Button>
      </div>

      {showActivityForm && (
        <div className="activity-form">
          <h3>Nieuwe activiteit aanmaken</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const activityData = {
                title: formData.get("title"),
                description: formData.get("description"),
                date: formData.get("date"),
                startTime: formData.get("startTime"),
                endTime: formData.get("endTime"),
                location: formData.get("location"),
                type: formData.get("type") || "Gemeenschapsevenement",
              };

              handleCreateActivity(activityData);
            }}
          >
            <input
              name="title"
              placeholder="Titel van de activiteit"
              required
            />
            <textarea
              name="description"
              placeholder="Korte beschrijving"
              required
            />
            <input name="date" type="date" required />
            <div className="form-row">
              <input
                name="startTime"
                type="time"
                placeholder="Starttijd"
                required
              />
              <input
                name="endTime"
                type="time"
                placeholder="Eindtijd"
                required
              />
            </div>
            <input
              name="location"
              placeholder="Locatie (bijv. Dorpshuis Kapelle)"
              required
            />
            <select name="type" defaultValue="Gemeenschapsevenement">
              <option value="Gemeenschapsevenement">
                Gemeenschapsevenement
              </option>
              <option value="Lesgerelateerd">Lesgerelateerd</option>
              <option value="Workshop">Workshop</option>
              <option value="Informeel">Informeel</option>
            </select>

            <div className="form-actions">
              <Button type="submit">Activiteit aanmaken</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowActivityForm(false)}
              >
                Annuleren
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="activities-list">
        {activities.length === 0 ? (
          <p>Nog geen activiteiten aangemaakt.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Datum</th>
                <th>Tijd</th>
                <th>Locatie</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.title}</td>
                  <td>
                    {activity.date
                      ? new Date(activity.date).toLocaleDateString("nl-NL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td>
                    {activity.startTime && activity.endTime
                      ? `${activity.startTime}–${activity.endTime}`
                      : "—"}
                  </td>
                  <td>{activity.location}</td>
                  <td>{activity.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <div className="teachers-room">
      <div className="teachers-room__header">
        <h1>Docentenkamer</h1>
        <p>Welkom terug, {user?.email}</p>
      </div>

      <div className="teachers-room__tabs">
        <button
          className={`tab ${activeTab === "overview" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overzicht
        </button>
        <button
          className={`tab ${activeTab === "lessons" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("lessons")}
        >
          Lessen
        </button>
        <button
          className={`tab ${activeTab === "students" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          Cursisten
        </button>
        <button
          className={`tab ${activeTab === "homework" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("homework")}
        >
          Huiswerk
        </button>
        <button
          className={`tab ${activeTab === "activities" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("activities")}
        >
          Activiteiten
        </button>
      </div>

      <div className="teachers-room__content">
        {loading && <Loader label="Gegevens laden..." />}
        {error && <ErrorNotice message={error} />}

        {!loading && !error && (
          <>
            {activeTab === "overview" && renderOverview()}
            {activeTab === "lessons" && renderLessons()}
            {activeTab === "students" && renderStudents()}
            {activeTab === "homework" && renderHomework()}
            {activeTab === "activities" && renderActivities()}
          </>
        )}
      </div>
    </div>
  );
}
