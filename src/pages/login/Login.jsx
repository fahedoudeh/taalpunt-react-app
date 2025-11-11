import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// DRY service instead of axios directly
import { loginRequest } from "../../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // shared api client adds headers/token/timeout
      const res = await loginRequest({ email, password });

      // The NOVI API usually returns token:
      const token = res.data?.token || res.data?.jwt;
      if (!token) throw new Error("Geen token in response.");

      localStorage.setItem("token", token);
      navigate("/"); // go to Dashboard
    } catch (e) {
      // timeout-friendly message
      if (e.code === "ECONNABORTED")
        setErr("De server reageert traag. Probeer het zo nog eens.");
      else if (e?.response?.status === 401) setErr("Onjuiste inloggegevens.");
      else setErr("Inloggen mislukt. Probeer opnieuw.");
      console.error("Login error:", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <h2>Inloggen</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />

        <label htmlFor="password">Wachtwoord</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {err && <p style={{ color: "crimson" }}>{err}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Bezig…" : "Inloggen"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Nog geen account? <Link to="/register">Maak er één aan</Link>
      </p>
    </div>
  );
}
