// src/components/layout/sidebar/ExpressionOfTheDay.jsx
import { useState, useMemo } from "react";
import { EXPRESSIONS } from "../../../data/expressions";
import { todayPick } from "../../../helpers/dailyPick";

export default function ExpressionOfTheDay() {
  const pick = useMemo(() => todayPick(EXPRESSIONS), []);
  const [open, setOpen] = useState(false);

  if (!pick) return null;

  return (
    <div className="right__card">
      <h4 className="right__title">Uitdrukking van de dag</h4>

      <div className="daily-term">{pick.term}</div>
      <p className="daily-meaning">{pick.meaning}</p>

      <button
        type="button"
        className="daily-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Minder voorbeelden" : "Voorbeelden"}
      </button>

      {open && (
        <ul className="daily-examples">
          {pick.examples.slice(0, 3).map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
