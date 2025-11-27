import "./RightSidebar.css";
import WordOfTheDay from "../sidebar/WordOfTheDay";
import ExpressionOfTheDay from "../sidebar/ExpressionOfTheDay";
import { JOKES } from "../../../data/jokes";

const links = [
  { href: "/board", label: "Populaire berichten" },
  { href: "/activities", label: "Activiteiten in de buurt" },
  { href: "/lessons", label: "Alle lessen" },
];

function JokeOfTheDay() {
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const index = dayOfYear % JOKES.length;
  const joke = JOKES[index];

  return (
    <div className="right__card right__card--joke">
      <h3 className="right__title">Grap van de Dag</h3>
      <p className="right__joke-setup">{joke.setup}</p>
      <p className="right__joke-punchline">{joke.punchline}</p>
    </div>
  );
}

export default function RightSidebar() {
  return (
    <aside className="right">
      <WordOfTheDay />
      <ExpressionOfTheDay />
      <JokeOfTheDay />

      {/* HANDIGE LINKS - BLUE BORDER */}
      <div className="right__card right__card--links">
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
    </aside>
  );
}
