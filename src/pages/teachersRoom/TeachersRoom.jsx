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
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import Button from "../../components/ui/button/Button";
import "./TeachersRoom.css";

export default function TeachersRoom() {
  const { user } = useAuth();

  // State for different sections
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lessons state
  const [lessons, setLessons] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  // Students/Enrollments state
  const [enrollments, setEnrollments] = useState([]);

  // Homework state
  const [homeworkSubmissions, setHomeworkSubmissions] = useState([]);

  // Activities state
  const [activities, setActivities] = useState([]);

  // Statistics
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLessons: 0,
    pendingHomework: 0,
    upcomingActivities: 0,
  });

  // Fetch data based on active tab
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
          await fetchEnrollments();
          break;
        case "homework":
          await fetchHomework();
          break;
        case "activities":
          await fetchActivities();
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

  // Fetch overview data
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

  // Fetch lessons
  const fetchLessons = async () => {
    const { data } = await getLessons();
    setLessons(Array.isArray(data) ? data : []);
  };

  // Fetch enrollments/students
  const fetchEnrollments = async () => {
    const { data } = await getEnrollments();
    setEnrollments(Array.isArray(data) ? data : []);
  };

  // Fetch homework
  const fetchHomework = async () => {
    const { data } = await getHomework();
    setHomeworkSubmissions(Array.isArray(data) ? data : []);
  };

  // Fetch activities
  const fetchActivities = async () => {
    const { data } = await getActivities();
    setActivities(Array.isArray(data) ? data : []);
  };

  // Handle lesson operations
  const handleCreateLesson = async (lessonData) => {
    try {
      const { data } = await createLesson({
        ...lessonData,
        teacherId: user.id,
        createdAt: new Date().toISOString(),
      });
      setLessons([data, ...lessons]);
      setShowLessonForm(false);
    } catch (err) {
      setError("Kon les niet aanmaken.");
      console.error("Create lesson error:", err);
    }
  };

  const handleUpdateLesson = async (lessonId, lessonData) => {
    try {
      await updateLesson(lessonId, lessonData);
      setLessons(
        lessons.map((l) => (l.id === lessonId ? { ...l, ...lessonData } : l))
      );
      setEditingLesson(null);
    } catch (err) {
      setError("Kon les niet bijwerken.");
      console.error("Update lesson error:", err);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Weet je zeker dat je deze les wilt verwijderen?"))
      return;

    try {
      await deleteLesson(lessonId);
      setLessons(lessons.filter((l) => l.id !== lessonId));
    } catch (err) {
      setError("Kon les niet verwijderen.");
      console.error("Delete lesson error:", err);
    }
  };

  const renderOverview = () => (
    <div className="teachers-room__overview">
      <h2>Dashboard Overzicht</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__value">{stats.totalStudents}</div>
          <div className="stat-card__label">Totaal Cursisten</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.totalLessons}</div>
          <div className="stat-card__label">Actieve Lessen</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.pendingHomework}</div>
          <div className="stat-card__label">Te Beoordelen Huiswerk</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.upcomingActivities}</div>
          <div className="stat-card__label">Aankomende Activiteiten</div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Snelle Acties</h3>
        <div className="action-buttons">
          <Button
            onClick={() => {
              setActiveTab("lessons");
              setShowLessonForm(true);
            }}
          >
            + Nieuwe Les
          </Button>
          <Button onClick={() => setActiveTab("homework")} variant="secondary">
            Huiswerk Beoordelen
          </Button>
          <Button onClick={() => setActiveTab("students")} variant="secondary">
            Cursisten Beheren
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLessons = () => (
    <div className="teachers-room__lessons">
      <div className="section-header">
        <h2>Lessen Beheren</h2>
        <Button onClick={() => setShowLessonForm(true)}>+ Nieuwe Les</Button>
      </div>

      {showLessonForm && (
        <div className="lesson-form">
          <h3>{editingLesson ? "Les Bewerken" : "Nieuwe Les Aanmaken"}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const lessonData = {
                title: formData.get("title"),
                description: formData.get("description"),
                date: formData.get("date"),
                duration: formData.get("duration"),
                location: formData.get("location"),
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
              type="datetime-local"
              defaultValue={editingLesson?.date}
              required
            />
            <input
              name="duration"
              type="number"
              placeholder="Duur (minuten)"
              defaultValue={editingLesson?.duration || 60}
              required
            />
            <input
              name="location"
              placeholder="Locatie"
              defaultValue={editingLesson?.location}
              required
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
                <th>Duur</th>
                <th>Locatie</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>{lesson.title}</td>
                  <td>{new Date(lesson.date).toLocaleString("nl-NL")}</td>
                  <td>{lesson.duration} min</td>
                  <td>{lesson.location}</td>
                  <td>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditingLesson(lesson);
                        setShowLessonForm(true);
                      }}
                    >
                      Bewerk
                    </Button>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      Verwijder
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
      <h2>Cursisten Overzicht</h2>
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
      <h2>Huiswerk Beoordelen</h2>
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
              {!submission.reviewed && <Button size="small">Beoordelen</Button>}
            </div>
          ))}
        </div>
      )}
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
            {activeTab === "activities" && (
              <div className="teachers-room__activities">
                <h2>Activiteiten Beheren</h2>
                <p>Activiteiten sectie - Nog te implementeren</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
