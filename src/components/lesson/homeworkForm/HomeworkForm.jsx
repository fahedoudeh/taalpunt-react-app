import { useState } from "react";
import { createHomework } from "../../../services/homeworkService";
import "./HomeworkForm.css";

export default function HomeworkForm({ lessonId, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await createHomework({ lessonId, title, description, dueDate });
      setTitle("");
      setDescription("");
      setDueDate("");
      onCreated?.(); // parent refetch
    } catch (e) {
      if (e.code === "ECONNABORTED")
        setErr("De server reageert traag. Probeer het zo nog eens.");
      else setErr("Kon huiswerk niet opslaan.");
      console.error("Create homework error:", e?.response?.data || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="hw-form" onSubmit={onSubmit} aria-live="polite">
      <div className="hw-form__row">
        <label htmlFor="hw-title">Titel</label>
        <input
          id="hw-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="hw-form__row">
        <label htmlFor="hw-desc">Omschrijving</label>
        <textarea
          id="hw-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="hw-form__row">
        <label htmlFor="hw-due">Inleverdatum</label>
        <input
          id="hw-due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {err && <div className="hw-form__error">{err}</div>}

      <button type="submit" disabled={saving}>
        {saving ? "Opslaan…" : "Huiswerk toevoegen"}
      </button>
    </form>
  );
}
