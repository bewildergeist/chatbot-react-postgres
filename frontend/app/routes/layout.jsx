import { Outlet } from "react-router";
import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

/**
 * INITIAL DATA FOR STATE
 *
 * Moving from static to dynamic data demonstrates:
 * 1. STATE INITIALIZATION: Defining initial data for useState
 * 2. DATA IMMUTABILITY: How React state should be updated immutably
 * 3. COMPONENT LIFECYCLE: Data that changes over component lifetime
 * 4. MODULE SCOPE vs COMPONENT SCOPE: Where different data belongs
 */
const initialThreads = [
  {
    id: 1,
    href: "/chat/how-to-learn-programming",
    title: "How to learn programming?",
  },
  {
    id: 2,
    href: "/chat/best-pizza-toppings",
    title: "What are the best pizza toppings?",
  },
  {
    id: 3,
    href: "/chat/explain-quantum-physics",
    title: "Can you explain quantum physics?",
  },
  {
    id: 4,
    href: "/chat/morning-routine-ideas",
    title: "Help me create a morning routine",
  },
  {
    id: 5,
    href: "/chat/weekend-activity-suggestions",
    title: "What should I do this weekend?",
  },
  { id: 6, href: "/chat/why-sky-blue", title: "Why is the sky blue?" },
  {
    id: 7,
    href: "/chat/learn-new-language",
    title: "How do I learn a new language?",
  },
  {
    id: 8,
    href: "/chat/meaning-of-life",
    title: "What's the meaning of life?",
  },
  { id: 9, href: "/chat/funny-joke-please", title: "Tell me a funny joke" },
  {
    id: 10,
    href: "/chat/healthy-dinner-ideas",
    title: "What's a healthy dinner idea?",
  },
  {
    id: 11,
    href: "/chat/good-book-recommendations",
    title: "Recommend me a good book",
  },
  {
    id: 12,
    href: "/chat/creative-writing-prompt",
    title: "Give me a creative writing prompt",
  },
  {
    id: 13,
    href: "/chat/fix-slow-computer",
    title: "My computer is slow, help?",
  },
  {
    id: 14,
    href: "/chat/interesting-history-fact",
    title: "Tell me an interesting history fact",
  },
];

/**
 * Layout Component
 *
 * Now demonstrates STATE MANAGEMENT and CALLBACK PATTERNS:
 * 1. USESTATE HOOK: Managing dynamic data that changes over time
 * 2. STATE UPDATES: Immutable updates using array filter method
 * 3. CALLBACK PROPS: Passing functions down to child components
 * 4. DATA FLOW: State updates flow up, data flows down
 * 5. COMPONENT COMMUNICATION: Parent-child communication via callbacks
 */
export default function Layout() {
  // STATE: threads is now dynamic data that can change!
  const [threads, setThreads] = useState(initialThreads);

  // CALLBACK FUNCTION: Handle deleting a thread by ID
  const deleteThread = (threadId) => {
    console.log("Layout: Deleting thread with ID:", threadId);

    // IMMUTABLE UPDATE: Create new array without the deleted thread
    setThreads((currentThreads) =>
      currentThreads.filter((thread) => thread.id !== threadId),
    );
  };

  return (
    <div className="app-layout">
      {/* Passing both data and callbacks via prop drilling */}
      <Sidebar threads={threads} onDeleteThread={deleteThread} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
