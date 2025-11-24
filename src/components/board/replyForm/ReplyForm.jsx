import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "../../ui/button/Button";
import "./ReplyForm.css";

export default function ReplyForm({ messageId, onSubmit, onCancel }) {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const handleFormSubmit = async (data) => {
    const payload = {
      messageId: Number(messageId),
      content: data.content.trim(),
      authorId: Number(user?.id || user?.userId),
      authorName: user?.username || user?.email || "Anoniem",
      createdAt: new Date().toISOString(),
    };

    await onSubmit(payload);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="reply-form">
      <div className="reply-form__field">
        <label htmlFor="comment-content" className="reply-form__label">
          Schrijf een reactie
        </label>
        <textarea
          id="comment-content"
          className="reply-form__textarea"
          rows="4"
          placeholder="Deel je gedachten..."
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
          <span className="reply-form__error">{errors.content.message}</span>
        )}
      </div>

      <div className="reply-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Bezig..." : "Reageren"}
        </Button>
      </div>
    </form>
  );
}
