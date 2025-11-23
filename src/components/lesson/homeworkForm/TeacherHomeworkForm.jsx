import { useForm } from "react-hook-form";
import {
  createHomework,
  updateHomework,
} from "../../../services/homeworkService";
import Button from "../../ui/button/Button";
import "./HomeworkForm.css";

export default function TeacherHomeworkForm({
  lessonId,
  existingHomework = null,
  onSuccess,
  onCancel,
}) {
  const isEditing = Boolean(existingHomework?.id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: existingHomework?.title || "",
      description: existingHomework?.description || "",
      dueDate: existingHomework?.dueDate || "",
    },
  });

 const onSubmit = async (data) => {
   try {
     const payload = {
       lessonId: lessonId,
       title: data.title.trim(),
       description: data.description.trim(),
       dueDate: data.dueDate, // Keep as YYYY-MM-DD string, API will handle it
     };

     if (isEditing) {
       // Update existing homework - MUST include id and createdAt
       payload.id = existingHomework.id; // ADD THIS!
       payload.createdAt =
         existingHomework.createdAt || new Date().toISOString();

       console.log("UPDATE payload:", payload);
       await updateHomework(existingHomework.id, payload);
     } else {
       // Create new homework
       payload.createdAt = new Date().toISOString(); // ISO string, not timestamp!

       console.log("CREATE payload:", payload);
       await createHomework(payload);
     }

     if (onSuccess) {
       onSuccess();
     }
   } catch (err) {
     console.error("Error saving homework:", err);
     console.log("Error response:", err.response?.data);

     alert(
       err.response?.data?.message ||
         `Kon huiswerk niet ${isEditing ? "bijwerken" : "aanmaken"}`
     );
   }
 };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="homework-form homework-form--teacher"
    >
      <h4 className="homework-form__title">
        {isEditing ? "Huiswerk Bewerken" : "Nieuw Huiswerk"}
      </h4>

      <div className="homework-form__field">
        <label htmlFor="title" className="homework-form__label">
          Titel *
        </label>
        <input
          id="title"
          type="text"
          className="homework-form__input"
          placeholder="Bijv: Werkblad 1"
          {...register("title", {
            required: "Titel is verplicht",
            minLength: {
              value: 3,
              message: "Titel moet minimaal 3 tekens bevatten",
            },
            maxLength: {
              value: 100,
              message: "Titel mag maximaal 100 tekens bevatten",
            },
          })}
        />
        {errors.title && (
          <span className="homework-form__error">{errors.title.message}</span>
        )}
      </div>

      <div className="homework-form__field">
        <label htmlFor="description" className="homework-form__label">
          Beschrijving *
        </label>
        <textarea
          id="description"
          className="homework-form__textarea"
          rows="5"
          placeholder="Maak oefeningen 1 t/m 10..."
          {...register("description", {
            required: "Beschrijving is verplicht",
            minLength: {
              value: 10,
              message: "Beschrijving moet minimaal 10 tekens bevatten",
            },
            maxLength: {
              value: 1000,
              message: "Beschrijving mag maximaal 1000 tekens bevatten",
            },
          })}
        />
        {errors.description && (
          <span className="homework-form__error">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="homework-form__field">
        <label htmlFor="dueDate" className="homework-form__label">
          Inleverdatum *
        </label>
        <input
          id="dueDate"
          type="date"
          className="homework-form__input"
          min={isEditing ? undefined : today}
          {...register("dueDate", {
            required: "Inleverdatum is verplicht",
            validate: (value) => {
              if (isEditing) return true; // Allow past dates when editing
              const selected = new Date(value);
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              return (
                selected >= now || "Inleverdatum moet in de toekomst liggen"
              );
            },
          })}
        />
        {errors.dueDate && (
          <span className="homework-form__error">{errors.dueDate.message}</span>
        )}
      </div>

      <div className="homework-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? "Bezig met bijwerken..."
              : "Bezig..."
            : isEditing
            ? "Bijwerken"
            : "Aanmaken"}
        </Button>
      </div>
    </form>
  );
}
