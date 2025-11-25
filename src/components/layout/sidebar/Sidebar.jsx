// src/components/layout/sidebar/Sidebar.jsx
import "./Sidebar.css";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import UpcomingSidebar from "./UpcomingSidebar";

export default function Sidebar() {
  const { user, logout } = useAuth() || {};

  const email = user?.email ?? null;
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const displayName = user?.username || email || "Taalpunt gebruiker";

  const hasAdminRole = roles.includes("admin");
  const hasTeacherRole = roles.includes("teacher") || roles.includes("docent");
  const roleLabel = hasAdminRole
    ? "Admin"
    : hasTeacherRole
    ? "Docent"
    : "Cursist";

  return (
    <aside className="sidebar">
      {/* Binnenkort + Laatste Berichten */}
      <UpcomingSidebar />

      {/* Profile Card */}
      <div className="sidebar-card">
        <h3 className="sidebar-card__title">Profiel</h3>

        <div className="profile-info">
          <div className="profile-info__row">
            <span className="profile-info__label">Ingelogd als</span>
            <span className="profile-info__value">{displayName}</span>
          </div>

          <div className="profile-info__row">
            <span className="profile-info__label">E-mail</span>
            <span className="profile-info__value">{email ?? "—"}</span>
          </div>

          <div className="profile-info__row">
            <span className="profile-info__label">Rol</span>
            <span className="profile-info__value">{roleLabel}</span>
          </div>
        </div>

        <button type="button" className="profile-logout" onClick={logout}>
          Uitloggen
        </button>
      </div>
    </aside>
  );
}
