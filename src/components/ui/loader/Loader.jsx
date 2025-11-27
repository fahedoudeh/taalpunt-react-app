import "./Loader.css";

export default function Loader({ label = "Laden…" }) {
  return (
    <div className="loader">
      <span className="spinner" aria-hidden="true" />
      <span className="loader__label" aria-live="polite">
        {label}
      </span>
    </div>
  );
}
