import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./Navbar.css";
import logo from "../../../assets/images/taalpunt_logo.png"; 

// Simple one-color SVG-like icons (temporary, replace later)
function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-4h-3v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LessonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M5 5a2 2 0 0 1 2-2h10a1 1 0 0 1 .8 1.6L16 8l1.8 3.4A1 1 0 0 1 17 13H7a2 2 0 0 1-2-2V5Z"
        fill="currentColor"
      />
      <path
        d="M5 14a1 1 0 0 1 1-1h11v3a3 3 0 0 1-3 3H9a4 4 0 0 1-4-4v-1Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function ActivityIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 6a2 2 0 0 1 2-2h4.5a2 2 0 0 1 1.6.8l1 1.3H18a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
        fill="currentColor"
      />
      <path
        d="M9 10.5h6M9 14h3"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 6a2 2 0 0 1 2-2h12a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2h-2.2L13 20.5a1 1 0 0 1-1.2 0L8.2 18H6a2 2 0 0 1-2-2V6Z"
        fill="currentColor"
      />
      <path
        d="M9 9.5h6M9 12h4"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TeacherBoardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 7a2 2 0 0 1 2-2h12a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2h-4.5L10 18.5 9 15H6a2 2 0 0 1-2-2V7Z"
        fill="currentColor"
      />
      <circle cx="8" cy="8.5" r="1.2" fill="#fff" />
      <circle cx="12" cy="8.5" r="1.2" fill="#fff" />
      <circle cx="16" cy="8.5" r="1.2" fill="#fff" />
    </svg>
  );
}

function RoomIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M5 5a2 2 0 0 1 2-2h10a1 1 0 0 1 1 1v12h1a1 1 0 0 1 0 2H5a2 2 0 0 1-2-2V5Z"
        fill="currentColor"
      />
      <path
        d="M8 11.5h6M8 8.5h8"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const { user, isAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const role = user?.role;
  const roles = user?.roles || [];

  const isTeacherOrAdmin =
    role === "teacher" ||
    role === "docent" ||
    role === "admin" ||
    roles.includes("teacher") ||
    roles.includes("docent") ||
    roles.includes("admin");

  const displayName = user?.username || user?.email || "Taalpunt gebruiker";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGoProfile = () => {
    setIsMenuOpen(false);
    navigate("/profile");
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Public navbar (not logged in)
  if (!isAuth) {
    return (
      <header className="navbar navbar--public">
        <div className="navbar__inner">
          <div className="navbar__brand">
            {logo ? (
              <img
                src={logo}
                alt="Taalpunt Kapelle"
                className="navbar__logo-img"
              />
            ) : (
              <span className="navbar__logo-circle">T</span>
            )}
            <span className="navbar__brand-text">
              <span className="navbar__brand-name">Taalpunt</span>
              <span className="navbar__brand-sub">Kapelle</span>
              <span className="navbar__brand-tagline">
                Koffie, thee en taal – een goed verhaal
              </span>
            </span>
          </div>

          <nav className="navbar__auth-links">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
            >
              Inloggen
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `navbar__link navbar__link--primary ${
                  isActive ? "navbar__link--active-primary" : ""
                }`
              }
            >
              Registreren
            </NavLink>
          </nav>
        </div>
      </header>
    );
  }

  // Private navbar (logged in)
  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Left: brand + slogan */}
        <div className="navbar__brand">
          {logo ? (
            <img
              src={logo}
              alt="Taalpunt Kapelle"
              className="navbar__logo-img"
            />
          ) : (
            <span className="navbar__logo-circle">T</span>
          )}
          <span className="navbar__brand-text">
            <span className="navbar__brand-tagline">
              Koffie, thee en taal – een goed verhaal
            </span>
          </span>
        </div>

        {/* Middle: large icons with labels, filling the mid section */}
        <nav className="navbar__nav navbar__nav--icons">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__icon-link ${isActive ? "navbar__icon-link--active" : ""}`
            }
          >
            <HomeIcon className="navbar__icon" />
            <span className="navbar__icon-label">Startpagina</span>
          </NavLink>

          <NavLink
            to="/lessons"
            className={({ isActive }) =>
              `navbar__icon-link ${isActive ? "navbar__icon-link--active" : ""}`
            }
          >
            <LessonIcon className="navbar__icon" />
            <span className="navbar__icon-label">Lessen</span>
          </NavLink>

          <NavLink
            to="/activities"
            className={({ isActive }) =>
              `navbar__icon-link ${isActive ? "navbar__icon-link--active" : ""}`
            }
          >
            <ActivityIcon className="navbar__icon" />
            <span className="navbar__icon-label">Activiteiten</span>
          </NavLink>

          <NavLink
            to="/board"
            className={({ isActive }) =>
              `navbar__icon-link ${isActive ? "navbar__icon-link--active" : ""}`
            }
          >
            <BoardIcon className="navbar__icon" />
            <span className="navbar__icon-label">Community board</span>
          </NavLink>

          {isTeacherOrAdmin && (
            <>
              <NavLink
                to="/teachers-board"
                className={({ isActive }) =>
                  `navbar__icon-link ${
                    isActive ? "navbar__icon-link--active" : ""
                  }`
                }
              >
                <TeacherBoardIcon className="navbar__icon" />
                <span className="navbar__icon-label">Docentenboard</span>
              </NavLink>

              <NavLink
                to="/teachers-room"
                className={({ isActive }) =>
                  `navbar__icon-link ${
                    isActive ? "navbar__icon-link--active" : ""
                  }`
                }
              >
                <RoomIcon className="navbar__icon" />
                <span className="navbar__icon-label">Docentenkamer</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Right: user dropdown (profile + logout) */}
        <div className="navbar__user">
          <button
            type="button"
            className="navbar__user-menu-trigger"
            onClick={toggleMenu}
          >
            <span className="navbar__user-initial">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <span className="navbar__user-name">{displayName}</span>
            <span className="navbar__user-caret">▾</span>
          </button>

          {isMenuOpen && (
            <div className="navbar__user-menu">
              <button
                type="button"
                className="navbar__user-menu-item"
                onClick={handleGoProfile}
              >
                Profiel
              </button>
              <button
                type="button"
                className="navbar__user-menu-item navbar__user-menu-item--danger"
                onClick={handleLogout}
              >
                Uitloggen
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
