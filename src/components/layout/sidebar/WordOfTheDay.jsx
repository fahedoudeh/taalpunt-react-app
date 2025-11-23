// src/components/layout/sidebar/WordOfTheDay.jsx
import { useState, useMemo } from "react";
import { WORDS } from "../../../data/words";
import { todayPick } from "../../../helpers/dailyPick";
import "../sidebar/Sidebar.css"; // reuse same styles

export default function WordOfTheDay() {
  // pick is deterministic per calendar day
  const pick = useMemo(() => todayPick(WORDS), []);
  const [open, setOpen] = useState(false);

  if (!pick) return null;

  return (
    <section className="side__section" aria-labelledby="wotd-title">
      <h3 id="wotd-title" className="side__title">
        Woord van de dag
      </h3>

      <div className="side__card">
        <div className="side__word">{pick.term}</div>
        <div className="side__muted">{pick.meaning}</div>

        <button
          type="button"
          className="side__linkbtn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
         
        >
          {open ? "Minder voorbeelden" : "Voorbeelden"}
        </button>

        {open && (
          <ul className="side__list">
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
