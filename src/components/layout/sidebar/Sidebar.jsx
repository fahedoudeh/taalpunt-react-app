// src/components/layout/sidebar/Sidebar.jsx
import "./Sidebar.css";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const { email, role, logout } = useAuth();

  return (
    <aside className="side" aria-label="Zijbalk">
      {/* Quick Actions */}
      <section className="side__section">
        <h3 className="side__title">Snelkoppelingen</h3>
        <div className="side__stack">
          <Link className="side__btn" to="/board">
            + Nieuw bericht
          </Link>
          <Link className="side__btn" to="/activities">
            + Nieuwe activiteit
          </Link>
          <Link className="side__btn" to="/lessons">
            + Nieuwe les
          </Link>
        </div>
      </section>

      {/* Today’s bits (placeholders; will wire in U2/U3) */}
      <section className="side__section">
        <h3 className="side__title">Woord van de dag</h3>
        <div className="side__card">
          <div className="side__word">—</div>
          <div className="side__muted">
            Klik straks voor betekenis & voorbeelden
          </div>
        </div>
      </section>

      <section className="side__section">
        <h3 className="side__title">Uitdrukking van de dag</h3>
        <div className="side__card">
          <div className="side__word">—</div>
          <div className="side__muted">Komt zo meteen tot leven</div>
        </div>
      </section>

      {/* Upcoming (will wire in U4) */}
      <section className="side__section">
        <h3 className="side__title">Binnenkort</h3>
        <ul className="side__list">
          <li className="side__muted">
            Lessen & activiteiten verschijnen hier
          </li>
        </ul>
      </section>

      {/* Profile mini-card */}
      <section className="side__section">
        <h3 className="side__title">Profiel</h3>
        <div className="side__card">
          <div className="side__row">
            <span className="side__label">E-mail</span>
            <span className="side__value">{email ?? "—"}</span>
          </div>
          <div className="side__row">
            <span className="side__label">Rol</span>
            <span className="side__value">{role ?? "user"}</span>
          </div>
          <div className="side__actions">
            <Link to="/profile" className="side__linkbtn">
              Naar profiel
            </Link>
            <button type="button" className="side__linkbtn" onClick={logout}>
              Uitloggen
            </button>
          </div>
        </div>
      </section>

      {/* Helpful links */}
      <section className="side__section">
        <h3 className="side__title">Handig</h3>
        <ul className="side__list">
          <li>
            <Link to="/board" className="side__link">
              Community board
            </Link>
          </li>
          <li>
            <a
              className="side__link"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Handleiding (binnenkort)
            </a>
          </li>
        </ul>
      </section>
    </aside>
  );
}
