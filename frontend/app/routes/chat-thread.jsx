import { useLoaderData } from "react-router";
import { ChatMessages, ChatInput } from "../components/Chat.jsx";

/**
 * CLIENT LOADER FUNCTION
 *
 * Fetches thread details and messages from Supabase.
 * Key concepts:
 * 1. ASYNC FUNCTION: Can perform asynchronous operations like data fetching
 * 2. PARAMS ACCESS: Receives route parameters (like threadId) via the params object
 * 3. MULTIPLE API CALLS: Fetches both thread metadata and messages
 * 4. FILTERING: Uses Supabase query parameters to filter by thread_id
 * 5. ORDERING: Sorts messages by creation time for chronological display
 *
 * The loader runs:
 * - When you navigate to this route
 * - When you refresh the page
 * - When React Router revalidates data
 */
export async function clientLoader({ params }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Fetch thread metadata
  // - id=eq.{threadId}: Filter to get only this specific thread
  // - select=*: Get all columns
  const threadUrl = `${supabaseUrl}/rest/v1/threads?id=eq.${params.threadId}&select=*`;

  const threadResponse = await fetch(threadUrl, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!threadResponse.ok) {
    throw new Error(`Failed to fetch thread: ${threadResponse.status}`);
  }

  // Supabase returns an array, even for single results
  const threadData = await threadResponse.json();
  const thread = threadData[0];

  // If thread not found, throw error (will be caught by ErrorBoundary)
  if (!thread) {
    throw new Response("Thread not found", { status: 404 });
  }

  // Fetch messages for this thread
  // - thread_id=eq.{threadId}: Filter messages by thread
  // - order=created_at.asc: Sort oldest to newest (chronological)
  const messagesUrl = `${supabaseUrl}/rest/v1/messages?thread_id=eq.${params.threadId}&select=*&order=created_at.asc`;

  const messagesResponse = await fetch(messagesUrl, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!messagesResponse.ok) {
    throw new Error(`Failed to fetch messages: ${messagesResponse.status}`);
  }

  const messages = await messagesResponse.json();

  return {
    thread,
    messages,
  };
}

/**
 * Chat Thread Route Component
 *
 * Displays a conversation thread with messages from the database.
 *
 * Key concepts:
 * 1. useLoaderData() HOOK: Accesses data returned from clientLoader
 * 2. NO LOADING STATES NEEDED: Data is guaranteed to be available
 * 3. DATA READY ON RENDER: Component receives data before it renders
 * 4. REAL DATABASE DATA: Shows actual messages from Supabase
 */
export default function ChatThread() {
  // Access the thread and messages data from the loader
  const { thread, messages } = useLoaderData();

  // For now, we keep the addMessage handler but it won't persist
  // This will be replaced with clientAction in a later step
  const addMessage = (content) => {
    console.log("Message submitted:", content);
    console.log("(Data mutations will be implemented in the next phase)");
  };

  return (
    <main className="chat-container">
      <div className="chat-thread-header">
        <h2>{thread.title}</h2>
      </div>
      <ChatMessages messages={messages} />
      <ChatInput onAddMessage={addMessage} />
    </main>
  );
}
