import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "./OverviewCard.css";

export default function OverviewCard({ 
  title, 
  children, 
  moreTo, 
  className = "" 
}) {
  return (
    <div className={`overview-card ${className}`}>
      <div className="overview-card__header">
        <h2 className="overview-card__title">{title}</h2>
      </div>

      <div className="overview-card__content">
        {children}
      </div>

      {moreTo && (
        <div className="overview-card__footer">
          <Link to={moreTo} className="overview-card__link">
            <span>Bekijk alles</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}