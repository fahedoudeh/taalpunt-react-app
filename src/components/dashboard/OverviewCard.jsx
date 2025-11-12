// src/components/dashboard/OverviewCard.jsx
import { Link } from "react-router-dom";
import "./OverviewCard.css";

/**
 * Usage:
 * <OverviewCard title="Aankomende lessen" moreTo="/lessons">
 *   {content here}
 * </OverviewCard>
 */
export default function OverviewCard({
  title,
  moreTo,
  moreLabel = "Bekijk alles",
  children,
}) {
  return (
    <section className="ovc">
      <header className="ovc__head">
        <h3 className="ovc__title">{title}</h3>
        {moreTo && (
          <Link to={moreTo} className="ovc__more">
            {moreLabel} →
          </Link>
        )}
      </header>
      <div className="ovc__body">{children}</div>
    </section>
  );
}
