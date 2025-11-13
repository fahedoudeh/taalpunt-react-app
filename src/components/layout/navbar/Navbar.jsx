// src/components/layout/navbar/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  // Returns class based on active route
  const linkClass = ({ isActive }) =>
    isActive ? "nav__link nav__link--active" : "nav__link";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="nav__brand">
        <NavLink to="/" className={linkClass} end>
          Taalpunt
        </NavLink>
      </div>

      {isAuth && (
        <div className="nav__links">
          <NavLink to="/" className={linkClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/lessons" className={linkClass}>
            Lessen
          </NavLink>
          <NavLink to="/activities" className={linkClass}>
            Activiteiten
          </NavLink>
          <NavLink to="/board" className={linkClass}>
            Board
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profiel
          </NavLink>
        </div>
      )}

      <div className="nav__actions">
        {isAuth ? (
          <button type="button" onClick={handleLogout} className="nav__btn">
            Uitloggen
          </button>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              Inloggen
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Registreren
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
