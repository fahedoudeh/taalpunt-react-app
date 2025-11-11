
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // or "teacher"
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
          roles: [form.role], // IMPORTANT: give the user a role
        },
        {
          headers: {
            "Content-Type": "application/json",
            "novi-education-project-id": PROJECT_ID,
          },
        }
      );

      setMsg("Account aangemaakt. Je kunt nu inloggen.");
      // Optionally auto-navigate to login after a short delay:
      setTimeout(() => navigate("/login"), 800);
    } catch (error) {
      setErr("Registreren mislukt. Controleer de velden en probeer opnieuw.");
      console.error("Register error:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <h2>Registreren</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          Gebruikersnaam
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          E-mail
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Wachtwoord
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </label>

        <fieldset style={{ border: "none", padding: 0, marginTop: 8 }}>
          <legend>Ik ben een: </legend>
          <label style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="role"
              value="user"
              checked={form.role === "user"}
              onChange={handleChange}
            />{" "}
            Cursist
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={form.role === "teacher"}
              onChange={handleChange}
            />{" "}
            Docent
          </label>
        </fieldset>

        {err && <p style={{ color: "crimson" }}>{err}</p>}
        {msg && <p style={{ color: "seagreen" }}>{msg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Bezig…" : "Account aanmaken"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Al een account? <Link to="/login">Log hier in</Link>
      </p>
    </div>
  );
}
