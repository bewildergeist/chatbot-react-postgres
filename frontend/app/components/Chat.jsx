/**
 * Chat Components
 *
 * This file contains all chat-related components for the messaging interface.
 * It demonstrates:
 * 1. LOGICAL GROUPING: Related components organized in the same file
 * 2. COMPONENT HIERARCHY: Message -> ChatMessages -> ChatInput
 * 3. EXPORT PATTERNS: Multiple named exports from a single file
 * 4. REUSABLE MODULES: Components that can be imported anywhere in the app
 */

/**
 * Message Component
 *
 * A reusable component for displaying individual chat messages.
 * Accepts props to customize message type and content.
 */
function Message(props) {
  return (
    <div className={`message ${props.type}-message`}>
      <div className="message-content">{props.content}</div>
    </div>
  );
}

/**
 * ChatMessages Component
 *
 * Container component that manages the conversation display area.
 * Uses multiple Message components to build the full conversation.
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

      <Message type="user" content="How do nested routes work in v7?" />

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
 * Form component that handles user input for sending messages.
 * Contains textarea and send button for message composition.
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

/**
 * Named Exports
 *
 * We export each component individually so they can be imported separately
 * if needed. This provides flexibility in how components are used.
 */
export { Message, ChatMessages, ChatInput };
