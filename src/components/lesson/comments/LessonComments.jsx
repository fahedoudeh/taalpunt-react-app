
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { formatDate } from "../../../helpers/formatDate";
import { MessageCircle } from "lucide-react";
import Button from "../../ui/button/Button";
import "./LessonComments.css";

export default function LessonComments({ comments = [], onAddComment }) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onAddComment(data.content.trim());
      reset();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lesson-comments">
      <div className="lesson-comments__header">
        <h3 className="lesson-comments__title">
          <MessageCircle size={20} />
          <span>Reacties ({comments.length})</span>
        </h3>

        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="secondary">
            Reageren
          </Button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lesson-comments__form"
        >
          <textarea
            className="lesson-comments__textarea"
            placeholder="Deel je gedachten over deze les..."
            rows="4"
            {...register("content", {
              required: "Reactie mag niet leeg zijn",
              minLength: {
                value: 1,
                message: "Reactie moet minimaal 1 teken bevatten",
              },
              maxLength: {
                value: 1000,
                message: "Reactie mag maximaal 1000 tekens bevatten",
              },
            })}
          />
          {errors.content && (
            <span className="lesson-comments__error">
              {errors.content.message}
            </span>
          )}
          <div className="lesson-comments__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();
                setShowForm(false);
              }}
            >
              Annuleren
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Bezig..." : "Reageren"}
            </Button>
          </div>
        </form>
      )}

      {comments.length === 0 && !showForm && (
        <div className="lesson-comments__empty">
          <p>Nog geen reacties. Wees de eerste!</p>
        </div>
      )}

      {comments.length > 0 && (
        <div className="lesson-comments__list">
          {comments.map((comment) => (
            <div key={comment.id} className="lesson-comment">
              <div className="lesson-comment__header">
                <span className="lesson-comment__author">
                  {comment.authorName || "Anoniem"}
                </span>
                {comment.createdAt && (
                  <span className="lesson-comment__date">
                    {formatDate(comment.createdAt, true)}
                  </span>
                )}
              </div>
              <p className="lesson-comment__content">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
