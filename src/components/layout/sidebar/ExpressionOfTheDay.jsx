// src/components/layout/sidebar/ExpressionOfTheDay.jsx
import { useState, useMemo } from "react";
import { EXPRESSIONS } from "../../../data/expressions";
import { todayPick } from "../../../helpers/dailyPick";
import "../sidebar/Sidebar.css";


export default function ExpressionOfTheDay() {
  const pick = useMemo(() => todayPick(EXPRESSIONS), []);
  const [open, setOpen] = useState(false);

  if (!pick) return null;

  return (
    <section className="side__section" aria-labelledby="eotd-title">
      <h3 id="eotd-title" className="side__title">
        Uitdrukking van de dag
      </h3>

      <div className="side__card">
        <div className="side__word">{pick.term}</div>
        <div className="side__muted">{pick.meaning}</div>

        <button
          type="button"
          className="side__linkbtn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          style={{ marginTop: ".5rem" }}
        >
          {open ? "Minder voorbeelden" : "Voorbeelden"}
        </button>

        {open && (
          <ul className="side__list" style={{ marginTop: ".4rem" }}>
            {pick.examples.slice(0, 3).map((ex, i) => (
              <li key={i} className="side__muted">
                • {ex}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
