import { useState } from "react";
import { ChatMessages, ChatInput } from "../components/Chat.jsx";

/**
 * INITIAL THREAD MESSAGES DATA
 *
 * This is placeholder data for any thread.
 * Later, this will be replaced with data fetched from the database.
 */
const defaultMessages = [
  {
    id: 1,
    type: "user",
    content: "This is the user's original message",
  },
  {
    id: 2,
    type: "bot",
    content: "This is the first bot response",
  },
];

/**
 * Chat Thread Route Component
 *
 * This route displays an individual chat conversation thread.
 * Each thread is identified by a unique ID in the URL.
 *
 * Key concepts:
 * 1. DYNAMIC ROUTE: The threadId comes from the URL parameter
 * 2. PLACEHOLDER DATA: Using mock data until we add data loading
 * 3. ROUTE REUSABILITY: Same component handles all thread views
 */
export default function ChatThread() {
  // For now, we'll use placeholder messages
  // In the next step, we'll learn how to access the threadId from the URL
  const [messages, setMessages] = useState(defaultMessages);

  const addMessage = (content) => {
    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: content,
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <main className="chat-container">
      <ChatMessages messages={messages} />
      <ChatInput onAddMessage={addMessage} />
    </main>
  );
}
