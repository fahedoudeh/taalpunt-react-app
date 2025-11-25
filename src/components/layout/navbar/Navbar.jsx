
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  Users,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import "./Navbar.css";
import logo from "../../../assets/images/taalpunt-logo.png";

export default function Navbar() {
  const { user, isAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const roles = user?.roles || [];
  const isTeacherOrAdmin = roles.includes("teacher") || roles.includes("admin");

  const displayName = user?.username || user?.email || "Gebruiker";

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
            <img
              src={logo}
              alt="Taalpunt Kapelle"
              className="navbar__logo-img"
            />
            <div className="navbar__brand-text">
              <span className="navbar__brand-name">Taalpunt</span>
              <span className="navbar__brand-tagline">
                Koffie, thee en taal – een goed verhaal
              </span>
            </div>
          </div>

          <nav className="navbar__auth-links">
            <NavLink to="/login" className="navbar__link">
              Inloggen
            </NavLink>
            <NavLink
              to="/register"
              className="navbar__link navbar__link--primary"
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
        {/* Left: Brand */}
        <div className="navbar__brand">
          {logo ? (
            <img
              src={logo}
              alt="Taalpunt Kapelle"
              className="navbar__logo-img"
            />
          ) : (
            <div className="navbar__logo-circle">T</div>
          )}
          <div className="navbar__brand-text">
            <span className="navbar__brand-name">Taalpunt</span>
            <span className="navbar__brand-tagline">
              Koffie, thee en taal – een goed verhaal
            </span>
          </div>
        </div>

        {/* Center: Navigation */}
        <nav className="navbar__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__nav-item ${isActive ? "navbar__nav-item--active" : ""}`
            }
          >
            <Home size={20} />
            <span>Overzicht</span>
          </NavLink>

          <NavLink
            to="/lessons"
            className={({ isActive }) =>
              `navbar__nav-item ${isActive ? "navbar__nav-item--active" : ""}`
            }
          >
            <BookOpen size={20} />
            <span>Lessen</span>
          </NavLink>

          <NavLink
            to="/homework"
            className={({ isActive }) =>
              `navbar__nav-item ${isActive ? "navbar__nav-item--active" : ""}`
            }
          >
            <ClipboardList size={20} />
            <span>Huiswerk</span>
          </NavLink>

          <NavLink
            to="/activities"
            className={({ isActive }) =>
              `navbar__nav-item ${isActive ? "navbar__nav-item--active" : ""}`
            }
          >
            <Calendar size={20} />
            <span>Evenementen</span>
          </NavLink>

          <NavLink
            to="/board"
            end
            className={({ isActive }) =>
              `navbar__nav-item ${isActive ? "navbar__nav-item--active" : ""}`
            }
          >
            <MessageSquare size={20} />
            <span>Prikbord</span>
          </NavLink>

          {isTeacherOrAdmin && (
            <>
              <NavLink
                to="/teachers-board"
                className={({ isActive }) =>
                  `navbar__nav-item ${
                    isActive ? "navbar__nav-item--active" : ""
                  }`
                }
              >
                <Users size={20} />
                <span>Docentenkamer</span>
              </NavLink>

              <NavLink
                to="/teachers-room"
                className={({ isActive }) =>
                  `navbar__nav-item ${
                    isActive ? "navbar__nav-item--active" : ""
                  }`
                }
              >
                <GraduationCap size={20} />
                <span>Docenten</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Right: User menu */}
        <div className="navbar__user">
          <button
            type="button"
            className="navbar__user-trigger"
            onClick={toggleMenu}
          >
            <div className="navbar__user-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="navbar__user-name">{displayName}</span>
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
