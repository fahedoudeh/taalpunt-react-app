
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar"
import RightSidebar from "../rightBar/RightSidebar";
import "./Layout.css";

export default function Layout() {
  
  return (
    <>
      <Navbar />
      <div className="layout">
        <aside className="layout__left">
          <Sidebar />
        </aside>
        <main className="layout__main">
          <Outlet />
        </main>
        <aside className="layout__right">
          <RightSidebar />
        </aside>
      </div>
    </>
  );
}
