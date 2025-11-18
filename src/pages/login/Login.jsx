import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginRequest } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import Button from "../../components/ui/button/Button";
import "./Login.css"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await loginRequest({ email, password });

      const token = res.data?.token || res.data?.jwt;
      if (!token) throw new Error("Geen token in response.");

      const decodedT = jwtDecode(token);
      console.log("payload of the token", decodedT);

      login(token);
      navigate(from, { replace: true });
    } catch (e) {
      if (e.code === "ECONNABORTED") {
        setErr("De server reageert traag. Probeer het zo nog eens.");
      } else if (e?.response?.status === 401) {
        setErr("Onjuiste inloggegevens.");
      } else {
        setErr("Inloggen mislukt. Probeer opnieuw.");
      }
      console.error("Login error:", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">
            <span className="auth-logo-main">Taal</span>
            <span className="auth-logo-accent">punt</span>
          </div>
          <p className="auth-tagline">
            Koffie, thee en taal – een goed verhaal.
          </p>
          <p className="auth-intro">
            Log in om je lessen, activiteiten en het Taalpunt-board te zien.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {err && <p className="auth-message auth-message--error">{err}</p>}

          <Button
            type="submit"
            variant="accent"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? "Bezig…" : "Inloggen"}
          </Button>
        </form>

        <p className="auth-footer-text">
          Nog geen account?{" "}
          <Link to="/register" className="auth-link">
            Maak er één aan
          </Link>
        </p>
      </div>
    </div>
  );
}
