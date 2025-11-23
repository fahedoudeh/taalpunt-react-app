import "./Sidebar.css";
import { useAuth } from "../../../contexts/AuthContext";
import { Link, NavLink } from "react-router-dom";
import UpcomingSidebar from "./UpcomingSidebar";

export default function Sidebar() {
  const { user, logout } = useAuth() || {};

  // derive values from user
  const email = user?.email ?? null;
  const roles = Array.isArray(user?.roles) ? user.roles : [];

  const displayName = user?.username || email || "Taalpunt gebruiker";

  const hasAdminRole = roles.includes("admin");
  const hasTeacherRole = roles.includes("teacher") || roles.includes("docent");
  const isTeacher = hasTeacherRole || hasAdminRole;

  const roleLabel = hasAdminRole ? "Admin" : isTeacher ? "Docent" : "Cursist";

  return (
    <aside className="side" aria-label="Zijbalk">
      {/* Snelkoppelingen */}
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

      {/* Binnenkort */}
      <UpcomingSidebar />

      {/* Profielkaart */}
      <section className="side__section">
        <h3 className="side__title">Profiel</h3>

        <div className="side__card">
          <div className="side__row">
            <span className="side__label">Ingelogd als</span>
            <span className="side__value">{displayName}</span>
          </div>

          <div className="side__row">
            <span className="side__label">E-mail</span>
            <span className="side__value">{email ?? "—"}</span>
          </div>

          <div className="side__row">
            <span className="side__label">Rol</span>
            <span className="side__value">{roleLabel}</span>
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

      {/* Navigatie */}
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
