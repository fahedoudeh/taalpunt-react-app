// src/components/ui/empty/EmptyState.jsx
import { Link } from "react-router-dom";
import "./EmptyState.css";

export default function EmptyState({
  title = "Geen resultaten",
  actionLabel,
  to,
}) {
  return (
    <div className="empty">
      <p className="empty__title">{title}</p>
      {to && actionLabel && (
        <Link className="empty__link" to={to}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
