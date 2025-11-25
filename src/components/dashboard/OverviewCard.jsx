
import { Link } from "react-router-dom";
import "./OverviewCard.css";


export default function OverviewCard({
  title,
  moreTo,
  moreLabel = "Bekijk alles",
  children,
  className = "",
}) {
  return (
    <section className={`ovc ${className}`}>
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
