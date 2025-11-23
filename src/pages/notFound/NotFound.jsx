// src/pages/notFound/NotFound.jsx
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/ui/button/Button";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  const goBack = () => {
    // If there is no history, just go home
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <p className="notfound-kicker">Oeps…</p>
        <h1 className="notfound-title">Pagina niet gevonden</h1>
        <p className="notfound-text">
          Deze Taalpunt-pagina bestaat niet (meer). Controleer de URL of ga
          terug naar de startpagina.
        </p>

        <div className="notfound-actions">
          <Button variant="primary" onClick={() => navigate("/")}>
            Naar startpagina
          </Button>
          <Button variant="secondary" onClick={goBack}>
            Terug naar vorige pagina
          </Button>
        </div>

        <p className="notfound-hint">
          Of ga naar het{" "}
          <Link to="/board" className="notfound-link">
            community board
          </Link>{" "}
          om iets leuks te lezen.
        </p>
      </div>
    </div>
  );
}
