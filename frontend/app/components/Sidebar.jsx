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
 * A reusable component for individual chat thread links.
 * Demonstrates props usage: receives href and title from parent component.
 * This pattern allows the same component structure with different data.
 */
function ChatThreadItem(props) {
  return (
    <li className="chat-thread-item">
      <a href={props.href} className="chat-thread-link">
        {props.title}
      </a>
    </li>
  );
}

/**
 * ChatThreadsList Component
 *
 * Now uses STATIC DATA and MAP() METHOD for chat threads!
 * Reinforces the same concepts as ChatMessages:
 * 1. STATIC DATA: Thread information stored in JavaScript array
 * 2. MAP() METHOD: Transform thread objects into ChatThreadItem components
 * 3. KEY PROP: Unique keys for React's efficient rendering
 * 4. CONSISTENT PATTERNS: Same data-driven approach across the app
 */
function ChatThreadsList() {
  // Static array of thread data - replaces hardcoded ChatThreadItem components
  const threads = [
    { id: 1, href: "/chat/how-to-learn-programming", title: "How to learn programming?" },
    { id: 2, href: "/chat/best-pizza-toppings", title: "What are the best pizza toppings?" },
    { id: 3, href: "/chat/explain-quantum-physics", title: "Can you explain quantum physics?" },
    { id: 4, href: "/chat/morning-routine-ideas", title: "Help me create a morning routine" },
    { id: 5, href: "/chat/weekend-activity-suggestions", title: "What should I do this weekend?" },
    { id: 6, href: "/chat/why-sky-blue", title: "Why is the sky blue?" },
    { id: 7, href: "/chat/learn-new-language", title: "How do I learn a new language?" },
    { id: 8, href: "/chat/meaning-of-life", title: "What's the meaning of life?" },
    { id: 9, href: "/chat/funny-joke-please", title: "Tell me a funny joke" },
    { id: 10, href: "/chat/healthy-dinner-ideas", title: "What's a healthy dinner idea?" },
    { id: 11, href: "/chat/good-book-recommendations", title: "Recommend me a good book" },
    { id: 12, href: "/chat/creative-writing-prompt", title: "Give me a creative writing prompt" },
    { id: 13, href: "/chat/fix-slow-computer", title: "My computer is slow, help?" },
    { id: 14, href: "/chat/interesting-history-fact", title: "Tell me an interesting history fact" }
  ];

  return (
    <nav className="chat-threads-list" aria-label="Chat threads">
      <ul>
        {/* Using .map() to render each thread - consistent with messages pattern! */}
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
 * The main component that composes all sidebar sub-components.
 * This demonstrates:
 * 1. Component composition - combining smaller components into a larger one
 * 2. Clean separation of concerns - each sub-component has a specific role
 * 3. Maintainable code structure - easy to modify individual parts
 *
 * This is the component we'll export and import in other files.
 */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Component composition: using our extracted components */}
      <SidebarHeader />
      <ChatThreadsList />
      <SidebarFooter />
    </aside>
  );
}
