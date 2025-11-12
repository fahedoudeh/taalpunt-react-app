import React from "react";

export default function Sidebar() {
  return (
    <aside
      style={{ width: 220, padding: "1rem", borderRight: "1px solid #eee" }}
    >
      <strong>Menu</strong>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
        <li>
          <a href="/">Dashboard</a>
        </li>
        <li>
          <a href="/lessons">Lessons</a>
        </li>
        <li>
          <a href="/activities">Activities</a>
        </li>
        <li>
          <a href="/board">Board</a>
        </li>
      </ul>
    </aside>
  );
}