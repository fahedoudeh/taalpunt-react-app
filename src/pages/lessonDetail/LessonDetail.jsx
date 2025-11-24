
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonById } from "../../services/lessonService";
import { getHomework, deleteHomework } from "../../services/homeworkService";
import {
  getLessonComments,
  createLessonComment,
} from "../../services/lessonCommentService";
import {
  getAttendance,
  createAttendance,
  updateAttendance,
} from "../../services/attendanceService";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import Button from "../../components/ui/button/Button";
import Modal from "../../components/ui/modal/Modal";
import TeacherHomeworkForm from "../../components/lesson/homeworkForm/TeacherHomeworkForm";
import StudentHomeworkSubmit from "../../components/lesson/homeworkForm/StudentHomeworkSubmit";
import AttendanceTracker from "../../components/lesson/attendance/AttendanceTracker";
import LessonComments from "../../components/lesson/comments/LessonComments";
import "./LessonDetail.css";

export default function LessonDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const isTeacher =
    Array.isArray(user?.roles) &&
    (user.roles.includes("teacher") || user.roles.includes("admin"));

  const [lesson, setLesson] = useState(null);
  const [homework, setHomework] = useState(null);
  const [comments, setComments] = useState([]);
  const [attendance, setAttendance] = useState([]);
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

  // Fetch homework, comments, and attendance
  useEffect(() => {
    if (!lesson?.id) return;

    (async () => {
      setLoadingHomework(true);
      try {
        // Fetch homework
        const homeworkResponse = await getHomework({ lessonId: lesson.id });
        const allHomework = homeworkResponse?.data || [];
        const lessonHomework = allHomework.find(
          (hw) => Number(hw.lessonId) === Number(lesson.id)
        );
        setHomework(lessonHomework || null);

        // Fetch comments
        const commentsResponse = await getLessonComments({
          lessonId: lesson.id,
        });
        const allComments = commentsResponse?.data || [];
        const lessonComments = allComments.filter(
          (comment) => Number(comment.lessonId) === Number(lesson.id)
        );
        setComments(lessonComments);

        // Fetch attendance
        const attendanceResponse = await getAttendance({ lessonId: lesson.id });
        const allAttendance = attendanceResponse?.data || [];
        const lessonAttendance = allAttendance.filter(
          (att) => Number(att.lessonId) === Number(lesson.id)
        );
        setAttendance(lessonAttendance);
      } catch (e) {
        console.error("Error fetching lesson data:", e);
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
      setDeleteHomeworkModal(false);
    }
  };

  const handleAttendanceChange = async (status) => {
    if (!user?.id) return;

    try {
      // Check if user already has attendance record
      const existingAttendance = attendance.find(
        (att) => Number(att.userId) === Number(user.id)
      );

      if (existingAttendance) {
        // Update existing
        const payload = {
          id: existingAttendance.id,
          lessonId: Number(lesson.id),
          userId: Number(user.id),
          status: status,
          createdAt: existingAttendance.createdAt,
        };
        await updateAttendance(existingAttendance.id, payload);

        setAttendance((prev) =>
          prev.map((att) =>
            att.id === existingAttendance.id ? { ...att, status } : att
          )
        );
      } else {
        // Create new
        const payload = {
          lessonId: Number(lesson.id),
          userId: Number(user.id),
          status: status,
          createdAt: new Date().toISOString(),
        };
        const response = await createAttendance(payload);
        setAttendance((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      setErrorModal({
        isOpen: true,
        message: "Kon aanwezigheid niet bijwerken. Probeer het opnieuw.",
      });
    }
  };

  const handleAddComment = async (content) => {
    try {
      const payload = {
        lessonId: Number(lesson.id),
        content: content,
        authorId: Number(user.id),
        authorName: user.email || "Anoniem",
        createdAt: new Date().toISOString(),
      };

      const response = await createLessonComment(payload);
      setComments((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding comment:", error);
      setErrorModal({
        isOpen: true,
        message: "Kon reactie niet plaatsen. Probeer het opnieuw.",
      });
      throw error;
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

      {/* ATTENDANCE SECTION - Only for students */}
      {!isTeacher && (
        <AttendanceTracker
          lessonId={lesson.id}
          attendees={attendance}
          onAttendanceChange={handleAttendanceChange}
        />
      )}

      {/* TEACHER ATTENDANCE VIEW */}
      {isTeacher && attendance.length > 0 && (
        <div className="lesson-attendance-summary">
          <h3>Aanwezigheid</h3>
          <div className="attendance-stats">
            <div className="attendance-stat attendance-stat--coming">
              <span className="attendance-stat__label">Komt</span>
              <span className="attendance-stat__count">
                {attendance.filter((att) => att.status === "coming").length}
              </span>
            </div>
            <div className="attendance-stat attendance-stat--maybe">
              <span className="attendance-stat__label">Misschien</span>
              <span className="attendance-stat__count">
                {attendance.filter((att) => att.status === "maybe").length}
              </span>
            </div>
            <div className="attendance-stat attendance-stat--not-coming">
              <span className="attendance-stat__label">Komt niet</span>
              <span className="attendance-stat__count">
                {attendance.filter((att) => att.status === "not_coming").length}
              </span>
            </div>
          </div>
        </div>
      )}

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

      {/* COMMENTS SECTION */}
      <LessonComments comments={comments} onAddComment={handleAddComment} />

      {/* Delete Homework Modal */}
      <Modal
        isOpen={deleteHomeworkModal}
        title="Huiswerk verwijderen"
        message="Weet je zeker dat je dit huiswerk wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
        confirmLabel="Ja, verwijderen"
        cancelLabel="Annuleren"
        onConfirm={handleDeleteHomework}
        onCancel={() => setDeleteHomeworkModal(false)}
      />

      {/* Error Modal */}
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
