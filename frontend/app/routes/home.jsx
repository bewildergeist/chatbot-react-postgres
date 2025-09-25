import { ChatMessages, ChatInput } from "../components/Chat.jsx";

/**
 * Home Component (Chat Page)
 * 
 * Our Home component is now extremely clean and focused! Key concepts demonstrated:
 * 
 * 1. NAMED IMPORTS: Using destructuring to import specific components
 * 2. FILE ORGANIZATION: Chat components are logically grouped in /components/Chat.jsx
 * 3. SEPARATION OF CONCERNS: Home only handles page structure, not chat implementation
 * 4. COMPONENT REUSABILITY: ChatMessages and ChatInput could be used in other pages
 * 5. CLEAN COMPOSITION: Simple, readable component structure
 * 
 * This shows React's modular architecture at work - complex UIs built from
 * simple, focused components imported from organized files.
 */
export default function Home() {
  return (
    <main className="chat-container">
      {/* Clean component composition using imported components */}
      <ChatMessages />
      <ChatInput />
    </main>
  );
}
