
import { useState } from "react";
import Modal from "../ui/modal/Modal";
import Button from "../ui/button/Button";
import "./HomeworkGradingModal.css";

export default function HomeworkGradingModal({ submission, onClose, onSave }) {
  const [feedback, setFeedback] = useState(submission?.feedback || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave(submission.id, feedback);
      onClose();
    } catch (error) {
      console.error("Failed to save feedback:", error);
      alert("Kon feedback niet opslaan. Probeer opnieuw.");
    } finally {
      setSaving(false);
    }
  };

  if (!submission) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title="Huiswerk beoordelen">
      <div className="homework-grading">
        <div className="homework-grading__info">
          <p>
            <strong>Les:</strong> {submission.lessonTitle}
          </p>
          <p>
            <strong>Cursist:</strong> {submission.studentName}
          </p>
          <p>
            <strong>Ingeleverd:</strong>{" "}
            {new Date(submission.submittedAt).toLocaleString("nl-NL")}
          </p>
        </div>

        <div className="homework-grading__submission">
          <h4>Ingeleverd werk:</h4>
          <div className="homework-grading__content">
            {submission.content ||
              submission.submissionText ||
              submission.text ||
              "Geen inhoud beschikbaar"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="homework-grading__form">
          <label htmlFor="feedback" className="homework-grading__label">
            Feedback voor cursist:
          </label>
          <textarea
            id="feedback"
            className="homework-grading__textarea"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Schrijf je feedback hier..."
            rows={6}
            required
          />

          <div className="homework-grading__actions">
            <Button type="submit" disabled={saving}>
              {saving ? "Opslaan..." : "Feedback opslaan"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuleren
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
