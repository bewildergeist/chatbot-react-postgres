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
 * Now includes INTERACTIVE ELEMENTS! Key concepts:
 * 1. DESTRUCTURING: Extract href and title directly from props
 * 2. BUTTON ELEMENTS: Proper HTML semantics for interactive actions
 * 3. ACCESSIBILITY: ARIA labels and proper focus management
 * 4. EVENT HANDLING: onClick handlers for user interactions
 * 5. CSS HOVER STATES: Show/hide elements based on user interaction
 */
function ChatThreadItem({ href, title }) {
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
 * Now uses DESTRUCTURING WITH SAFE DEFAULTS! Key concepts:
 * 1. DESTRUCTURING: Extract threads directly from props object
 * 2. DEFAULT VALUES: threads = [] prevents mapping over undefined
 * 3. PROP DRILLING: Data still flows Layout -> Sidebar -> ChatThreadsList
 * 4. ERROR PREVENTION: Component gracefully handles missing threads prop
 * 5. CONSISTENT PATTERNS: Same destructuring pattern as ChatMessages
 */
function ChatThreadsList({ threads = [] }) {
  return (
    <nav className="chat-threads-list" aria-label="Chat threads">
      <ul>
        {/* Using destructured threads with safe default! */}
        {threads.map((thread) => (
          <ChatThreadItem
            key={thread.id}
            href={thread.href}
            title={thread.title}
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
 * Now uses DESTRUCTURING for prop drilling! Key concepts:
 * 1. DESTRUCTURING: Extract threads directly from props
 * 2. PROP DRILLING: Still passes threads down to ChatThreadsList child
 * 3. CLEANER CODE: Direct access to threads instead of props.threads
 * 4. INTERMEDIATE COMPONENT: Acts as bridge between Layout and ChatThreadsList
 * 5. CONSISTENT PATTERNS: Same destructuring approach throughout app
 */
export default function Sidebar({ threads }) {
  return (
    <aside className="sidebar">
      {/* Component composition with destructured prop drilling */}
      <SidebarHeader />
      <ChatThreadsList threads={threads} />
      <SidebarFooter />
    </aside>
  );
}
