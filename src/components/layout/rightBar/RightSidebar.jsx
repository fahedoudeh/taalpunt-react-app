// src/components/layout/rightBar/RightSidebar.jsx
import "./RightSidebar.css";
import WordOfTheDay from "../sidebar/WordOfTheDay";
import ExpressionOfTheDay from "../sidebar/ExpressionOfTheDay";

const links = [
  { href: "/board", label: "📣 Populaire berichten" },
  { href: "/activities", label: "🎈 Activiteiten in de buurt" },
  { href: "/lessons", label: "📘 Alle lessen" },
];

function CookingTip() {
  const tips = [
    "Voeg een laurierblad toe aan soep voor extra diepte.",
    "Kook aardappels met schil: meer smaak en minder werk.",
    "Bak uien langzaam voor een zoete, zachte smaak.",
  ];
  const index = new Date().getDate() % tips.length;
  return (
    <div className="right__card">
      <h3 className="right__title">Kooktip van de dag</h3>
      <p>{tips[index]}</p>
    </div>
  );
}

export default function RightSidebar() {
  return (
    <aside className="right">
      {/* Word + Expression */}
      <section className="right__section">
        <div className="right__card">
          <WordOfTheDay />
        </div>

        <div className="right__card">
          <ExpressionOfTheDay />
        </div>
      </section>

      {/* Cooking tip */}
      <section className="right__section">
        <CookingTip />
      </section>

      {/* Handige links */}
      <section className="right__section">
        <div className="right__card">
          <h3 className="right__title">Handige links</h3>
          <ul className="right__list">
            {links.map((l) => (
              <li key={l.href}>
                <a className="right__link" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </aside>
  );
}
