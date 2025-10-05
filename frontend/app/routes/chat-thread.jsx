import { useState } from "react";
import { useParams } from "react-router";
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
 * Now uses useParams() to access the threadId from the URL!
 *
 * Key concepts:
 * 1. useParams() HOOK: Extracts URL parameters from the route
 * 2. The `messages` state is currently shared among all threads, this will be fixed later.
 */
export default function ChatThread() {
  // Extract the threadId from the URL using useParams()
  const { threadId } = useParams();

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
      <div className="chat-thread-header">
        <h2>Conversation Thread #{threadId}</h2>
      </div>
      <ChatMessages messages={messages} />
      <ChatInput onAddMessage={addMessage} />
    </main>
  );
}
