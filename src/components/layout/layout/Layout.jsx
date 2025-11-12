// src/components/layout/layout/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="content-area">
        <Sidebar />
        <main>
          <Outlet /> {/* child routes render here */}
        </main>
      </div>
    </div>
  );
}
