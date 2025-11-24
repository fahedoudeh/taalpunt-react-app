import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonById } from "../../services/lessonService";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import Button from "../../components/ui/button/Button";
import { getHomework, deleteHomework } from "../../services/homeworkService";
import TeacherHomeworkForm from "../../components/lesson/homeworkForm/TeacherHomeworkForm";
import StudentHomeworkSubmit from "../../components/lesson/homeworkForm/StudentHomeworkSubmit";
import Modal from "../../components/ui/modal/Modal";
import "./LessonDetail.css";

export default function LessonDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const isTeacher =
    Array.isArray(user?.roles) && user.roles.includes("teacher");

  const [lesson, setLesson] = useState(null);
  const [homework, setHomework] = useState(null);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [deleteHomeworkModal, setDeleteHomeworkModal] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  const [loading, setLoading] = useState(true);
  const [loadingHomework, setLoadingHomework] = useState(false);
  const [err, setErr] = useState("");

  // Fetch lesson details
  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await getLessonById(id);
        setLesson(res.data || null);
      } catch (e) {
        console.error("Lesson detail:", e?.response?.data || e.message);
        setErr("Kon les niet laden.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Fetch homework for this lesson
  useEffect(() => {
    if (!lesson?.id) return;

    (async () => {
      setLoadingHomework(true);
      try {
        const response = await getHomework({ lessonId: lesson.id });
        const allHomework = response?.data || [];

        // Find homework for this specific lesson
        const lessonHomework = allHomework.find(
          (hw) => Number(hw.lessonId) === Number(lesson.id)
        );

        setHomework(lessonHomework || null);
      } catch (e) {
        console.error("Error fetching homework:", e);
        // Don't show error to user, just no homework
      } finally {
        setLoadingHomework(false);
      }
    })();
  }, [lesson?.id]);

  const handleHomeworkCreated = () => {
    setShowHomeworkForm(false);
    // Refresh homework list
    (async () => {
      try {
        const response = await getHomework({ lessonId: lesson.id });
        const allHomework = response?.data || [];
        const lessonHomework = allHomework.find(
          (hw) => Number(hw.lessonId) === Number(lesson.id)
        );
        setHomework(lessonHomework || null);
      } catch (e) {
        console.error("Error refreshing homework:", e);
      }
    })();
  };

  const handleDeleteHomework = async () => {
    try {
      await deleteHomework(homework.id);
      setHomework(null);
      setDeleteHomeworkModal(false);
    } catch (e) {
      console.error("Error deleting homework:", e);
      setErrorModal({
        isOpen: true,
        message: "Kon huiswerk niet verwijderen. Probeer het opnieuw.",
      });
    }
  };

  if (loading) return <Loader />;
  if (err) return <ErrorNotice message={err} />;
  if (!lesson) return <p>Les niet gevonden.</p>;

  return (
    <section className="lesson-detail">
      <p>
        <Link to="/lessons">← Terug naar lessen</Link>
      </p>

      <div className="lesson-header">
        <h2>{lesson.title}</h2>

        <div className="lesson-card">
          <div className="lesson-card__meta">
            <p>
              <strong>📅 Datum:</strong> {lesson.date}
            </p>
            <p>
              <strong>🕒 Tijd:</strong> {lesson.startTime}–{lesson.endTime}
            </p>
            <p>
              <strong>📍 Locatie:</strong> {lesson.location}
            </p>
            <p>
              <strong>📊 Niveau:</strong> {lesson.level}
            </p>
          </div>

          {lesson.description && (
            <div className="lesson-card__description">
              <strong>Beschrijving:</strong>
              <p>{lesson.description}</p>
            </div>
          )}

          {lesson.materialsUrl && (
            <div className="lesson-card__materials">
              <strong>📎 Lesmateriaal:</strong>
              <a href={lesson.materialsUrl} target="_blank" rel="noreferrer">
                Download materiaal
              </a>
            </div>
          )}
        </div>
      </div>

      <hr className="lesson-section-divider" />

      {/* HOMEWORK SECTION */}
      <div className="lesson-homework-section">
        <h3>Huiswerk</h3>

        {loadingHomework && <p>Laden...</p>}

        {!loadingHomework && isTeacher && (
          <>
            {!showHomeworkForm && (
              <>
                {homework ? (
                  <div className="homework-teacher-view">
                    <div className="homework-card homework-card--teacher">
                      <h4>{homework.title}</h4>
                      <p className="homework-description">
                        {homework.description}
                      </p>
                      <p className="homework-due">
                        <strong>Inleverdatum:</strong>{" "}
                        {new Date(homework.dueDate).toLocaleDateString(
                          "nl-NL",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="homework-actions">
                      <Button onClick={() => setShowHomeworkForm(true)}>
                        ✏️ Huiswerk Bewerken
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setDeleteHomeworkModal(true)}
                      >
                        🗑️ Verwijderen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowHomeworkForm(true)}>
                    + Huiswerk Toevoegen
                  </Button>
                )}
              </>
            )}

            {showHomeworkForm && (
              <TeacherHomeworkForm
                lessonId={Number(id)}
                existingHomework={homework}
                onSuccess={handleHomeworkCreated}
                onCancel={() => setShowHomeworkForm(false)}
              />
            )}
          </>
        )}

        {!loadingHomework && !isTeacher && (
          <>
            {homework ? (
              <div className="homework-display">
                <div className="homework-card homework-card--student">
                  <h4>{homework.title}</h4>
                  <p className="homework-description">{homework.description}</p>
                  <p className="homework-due">
                    <strong>Inleverdatum:</strong>{" "}
                    {new Date(homework.dueDate).toLocaleDateString("nl-NL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <StudentHomeworkSubmit homework={homework} />
              </div>
            ) : (
              <p className="no-homework">
                Er is nog geen huiswerk voor deze les.
              </p>
            )}
          </>
        )}
      </div>
      <Modal
        isOpen={deleteHomeworkModal}
        title="Huiswerk verwijderen"
        message="Weet je zeker dat je dit huiswerk wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
        confirmLabel="Ja, verwijderen"
        cancelLabel="Annuleren"
        onConfirm={handleDeleteHomework}
        onCancel={() => setDeleteHomeworkModal(false)}
      />
      <Modal
        isOpen={errorModal.isOpen}
        title="Fout"
        message={errorModal.message}
        confirmLabel="OK"
        onConfirm={() => setErrorModal({ isOpen: false, message: "" })}
        onCancel={() => setErrorModal({ isOpen: false, message: "" })}
      />
    </section>
  );
}
