import {
  useLoaderData,
  useActionData,
  Link,
  useRouteError,
  href,
  Outlet,
  useNavigation,
} from "react-router";
import { ChatMessages, ChatInput } from "../components/Chat.jsx";
import { apiFetch } from "../lib/apiFetch.js";

/**
 * ERROR BOUNDARY COMPONENT
 *
 * Handles errors that occur in this route, including 404 errors.
 * Key concepts:
 * 1. ERROR BOUNDARY: React Router's built-in error handling mechanism
 * 2. useRouteError() HOOK: Access the error object thrown in loader/action
 * 3. 404 HANDLING: Special case for missing threads (deleted or never existed)
 * 4. USER FEEDBACK: Show helpful message and recovery options
 *
 * This component renders when:
 * - Thread is not found (404 error)
 * - API request fails
 * - Any error is thrown in loader or action
 */
export function ErrorBoundary() {
  const error = useRouteError();

  // Check if this is a 404 error (thread not found)
  const isNotFound = error?.status === 404;

  return (
    <div className="chat-container">
      <div className="chat-thread-header">
        <h2>{isNotFound ? "Thread Not Found" : "Something Went Wrong"}</h2>
        <p>
          {isNotFound
            ? "This conversation may have been deleted or never existed."
            : error?.message || "An unexpected error occurred."}
        </p>
        <p>
          <Link to={href("/chat/new")}>Start a new chat</Link>
        </p>
      </div>
    </div>
  );
}

/**
 * CLIENT LOADER FUNCTION
 *
 * Fetches thread details and messages from our custom API.
 * Key concepts:
 * 1. ASYNC FUNCTION: Can perform asynchronous operations like data fetching
 * 2. PARAMS ACCESS: Receives route parameters (like threadId) via the params object
 * 3. MULTIPLE API CALLS: Fetches both thread metadata and messages
 * 4. SERVER-SIDE FILTERING: Our API handles filtering and sorting
 * 5. ERROR HANDLING: Properly handle 404 and other errors
 * 6. AUTHENTICATED REQUESTS: Uses apiFetch to include JWT token
 *
 * The loader runs:
 * - When you navigate to this route
 * - When you refresh the page
 * - When React Router revalidates data
 */
export async function clientLoader({ params }) {
  // Fetch thread metadata from our API with authentication
  // apiFetch handles the base URL and adds the JWT token
  const threadResponse = await apiFetch(`/api/threads/${params.threadId}`);

  // Check for 404 specifically - thread doesn't exist
  if (threadResponse.status === 404) {
    throw new Response("Thread not found", { status: 404 });
  }

  // Check for other errors
  if (!threadResponse.ok) {
    throw new Error(`Failed to fetch thread: ${threadResponse.status}`);
  }

  // Our API returns the thread object directly (not in an array)
  const thread = await threadResponse.json();

  // Fetch messages for this thread with authentication
  // Our API handles filtering by thread_id and sorting chronologically
  const messagesResponse = await apiFetch(
    `/api/threads/${params.threadId}/messages`,
  );

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
 * CLIENT ACTION FUNCTION
 *
 * Handles form submissions to create new messages using our custom API.
 * Key concepts:
 * 1. FORM DATA: Extract data from form submission
 * 2. POST REQUEST: Send data to our API to create new message
 * 3. AUTOMATIC REVALIDATION: React Router re-runs loader after action completes
 * 4. SERVER-SIDE VALIDATION: Our API validates the data
 * 5. AUTHENTICATED REQUESTS: Uses apiFetch to include JWT token
 *
 * The action runs:
 * - When a Form with method="post" is submitted
 * - Before the loader re-runs (automatic revalidation)
 *
 * Note: The backend now generates an AI response after saving the user's message,
 * so this action takes longer but returns both messages in one response.
 */
export async function clientAction({ params, request }) {
  // Extract form data from the request
  const formData = await request.formData();
  const content = formData.get("message");

  // Basic client-side validation (server will validate too)
  if (!content || !content.trim()) {
    return { error: "Message cannot be empty" };
  }

  // Create the message object
  const newMessage = {
    type: "user",
    content: content.trim(),
  };

  // POST to our custom API to create the message with authentication
  // apiFetch automatically includes the JWT token and handles the base URL
  // The backend will:
  // 1. Save the user's message
  // 2. Generate an AI response using Mistral API
  // 3. Save the AI response
  // 4. Return both messages
  try {
    const response = await apiFetch(
      `/api/threads/${params.threadId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      },
    );

    // Check for validation errors (400)
    if (response.status === 400) {
      const error = await response.json();
      return { error: error.error || "Invalid message data" };
    }

    // Check for other errors
    if (!response.ok) {
      return { error: `Failed to create message: ${response.status}` };
    }

    // Return success - loader will automatically revalidate
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Chat Thread Route Component
 *
 * Displays a conversation thread with messages from the database.
 * Now includes optimistic UI for immediate user feedback using useNavigation.
 *
 * Key concepts:
 * 1. useLoaderData() HOOK: Accesses data returned from clientLoader
 * 2. useNavigation() HOOK: Accesses current navigation state and formData
 * 3. NESTED ROUTES: Outlet component renders child routes
 * 4. LINK NAVIGATION: Link to="edit" navigates to nested edit route
 * 5. OPTIMISTIC UI: Shows user's message immediately before server confirms
 * 6. PENDING STATE: Shows loading indicator while AI generates response
 *
 * Routing Structure:
 * - /chat/:threadId → This component (view thread)
 * - /chat/:threadId/edit → Edit form overlay (child route)
 *
 * The Outlet component renders the child route above the thread view,
 * creating an overlay effect for the edit form.
 *
 * Optimistic UI Flow:
 * 1. User types message and clicks Send
 * 2. Form submits and navigation.formData becomes available
 * 3. We create an optimistic user message from navigation.formData
 * 4. Display optimistic message + "AI is thinking..." message
 * 5. Backend generates AI response and saves both messages
 * 6. Loader revalidates and shows real messages from database
 * 7. navigation.formData clears, optimistic messages disappear
 */
export default function ChatThread() {
  // Access the thread and messages data from the loader
  const { thread, messages } = useLoaderData();

  // Access the action result (success or error)
  const actionData = useActionData();

  // Access the current navigation state
  // navigation.formData will be available during form submission
  // navigation.state will be "submitting" or "loading" during the request
  const navigation = useNavigation();

  // Create an array to display, starting with messages from the database
  let displayMessages = [...messages];

  // If a form is being submitted and it has a "message" field,
  // add it optimistically to the display
  if (navigation.formData?.has("message")) {
    // Create an optimistic user message
    const optimisticUserMessage = {
      id: "optimistic-user",
      type: "user",
      content: navigation.formData.get("message"),
    };

    // Create an optimistic bot "thinking" message
    const optimisticBotMessage = {
      id: "optimistic-bot",
      type: "bot",
      content: "AI is thinking...",
    };

    // Add both messages to the display array
    displayMessages.push(optimisticUserMessage, optimisticBotMessage);
  }

  return (
    <main className="chat-container">
      <Outlet />
      <div className="chat-thread-header">
        <h2>{thread.title}</h2>
        <Link to="edit" className="thread-title-edit-link">
          Edit
        </Link>
      </div>
      <ChatMessages messages={displayMessages} />
      <ChatInput />
      {actionData?.error && (
        <div className="error-message">{actionData.error}</div>
      )}
    </main>
  );
}
