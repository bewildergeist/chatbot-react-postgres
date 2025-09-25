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
 * Manages the navigation list of chat threads.
 * Shows how to use multiple instances of the same component (ChatThreadItem)
 * with different props for each instance.
 */
function ChatThreadsList() {
  return (
    <nav className="chat-threads-list" aria-label="Chat threads">
      <ul>
        {/* Each ChatThreadItem gets different props for href and title */}
        <ChatThreadItem
          href="/chat/how-to-learn-programming"
          title="How to learn programming?"
        />
        <ChatThreadItem
          href="/chat/best-pizza-toppings"
          title="What are the best pizza toppings?"
        />
        <ChatThreadItem
          href="/chat/explain-quantum-physics"
          title="Can you explain quantum physics?"
        />
        <ChatThreadItem
          href="/chat/morning-routine-ideas"
          title="Help me create a morning routine"
        />
        <ChatThreadItem
          href="/chat/weekend-activity-suggestions"
          title="What should I do this weekend?"
        />
        <ChatThreadItem
          href="/chat/why-sky-blue"
          title="Why is the sky blue?"
        />
        <ChatThreadItem
          href="/chat/learn-new-language"
          title="How do I learn a new language?"
        />
        <ChatThreadItem
          href="/chat/meaning-of-life"
          title="What's the meaning of life?"
        />
        <ChatThreadItem
          href="/chat/funny-joke-please"
          title="Tell me a funny joke"
        />
        <ChatThreadItem
          href="/chat/healthy-dinner-ideas"
          title="What's a healthy dinner idea?"
        />
        <ChatThreadItem
          href="/chat/good-book-recommendations"
          title="Recommend me a good book"
        />
        <ChatThreadItem
          href="/chat/creative-writing-prompt"
          title="Give me a creative writing prompt"
        />
        <ChatThreadItem
          href="/chat/fix-slow-computer"
          title="My computer is slow, help?"
        />
        <ChatThreadItem
          href="/chat/interesting-history-fact"
          title="Tell me an interesting history fact"
        />
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
