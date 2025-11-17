// src/components/layout/sidebar/Sidebar.jsx
import "./Sidebar.css";
import { useAuth } from "../../../contexts/AuthContext";
import { Link, NavLink } from "react-router-dom";
import UpcomingSidebar from "./UpcomingSidebar";

export default function Sidebar() {
  const { email, role, logout } = useAuth();
  const isTeacher = role === "teacher" || role === "admin";

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

          {isTeacher && (
            <>
              <Link className="side__btn" to="/teachers-board">
                + Docentenbericht
              </Link>
              <Link className="side__btn" to="/lessons">
                + Nieuwe les
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Binnenkort: komende lessen & activiteiten */}
      <UpcomingSidebar />

      {/* Compact profile card */}
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
            <button
              type="button"
              className="side__linkbtn side__linkbtn--logout"
              onClick={logout}
            >
              Uitloggen
            </button>
          </div>
        </div>
      </section>

      {/* Navigation to main parts of the app */}
      <section className="side__section">
        <h3 className="side__title">Taalpunt</h3>
        <nav className="side__nav">
          <NavLink
            to="/lessons"
            className={({ isActive }) =>
              `side__navlink ${isActive ? "side__navlink--active" : ""}`
            }
          >
            Lessen
          </NavLink>
          <NavLink
            to="/activities"
            className={({ isActive }) =>
              `side__navlink ${isActive ? "side__navlink--active" : ""}`
            }
          >
            Activiteiten
          </NavLink>
          <NavLink
            to="/board"
            className={({ isActive }) =>
              `side__navlink ${isActive ? "side__navlink--active" : ""}`
            }
          >
            Community board
          </NavLink>

          {isTeacher && (
            <NavLink
              to="/teachers-board"
              className={({ isActive }) =>
                `side__navlink ${isActive ? "side__navlink--active" : ""}`
              }
            >
              Docentenboard
            </NavLink>
          )}
        </nav>
      </section>
    </aside>
  );
}
