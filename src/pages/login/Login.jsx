import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const API = import.meta.env.VITE_API_URL; // e.g. https://.../api
    const PROJECT_ID = import.meta.env.VITE_NOVI_PROJECT_ID;

    try {
      const res = await axios.post(
        `${API}/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            "novi-education-project-id": PROJECT_ID,
          },
        }
      );

      
      const token = res.data.token;
      if (!token) throw new Error("Geen token in response.");

      localStorage.setItem("token", token);
      navigate("/"); // go to Dashboard
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) setErr("Onjuiste inloggegevens.");
      else setErr("Inloggen mislukt. Probeer opnieuw.");
      console.error("Login error:", error?.response?.data || error.message);
    }
  }

  return (
    <div className="login-page">
      <h2>Inloggen</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label>
          Wachtwoord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {err && <p style={{ color: "crimson" }}>{err}</p>}

        <button type="submit">Inloggen</button>
      </form>
    </div>
  );
}
