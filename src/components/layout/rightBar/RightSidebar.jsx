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
    "Voeg aan je soep een laurierblad toe voor extra diepte.",
    "Kook aardappels met schil: meer smaak, minder werk.",
    "Bak uien langzaam: zo worden ze zoet en zacht.",
  ];
  const i = new Date().getDate() % tips.length;
  return (
    <div className="right__card">
      <div className="right__title">Kooktip van de dag</div>
      <p>{tips[i]}</p>
    </div>
  );
}

export default function RightSidebar() {
  return (
    <aside className="right">
      <section className="right__section">
        <WordOfTheDay />
        <ExpressionOfTheDay />
      </section>

      <CookingTip />

      <div className="right__card">
        <div className="right__title">Handige links</div>
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
    </aside>
  );
}
