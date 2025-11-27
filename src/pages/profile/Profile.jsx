import { useAuth } from "../../contexts/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();

  const displayName = user?.username || user?.email || "Taalpunt gebruiker";
  const email = user?.email ?? "–";
  const role = user?.role || (user?.roles?.[0] ?? "user");

  const isTeacher =
    role === "teacher" ||
    role === "docent" ||
    role === "admin" ||
    (user?.roles || []).includes("teacher") ||
    (user?.roles || []).includes("docent") ||
    (user?.roles || []).includes("admin");

  const roleLabel = isTeacher
    ? role === "admin"
      ? "Admin"
      : "Docent"
    : "Cursist";

  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="profile-page">
      <section className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="profile-avatar__initial">{initials}</span>
          </div>

          <div className="profile-header__text">
            <h1 className="profile-name">{displayName}</h1>
            <div className="profile-meta">
              <span className="profile-role-pill">{roleLabel}</span>
              <span className="profile-email">{email}</span>
            </div>
          </div>
        </div>

        <div className="profile-body">
          <section className="profile-section">
            <h2 className="profile-section__title">Accountinformatie</h2>
            <dl className="profile-info-list">
              <div className="profile-info-row">
                <dt>E-mail</dt>
                <dd>{email}</dd>
              </div>
              <div className="profile-info-row">
                <dt>Rol</dt>
                <dd>{roleLabel}</dd>
              </div>
            </dl>
          </section>

          <section className="profile-section profile-section--grid">
            <h2 className="profile-section__title">Overzicht</h2>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat__label">Lessen</span>
                <span className="profile-stat__value">—</span>
                <span className="profile-stat__hint">
                  Later tonen we hier je ingeplande lessen.
                </span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__label">Activiteiten</span>
                <span className="profile-stat__value">—</span>
                <span className="profile-stat__hint">
                  Hier komen activiteiten waar je aan meedoet.
                </span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__label">Berichten</span>
                <span className="profile-stat__value">—</span>
                <span className="profile-stat__hint">
                  Aantal geplaatste berichten op het board.
                </span>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
