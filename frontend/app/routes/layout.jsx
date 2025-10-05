import { Outlet, useLoaderData } from "react-router";
import Sidebar from "../components/Sidebar.jsx";

/**
 * CLIENT LOADER FUNCTION
 *
 * Fetches the list of chat threads from Supabase before the layout renders.
 * Key concepts:
 * 1. PARENT ROUTE LOADER: Runs before any child route loaders
 * 2. SHARED DATA: Data is available to this component and can be accessed by children
 * 3. SUPABASE REST API: Direct HTTP calls to Supabase database
 * 4. ENVIRONMENT VARIABLES: Secure way to store API credentials
 * 5. QUERY PARAMETERS: Using URL parameters to filter and sort data
 *
 * This loader runs:
 * - On initial page load
 * - When navigating to any route under this layout
 * - When React Router revalidates (after mutations)
 */
export async function clientLoader() {
  // Get Supabase credentials from environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Construct the API endpoint URL
  // - /rest/v1/threads: Access the threads table
  // - select=*: Get all columns
  // - order=created_at.desc: Sort by newest first
  const url = `${supabaseUrl}/rest/v1/threads?select=*&order=created_at.desc`;

  // Make the request with required Supabase headers
  const response = await fetch(url, {
    headers: {
      apikey: supabaseKey, // Required for authentication
      Authorization: `Bearer ${supabaseKey}`, // Required for authorization
    },
  });

  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`Failed to fetch threads: ${response.status}`);
  }

  // Parse the JSON response
  const threads = await response.json();

  return { threads };
}

/**
 * Layout Component
 *
 * Now uses DATA LOADING instead of local state!
 *
 * Key concepts:
 * 1. useLoaderData() HOOK: Accesses data from clientLoader
 * 2. NO STATE MANAGEMENT: Data comes from loader, not useState
 * 3. LAYOUT PATTERN: Wraps child routes with consistent UI (sidebar)
 * 4. OUTLET: Renders the matched child route component
 */
export default function Layout() {
  // Access threads data from the loader
  const { threads } = useLoaderData();

  // Delete functionality will be re-implemented with clientAction later
  const deleteThread = (threadId) => {
    console.log("Delete thread:", threadId);
    console.log("(Mutations will be implemented in the next phase)");
  };

  return (
    <div className="app-layout">
      <Sidebar threads={threads} onDeleteThread={deleteThread} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
