import { useForm } from "react-hook-form";
import {
  getActivities,
  createActivity,
} from "../../../services/activityService";
import { useAuth } from "../../../contexts/AuthContext";
import { useState } from "react";

const friendlyError = (e, d) =>
  e?.code === "ECONNABORTED"
    ? "De server reageert traag. Probeer het zo nog eens."
    : d;

export default function ActivityForm({ onCreated }) {
  const { user } = useAuth();
  const userId = user?.userId;

  

  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      type: "Gemeenschapsevenement",
    },
  });

  const onSubmit = async (v) => {
    setServerError("");
    try {
      const listRes = await getActivities();
      const list = Array.isArray(listRes?.data) ? listRes.data : [];
      const nextId =
        (list.reduce((m, it) => Math.max(m, Number(it?.id || 0)), 0) || 0) + 1;

      const payload = {
        id: nextId,
        title: v.title.trim(),
        description: v.description.trim(),
        date: v.date, // YYYY-MM-DD
        startTime: v.startTime, // "HH:MM"
        endTime: v.endTime, // "HH:MM"
        location: v.location.trim(),
        type: v.type.trim(),
        creatorId: Number(userId),
      };

      const res = await createActivity(payload);
      onCreated?.(res.data);
      reset();
    } catch (e) {
      console.error("Activity create error:", e?.response?.data || e.message);
      setServerError(friendlyError(e, "Kon activiteit niet opslaan."));
    }
  };

  return (
    <form
      className="activity-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {serverError && (
        <p className="form-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="form-row">
        <label htmlFor="af-title">Titel</label>
        <input
          id="af-title"
          {...register("title", {
            required: "Verplicht",
            minLength: { value: 3, message: "Min. 3 tekens" },
            maxLength: { value: 150, message: "Max. 150 tekens" },
          })}
        />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="af-desc">Beschrijving</label>
        <textarea
          id="af-desc"
          rows={4}
          {...register("description", {
            required: "Verplicht",
            minLength: { value: 10, message: "Min. 10 tekens" },
            maxLength: { value: 1000, message: "Max. 1000 tekens" },
          })}
        />
        {errors.description && (
          <p className="form-error">{errors.description.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="af-date">Datum</label>
        <input
          id="af-date"
          type="date"
          {...register("date", {
            required: "Verplicht",
            pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: "JJJJ-MM-DD" },
          })}
        />
        {errors.date && <p className="form-error">{errors.date.message}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="af-start">Starttijd</label>
        <input
          id="af-start"
          type="time"
          {...register("startTime", {
            required: "Verplicht",
            minLength: { value: 5, message: "HH:MM" },
            maxLength: { value: 5, message: "HH:MM" },
          })}
        />
        {errors.startTime && (
          <p className="form-error">{errors.startTime.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="af-end">Eindtijd</label>
        <input
          id="af-end"
          type="time"
          {...register("endTime", {
            required: "Verplicht",
            minLength: { value: 5, message: "HH:MM" },
            maxLength: { value: 5, message: "HH:MM" },
          })}
        />
        {errors.endTime && (
          <p className="form-error">{errors.endTime.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="af-location">Locatie</label>
        <input
          id="af-location"
          {...register("location", {
            required: "Verplicht",
            minLength: { value: 3, message: "Min. 3 tekens" },
            maxLength: { value: 200, message: "Max. 200 tekens" },
          })}
        />
        {errors.location && (
          <p className="form-error">{errors.location.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="af-type">Type</label>
        <input
          id="af-type"
          {...register("type", {
            required: "Verplicht",
            minLength: { value: 3, message: "Min. 3 tekens" },
            maxLength: { value: 50, message: "Max. 50 tekens" },
          })}
        />
        {errors.type && <p className="form-error">{errors.type.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Opslaan…" : "Opslaan"}
      </button>
    </form>
  );
}
