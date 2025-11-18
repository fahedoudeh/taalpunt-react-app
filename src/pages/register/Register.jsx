import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/ui/button/Button";
import "./Register.css"

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL;
      const PROJECT_ID = import.meta.env.VITE_NOVI_PROJECT_ID;

      await axios.post(
        `${API}/users`,
        {
          email: form.email,
          password: form.password,
          username: form.username,
          roles: [form.role],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "novi-education-project-id": PROJECT_ID,
          },
        }
      );

      setMsg("Account aangemaakt. Je kunt nu inloggen.");
      setTimeout(() => navigate("/login"), 800);
    } catch (error) {
      setErr("Registreren mislukt. Controleer de velden en probeer opnieuw.");
      console.error("Register error:", error?.response?.data || error.message);
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
            Maak een account aan als cursist of docent en sluit je aan bij
            Taalpunt Kapelle.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="username">
              Gebruikersnaam
            </label>
            <input
              id="username"
              name="username"
              className="auth-input"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="auth-input"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="auth-input"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <p className="auth-hint">
              Minimaal 8 tekens, bij voorkeur met hoofdletter, kleine letter en
              cijfer.
            </p>
          </div>

          <fieldset className="auth-fieldset">
            <legend className="auth-legend">Ik ben een:</legend>
            <label className="auth-radio">
              <input
                type="radio"
                name="role"
                value="user"
                checked={form.role === "user"}
                onChange={handleChange}
              />
              <span>Cursist</span>
            </label>
            <label className="auth-radio">
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={form.role === "teacher"}
                onChange={handleChange}
              />
              <span>Docent</span>
            </label>
          </fieldset>

          {err && <p className="auth-message auth-message--error">{err}</p>}
          {msg && <p className="auth-message auth-message--success">{msg}</p>}

          <Button
            type="submit"
            variant="accent"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? "Bezig…" : "Account aanmaken"}
          </Button>
        </form>

        <p className="auth-footer-text">
          Al een account?{" "}
          <Link to="/login" className="auth-link">
            Log hier in
          </Link>
        </p>
      </div>
    </div>
  );
}
