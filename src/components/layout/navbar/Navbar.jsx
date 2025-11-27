import { useState, useEffect } from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
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
import TaalpuntLogo from "../../ui/logo/TaalpuntLogo";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // NO NAVBAR ON LOGIN/REGISTER
  if (!isAuth) {
    return null;
  }

  // PRIVATE NAVBAR (LOGGED IN)
  return (
    <header className="navbar">
      <div className="navbar__inner">
      
        <Link to="/" className="navbar__brand">
          <TaalpuntLogo width={140} height={42} />
          <div className="navbar__brand-text">
            <span className="navbar__brand-tagline">
              Koffie, thee, taal én een goed verhaal
            </span>
          </div>
        </Link>

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
                <span>Docentenbord</span>
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
