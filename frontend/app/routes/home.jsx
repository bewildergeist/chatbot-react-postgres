/**
 * Message Component
 * 
 * A reusable component for displaying chat messages. This demonstrates:
 * 1. PROPS USAGE: Accepts `type` and `content` props to customize each message
 * 2. CONDITIONAL STYLING: Uses props.type to determine CSS classes
 * 3. COMPONENT REUSABILITY: Same structure works for both user and bot messages
 * 
 * Props:
 * - type: "user" or "bot" - determines the styling and alignment
 * - content: string - the message text to display
 */
function Message(props) {
  return (
    <div className={`message ${props.type}-message`}>
      <div className="message-content">
        {props.content}
      </div>
    </div>
  );
}

/**
 * ChatMessages Component
 * 
 * This component manages the entire chat conversation display area.
 * It demonstrates:
 * 1. COMPONENT COMPOSITION: Using multiple Message components together
 * 2. ORGANIZED UI SECTIONS: Grouping related functionality
 * 3. CONTAINER COMPONENTS: Managing layout and structure for child components
 * 
 * This makes the Home component cleaner and separates the messages logic
 * from the overall page structure.
 */
function ChatMessages() {
  return (
    <div className="chat-messages">
      {/* Multiple Message components compose the full conversation */}
      <Message 
        type="user" 
        content="Hello! Can you help me understand React Router v7?" 
      />
      
      <Message 
        type="bot" 
        content="Of course! React Router v7 is the latest version that introduces several improvements including better data loading, enhanced nested routing, and improved TypeScript support. What specific aspect would you like to learn about?" 
      />

      <Message 
        type="user" 
        content="How do nested routes work in v7?" 
      />
      
      <Message 
        type="bot" 
        content="Nested routes in React Router v7 allow you to create hierarchical UI structures. You define parent routes that contain child routes, and use the <Outlet /> component to render child components. The parent route acts as a layout component that wraps its children." 
      />
      
      <Message 
        type="user" 
        content="What's the difference between route() and layout() helpers?" 
      />
      
      <Message 
        type="bot" 
        content="Great question! The route() helper creates routes that add URL segments, while layout() creates routes that only provide UI structure without affecting the URL. Layout routes are perfect for shared components like sidebars or headers that should appear across multiple pages." 
      />
      
      <Message 
        type="user" 
        content="Can you show me an example of a routes.js configuration?" 
      />
      
      <Message 
        type="bot" 
        content="Sure! Here's a basic example: You can use route(), index(), and layout() helpers to create nested route structures. The layout() function creates wrapper components, while route() adds URL segments. This approach gives you clean, hierarchical routing that's easy to maintain." 
      />
      
      <Message 
        type="user" 
        content="How do I handle data loading in React Router v7?" 
      />
      
      <Message 
        type="bot" 
        content="React Router v7 provides excellent data loading capabilities through loader functions. You can define a loader function in your route component that runs before the component renders, ensuring your data is available immediately. You can access the loaded data using the useLoaderData() hook within your component." 
      />
    </div>
  );
}

/**
 * ChatInput Component
 * 
 * This component handles the chat input form with textarea and send button.
 * It demonstrates:
 * 1. FORM COMPONENTS: Extracting form-related UI into focused components
 * 2. USER INTERACTION: Organizing input and button elements together
 * 3. COMPONENT BOUNDARIES: Clear separation between display and input areas
 * 
 * This component is perfect for future enhancements like:
 * - Adding state for controlled inputs
 * - Event handlers for sending messages
 * - Form validation and submission logic
 */
function ChatInput() {
  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          className="chat-input"
          placeholder="Type your message here..."
          rows="1"
        />
        <button className="send-button" type="button">
          Send
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="chat-container">
      {/* Clean component composition: messages display + input form */}
      <ChatMessages />
      <ChatInput />
    </main>
  );
}
