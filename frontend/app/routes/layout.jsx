import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        {/* Sidebar content will go here later */}
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
