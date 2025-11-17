import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonById } from "../../services/lessonService";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";

import TeacherHomeworkForm from "../../components/lesson/homeworkForm/TeacherHomeworkForm";
import StudentHomeworkSubmit from "../../components/lesson/homeworkForm/StudentHomeworkSubmit";

// TEMP: map of demo students from your config.json “users” data (ids 5..10)
// Replace later with a real fetch of profiles/users.
const DEMO_STUDENTS = [
  { id: 5, label: "Jan de Vries" },
  { id: 6, label: "Maria Santos" },
  { id: 7, label: "Ahmed Hassan" },
  { id: 8, label: "Anna Kowalski" },
  { id: 9, label: "Carlos Rodriguez" },
  { id: 10, label: "Fatima Al-Mansouri" },
];

export default function LessonDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const isTeacher = Array.isArray(user?.roles) && user.roles.includes("teacher");

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr(""); setLoading(true);
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

  if (loading) return <Loader />;
  if (err) return <ErrorNotice message={err} />;
  if (!lesson) return <p>Les niet gevonden.</p>;

  return (
    <section>
      <p><Link to="/lessons">← Terug naar lessen</Link></p>
      <h2>{lesson.title}</h2>
      <p><strong>Datum:</strong> {lesson.date} • <strong>Tijd:</strong> {lesson.startTime}–{lesson.endTime}</p>
      <p><strong>Locatie:</strong> {lesson.location}</p>
      <p><strong>Niveau:</strong> {lesson.level}</p>
      {lesson.materialsUrl && (
        <p><a href={lesson.materialsUrl} target="_blank" rel="noreferrer">Lesmateriaal</a></p>
      )}
      <p style={{ whiteSpace: "pre-wrap" }}>{lesson.description}</p>

      <hr style={{ margin: "1rem 0" }} />

      {isTeacher ? (
        <>
          <h3>Huiswerk toevoegen</h3>
          <TeacherHomeworkForm
            lessonId={Number(id)}
            students={DEMO_STUDENTS}
            onCreated={() => {/* you can add a toast or small notice here */}}
          />
        </>
      ) : (
        <>
          <h3>Huiswerk inleveren</h3>
          <StudentHomeworkSubmit lessonId={Number(id)} />
        </>
      )}
    </section>
  );
}
