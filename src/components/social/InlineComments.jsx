
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { formatDate } from "../../helpers/formatDate";
import { MessageCircle } from "lucide-react";
import "./InlineComments.css";

export default function InlineComments({
  comments = [],
  onAddComment,
  showInput = false,
  onToggleInput,
}) {
  const { user } = useAuth();
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
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inline-comments">
      {/* Comments header */}
      <div className="inline-comments__header">
        <button className="inline-comments__toggle" onClick={onToggleInput}>
          <MessageCircle size={16} />
          <span>
            {comments.length} {comments.length === 1 ? "reactie" : "reacties"}
          </span>
        </button>
      </div>

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="inline-comments__list">
          {comments.map((comment) => (
            <div key={comment.id} className="inline-comment">
              <div className="inline-comment__header">
                <span className="inline-comment__author">
                  {comment.authorName || "Anoniem"}
                </span>
                <span className="inline-comment__date">
                  {formatDate(comment.createdAt, true)}
                </span>
              </div>
              <p className="inline-comment__content">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment input */}
      {showInput && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="inline-comments__form"
        >
          <textarea
            className="inline-comments__input"
            placeholder="Schrijf een reactie..."
            rows="2"
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
            <span className="inline-comments__error">
              {errors.content.message}
            </span>
          )}
          <div className="inline-comments__actions">
            <button
              type="button"
              className="inline-comments__btn inline-comments__btn--cancel"
              onClick={() => {
                reset();
                onToggleInput();
              }}
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="inline-comments__btn inline-comments__btn--submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Bezig..." : "Reageren"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
