import "./RightSidebar.css";
import WordOfTheDay from "../sidebar/WordOfTheDay";
import ExpressionOfTheDay from "../sidebar/ExpressionOfTheDay";
import { JOKES } from "../../../data/jokes";

const links = [
  { href: "https://www.memrise.com", label: "Memrise – Leer meerdere talen" },
  {
    href: "https://zichtbaarnederlands.nl/",
    label: "Zichtbaar Nederlands – Grammatica",
  },
  { href: "https://spreekwoorden.nl/", label: "Spreekwoorden – Overzicht" },
  { href: "https://www.deepl.com/en/translator", label: "DeepL – Vertalen" },
  { href: "https://mowb.muiswerken.nl/", label: "Muiswerk – Woordenboek" },
  {
    href: "https://oefenen.nl/program/overview",
    label: "Oefenen.nl – Taalprogramma’s",
  },
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

      {/* HANDIGE LINKSright */}
      <div className="right__card right__card--links">
        <h3 className="right__title">Handige links</h3>
        <ul className="right__list">
          {links.map((l) => (
            <li key={l.href}>
              <a target="_blank" className="right__link" href={l.href}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
