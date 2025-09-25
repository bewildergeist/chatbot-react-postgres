import { Outlet } from "react-router";

/**
 * SidebarHeader Component
 * 
 * This component handles the top section of the sidebar with the title and new chat button.
 * Breaking this into its own component demonstrates:
 * 1. Single responsibility - this component only handles the header area
 * 2. Component reusability - could be used in other sidebar contexts
 * 3. Easier testing and maintenance - smaller, focused components are easier to work with
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
 * This is our first component that uses PROPS! Props are how we pass data
 * from parent components to child components. Notice:
 * 1. The function parameter `props` contains data passed from the parent
 * 2. We use props.href and props.title to customize each thread item
 * 3. This makes the component reusable - same structure, different data
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
 * Now this component uses multiple instances of ChatThreadItem, passing
 * different props to each one. This demonstrates:
 * 1. Component reusability - same component, different data
 * 2. Props passing - how parent components send data to children
 * 3. Clean, declarative code - each thread is clearly defined
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
 * Sidebar Component
 * 
 * Now our Sidebar component is very clean and shows the power of component composition!
 * It uses three focused components: SidebarHeader, ChatThreadsList, and SidebarFooter.
 * Each component has a single responsibility, making the code easier to understand and maintain.
 */
function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Using our extracted SidebarHeader component */}
      <SidebarHeader />
      {/* Using our extracted ChatThreadsList component */}
      <ChatThreadsList />
      {/* Using our extracted SidebarFooter component */}
      <SidebarFooter />
    </aside>
  );
}

/**
 * SidebarFooter Component
 * 
 * This component handles the user profile section at the bottom of the sidebar.
 * Like SidebarHeader, this demonstrates:
 * 1. Separation of concerns - footer logic is isolated
 * 2. Component modularity - easy to modify or replace the footer independently
 * 3. Consistent component patterns - following the same structure as other components
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
 * Layout Component
 * 
 * Now our Layout component is much cleaner! It focuses on its main job:
 * arranging the overall page structure. Notice how we use the Sidebar
 * component just like any HTML element - this is component composition.
 */
export default function Layout() {
  return (
    <div className="app-layout">
      {/* Using our extracted Sidebar component */}
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
