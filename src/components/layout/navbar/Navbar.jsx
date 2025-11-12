
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; 

export default function Navbar() {
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clears token + state
    navigate("/login"); // go to login
  };

  return (
    <nav className="navbar">
      <Link to="/">Taalpunt</Link>

      <div className="nav-actions">
        {isAuth ? (
          <>
            <Link to="/profile">Profiel</Link>
            <button type="button" onClick={handleLogout}>
              Uitloggen
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Inloggen</Link>
            <Link to="/register">Registreren</Link>
          </>
        )}
      </div>
    </nav>
  );
}
