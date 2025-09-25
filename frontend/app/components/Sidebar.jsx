/**
 * Sidebar Components
 *
 * This file demonstrates React component organization and modularity:
 * 1. Multiple related components in one file
 * 2. Import/export patterns for sharing components
 * 3. Component composition and hierarchy
 * 4. File organization for better project structure
 */

/**
 * SidebarHeader Component
 *
 * Handles the top section of the sidebar with title and new chat button.
 * This component demonstrates single responsibility and reusability.
 */
function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <h2 className="chatbot-title">Chatbot</h2>
      <a href="/chat/new" className="new-chat-btn">
        + New
      </a>
    </div>
  );
}

/**
 * ChatThreadItem Component
 *
 * Now uses CALLBACK FUNCTIONS for state updates! Key concepts:
 * 1. DESTRUCTURING: Extract thread data and callback function
 * 2. CALLBACK INVOCATION: Call parent function to trigger state updates
 * 3. EVENT HANDLING: Still handle click events but now trigger real actions
 * 4. STATE LIFTING: Component doesn't manage state, just triggers updates
 * 5. UNIDIRECTIONAL DATA FLOW: Data flows down, events flow up
 */
function ChatThreadItem({ thread, onDeleteThread }) {
  const { id, href, title } = thread;

  const handleDeleteClick = (event) => {
    // Prevent the click from bubbling up to parent elements
    event.stopPropagation();
    
    // Call the callback function passed from parent to delete the thread
    if (onDeleteThread) {
      onDeleteThread(id);
    }
  };

  return (
    <li className="chat-thread-item">
      <div className="chat-thread-item-content">
        <a href={href} className="chat-thread-link">
          {title}
        </a>
        <button
          className="delete-thread-btn"
          aria-label={`Delete thread: ${title}`}
          title="Delete this conversation"
          type="button"
          onClick={handleDeleteClick}
        >
          &times;
        </button>
      </div>
    </li>
  );
}

/**
 * ChatThreadsList Component
 *
 * Now handles CALLBACK PROP DRILLING! Key concepts:
 * 1. DESTRUCTURING: Extract both threads data and callback function
 * 2. DEFAULT VALUES: Safe defaults for both props
 * 3. CALLBACK FORWARDING: Pass callback down to individual thread items
 * 4. PROP DRILLING CHAIN: Layout -> Sidebar -> ChatThreadsList -> ChatThreadItem
 * 5. FUNCTION PROPS: onDeleteThread is a function passed as a prop
 */
function ChatThreadsList({ threads = [], onDeleteThread }) {
  return (
    <nav className="chat-threads-list" aria-label="Chat threads">
      <ul>
        {/* Passing both thread data and delete callback to each item */}
        {threads.map((thread) => (
          <ChatThreadItem
            key={thread.id}
            thread={thread}
            onDeleteThread={onDeleteThread}
          />
        ))}
      </ul>
    </nav>
  );
}

/**
 * SidebarFooter Component
 *
 * Handles the user profile section at the bottom of the sidebar.
 * Demonstrates component modularity and independence.
 */
function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <a href="/profile" className="user-profile">
        <img
          src="https://ui-avatars.com/api/?name=Batman&background=0D0D0D&color=fff&size=40"
          alt="User avatar"
          className="user-avatar"
          width={30}
          height={30}
        />
        <span className="user-name">Batman</span>
      </a>
    </div>
  );
}

/**
 * Main Sidebar Component
 *
 * Now handles CALLBACK PROP DRILLING! Key concepts:
 * 1. DESTRUCTURING: Extract both data and callback functions
 * 2. CALLBACK DRILLING: Pass functions down through component hierarchy
 * 3. INTERMEDIATE COMPONENT: Forwards callbacks without using them directly
 * 4. SEPARATION OF CONCERNS: Sidebar doesn't handle delete logic
 * 5. PROP FORWARDING: Clean pattern for passing props to children
 */
export default function Sidebar({ threads, onDeleteThread }) {
  return (
    <aside className="sidebar">
      {/* Component composition with both data and callback drilling */}
      <SidebarHeader />
      <ChatThreadsList 
        threads={threads} 
        onDeleteThread={onDeleteThread}
      />
      <SidebarFooter />
    </aside>
  );
}
