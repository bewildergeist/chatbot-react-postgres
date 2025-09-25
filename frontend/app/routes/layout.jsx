import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar.jsx";

/**
 * Layout Component
 * 
 * Our Layout component is now extremely clean and focused! Notice the key concepts:
 * 
 * 1. IMPORT/EXPORT: We import the Sidebar component from another file
 * 2. FILE ORGANIZATION: Related components are grouped in the /components folder  
 * 3. SEPARATION OF CONCERNS: Layout only handles page structure
 * 4. COMPONENT REUSABILITY: Sidebar could be imported and used anywhere
 * 
 * This demonstrates React's modular architecture - building complex UIs
 * by composing smaller, focused components from different files.
 */
export default function Layout() {
  return (
    <div className="app-layout">
      {/* Using our imported Sidebar component - same as before, but now from external file */}
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
