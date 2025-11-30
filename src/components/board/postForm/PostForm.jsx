import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "../../ui/button/Button";
import "./PostForm.css";

export default function PostForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  context = "community", // "community" | "teachers"
}) {
  const { user } = useAuth();

  const role = user?.role;
  const roles = user?.roles || [];
  const isTeacherLike =
    role === "teacher" ||
    role === "docent" ||
    role === "admin" ||
    roles.includes("teacher") ||
    roles.includes("docent") ||
    roles.includes("admin");

  const isTeacherContext = context === "teachers";

  
  const isEditing = Boolean(initialData && initialData.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      type: initialData?.type || "Tip",
      tags: initialData?.tags || "",
    },
  });

  const handleFormSubmit = (data) => {
    const formData = {
      title: data.title.trim(),
      content: data.content.trim(),
      type: data.type.trim(),
      tags: data.tags.trim(),
      
    };

    onSubmit(formData);
  };

  return (
    <form
      className="post-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
    >
      <h2 className="post-form__title">
        {isEditing ? "Bericht bewerken" : "Nieuw bericht"}
      </h2>

      {/* Titel */}
      <div className="post-form__field">
        <label htmlFor="title" className="post-form__label">
          Titel *
        </label>
        <input
          id="title"
          type="text"
          className={`post-form__input post-form__title__input ${
            errors.title ? "post-form__input--error" : ""
          }`}
          {...register("title", {
            required: "Titel is verplicht",
            minLength: {
              value: 3,
              message: "Titel moet minimaal 3 karakters bevatten",
            },
            maxLength: {
              value: 100,
              message: "Titel mag maximaal 100 karakters bevatten",
            },
          })}
        />
        {errors.title && (
          <span className="post-form__error">{errors.title.message}</span>
        )}
      </div>

      {/* Type */}
      <div className="post-form__field">
        <label htmlFor="type" className="post-form__label">
          Type bericht *
        </label>
        <select
          id="type"
          className={`post-form__select ${
            errors.type ? "post-form__select--error" : ""
          }`}
          {...register("type", {
            required: "Type is verplicht",
          })}
        >
          {/* Check if this is teacher board by looking at initialData */}
          {initialData?.teachersOnly ? (
            <>
              <option value="Planning">📅 Planning</option>
              <option value="Notulen">📝 Notulen</option>
              <option value="Mededeling">📢 Mededeling</option>
              <option value="Vraag">❓ Vraag</option>
            </>
          ) : (
            <>
              <option value="Tip">💡 Tip</option>
              <option value="Vraag">❓ Vraag</option>
              <option value="Aankondiging">📢 Aankondiging</option>
              <option value="Discussie">💬 Discussie</option>
            </>
          )}
        </select>
        {errors.type && (
          <span className="post-form__error">{errors.type.message}</span>
        )}
      </div>

      {/* Inhoud */}
      <div className="post-form__field">
        <label htmlFor="content" className="post-form__label">
          Inhoud *
        </label>
        <textarea
          id="content"
          rows={6}
          className={`post-form__textarea ${
            errors.content ? "post-form__textarea--error" : ""
          }`}
          placeholder="Schrijf hier je bericht..."
          {...register("content", {
            required: "Inhoud is verplicht",
            minLength: {
              value: 10,
              message: "Bericht moet minimaal 10 karakters bevatten",
            },
            maxLength: {
              value: 2000,
              message: "Bericht mag maximaal 2000 karakters bevatten",
            },
          })}
        />
        {errors.content && (
          <span className="post-form__error">{errors.content.message}</span>
        )}
      </div>

      {/* Tags */}
      <div className="post-form__field">
        <label htmlFor="tags" className="post-form__label">
          Tags (optioneel)
        </label>
        <input
          id="tags"
          type="text"
          className="post-form__input"
          placeholder="taal, grammatica, uitspraak (gescheiden door komma's)"
          {...register("tags", {
            pattern: {
              value: /^[a-zA-Z0-9, ]*$/,
              message: "Tags mogen alleen letters, cijfers en komma's bevatten",
            },
          })}
        />
        {errors.tags && (
          <span className="post-form__error">{errors.tags.message}</span>
        )}
      </div>

      {/* Acties */}
      <div className="post-form__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuleren
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? "Bijwerken..."
              : "Plaatsen..."
            : isEditing
            ? "Bericht bijwerken"
            : "Bericht plaatsen"}
        </Button>
      </div>
    </form>
  );
}
