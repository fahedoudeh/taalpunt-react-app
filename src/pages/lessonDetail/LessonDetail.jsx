import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonById } from "../../services/lessonService";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import { formatDate } from "../../helpers/formatDate";
import { getHomework } from "../../services/homeworkService";
import HomeworkForm from "../../components/lesson/homeworkForm/HomeworkForm";
import "./LessonDetail.css";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [hw, setHw] = useState([]);
  const [hwLoading, setHwLoading] = useState(false);
  const [hwErr, setHwErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await getLessonById(id);
        setLesson(res?.data ?? null);
      } catch (e) {
        if (e.code === "ECONNABORTED")
          setErr("De server reageert traag. Probeer het zo nog eens.");
        else setErr("Kon les niet laden.");
        console.error("Lesson detail error:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const fetchHomework = async () => {
    setHwErr("");
    setHwLoading(true);
    try {
      const res = await getHomework({ lessonId: id });
      const list = Array.isArray(res?.data) ? res.data : [];
      setHw(list);
    } catch (e) {
      if (e.code === "ECONNABORTED")
        setHwErr("De server reageert traag. Probeer het zo nog eens.");
      else setHwErr("Kon huiswerk niet laden.");
      console.error("Homework list error:", e?.response?.data || e.message);
    } finally {
      setHwLoading(false);
    }
  };

   useEffect(() => {
     // existing fetch for lesson…
     // then also fetch homework:
     fetchHomework();
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id]);


  if (loading) return <Loader />;
  if (err) return <ErrorNotice message={err} />;
  if (!lesson) return <ErrorNotice message="Les niet gevonden." />;

  return (
    <section className="lesson-detail">
      <Link to="/lessons" className="lesson-detail__back">
        ← Terug naar lessen
      </Link>

      <h1 className="lesson-detail__title">{lesson.title ?? "Les"}</h1>
      <div className="lesson-detail__meta">
        Datum: {formatDate(lesson.date, false)}
      </div>

      {lesson.description && (
        <p className="lesson-detail__desc">{lesson.description}</p>
      )}

      <hr className="lesson-detail__hr" />

      <h2>Huiswerk</h2>
      <HomeworkForm lessonId={id} onCreated={fetchHomework} />

      {hwLoading && <div>Laden…</div>}
      {hwErr && <div className="lesson-detail__muted">{hwErr}</div>}
      {!hwLoading &&
        !hwErr &&
        (hw.length === 0 ? (
          <p className="lesson-detail__muted">Geen huiswerk voor deze les.</p>
        ) : (
          <ul>
            {hw.map((h) => (
              <li key={h.id}>
                <strong>{h.title}</strong>
                {h.dueDate && (
                  <> — inleveren op {formatDate(h.dueDate, false)}</>
                )}
                {h.description && <div>{h.description}</div>}
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
