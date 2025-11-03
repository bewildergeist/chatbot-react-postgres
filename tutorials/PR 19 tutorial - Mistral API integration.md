# AI-Powered Chat Responses with Mistral API - Step-by-Step Tutorial

## 📋 Table of Contents

1. [Step 1: Add Mistral API configuration](#step-1)
2. [Step 2: Create a test endpoint](#step-2)
3. [Step 3: Integrate AI response generation](#step-3)
4. [Step 4: Add system prompt](#step-4)
5. [Step 5: Add optimistic UI](#step-5)

## 🗺️ Overview

Transform your chatbot from a static message storage system into an intelligent conversational AI! In this tutorial, you'll integrate the Mistral AI API to automatically generate responses to user messages. You'll learn how to work with external APIs from Node.js, handle async sequential operations, and provide immediate user feedback with optimistic UI patterns.

By the end of this tutorial, your chatbot will:

- Generate intelligent AI responses to user messages using Mistral AI
- Maintain conversation context across multiple messages
- Provide instant visual feedback while waiting for AI responses
- Handle errors gracefully when the AI service is unavailable

**Key Learning Objectives:**

- Using `fetch()` in Node.js (same API as the browser!)
- Working with external APIs and Bearer token authentication
- Sequential async operations (save → fetch → call API → save again)
- Optimistic UI patterns with React Router's `useNavigation`
- Error handling for external service integrations

## 🧑‍💻 Today's starting point

If you haven't fully completed the prior tutorials, you may copy the starting point of this tutorial by running this command in the root of your local repository:

```bash
npx degit --force bewildergeist/chatbot-react-postgres#pr-19-start
```

**Important**: Make a commit of this initial version before you start changing anything.

---

<a name="step-1"></a>

## Step 1: Add Mistral API configuration

### 🤔 Problem to solve

Before we can integrate an AI service, we need to configure our application to securely store and access the API credentials. API keys are sensitive information that should never be committed to version control, so we need to set up environment variables properly.

### 💡 Key concepts

- **Environment variables**: Store configuration and secrets outside your code
- **API keys**: Credentials that identify and authenticate your application with external services
- **Security best practices**: Never commit API keys to Git
- **`.env.example` vs `.env`**: Example file shows required variables, actual `.env` contains secrets

### 📝 Your task

1. **Sign up for Mistral AI**:

   - Go to [https://console.mistral.ai/](https://console.mistral.ai/)
   - Create a free account
   - Navigate to "API Keys" in the left sidebar
   - Click "Create new key" and copy your API key

2. **Update the backend environment configuration**:

   - Open `backend/.env.example`
   - Add a new environment variable for the Mistral API key (but only add a placeholder, not your real key)
   - Include helpful comments explaining:
     - Where to get the key
     - What it's used for
     - Why it should be kept secret

3. **Add the key to your actual `.env` file**:
   - Add your actual Mistral API key in your `backend/.env` file
   - Verify that `.env` is in your `.gitignore` (it should be!)

### ✅ Reference implementation

**🔗 Commit**: [`fbcf3ae`](19/commits/fbcf3ae)

This commit shows one way to structure the environment variable with helpful comments.

### 💬 Discussion points

1. **Why use environment variables instead of hardcoding the API key?**

   - Think about: security, multiple environments (dev/production), team collaboration

2. **What happens if someone accidentally commits their `.env` file?**
   - How would you detect this? What should you do immediately?

### 🧪 Test your solution

- Verify `.env` is listed in `.gitignore`
- Run `git status` and confirm `.env` is NOT shown as a file to commit

---

<a name="step-2"></a>

## Step 2: Create a test endpoint

### 🤔 Problem to solve

Before integrating AI into our message flow, we should verify that our API credentials work and that we understand how to communicate with the Mistral API. A dedicated test endpoint lets us experiment safely without affecting the main application flow.

### 💡 Key concepts

- **fetch() in Node.js**: Same API you've used in the browser works on the server!
- **POST requests**: Sending data to an API endpoint
- **Authorization header**: How APIs verify your identity using Bearer tokens
- **Request/response structure**: Understanding API contracts and data formats
- **Error handling**: Dealing with network failures and API errors

### 📝 Your task

Create a new endpoint `POST /api/test-mistral` that:

1. **Validates configuration**:

   - Check if `process.env.MISTRAL_API_KEY` exists
   - Return a helpful error if it's missing

2. **Calls the Mistral API**:

   - Endpoint: `https://api.mistral.ai/v1/chat/completions`
   - Method: POST
   - Headers:
     - `Content-Type: application/json`
     - `Authorization: Bearer ${apiKey}`
   - Body: JSON with `model` and `messages` fields

3. **Sends a test message**:

   - Use model: `"mistral-small-latest"`
   - Send a simple message like "Hello! Please respond with a short greeting."
   - The message format is: `{ role: "user", content: "..." }`

4. **Handles the response**:
   - Check if the request was successful
   - Parse the JSON response
   - Return the full response for inspection
   - Handle errors gracefully with appropriate status codes

### 🔍 Implementation hints

**Understanding the Mistral API structure:**

```javascript
// Request body structure
{
  model: "mistral-small-latest",
  messages: [
    { role: "user", content: "your message here" }
  ]
}

// Response structure
{
  choices: [
    {
      message: {
        role: "assistant",
        content: "AI's response here"
      }
    }
  ]
}
```

**fetch() reminder:**

- It's async, so use `await`
- It returns a Response object, not the data directly
- Call `.json()` to parse the response body
- Check `.ok` property to see if the request succeeded

**Where to add this endpoint:**

- Find a good spot in `backend/server.js` after the root endpoint
- Before the existing `/api/threads` endpoints

### ✅ Reference implementation

**🔗 Commit**: [`4819b7d`](19/commits/4819b7d)

Study how this commit structures the API call, handles errors, and returns responses.

### 💬 Discussion points

1. **Why test with a separate endpoint first?**

   - What are the benefits of isolating new functionality?
   - When might you remove this test endpoint?

2. **Why does fetch() work the same in Node.js and the browser?**

   - Research: Has this always been the case?
   - Why is this beneficial for full-stack JavaScript developers?

3. **What's the difference between a 4xx and 5xx error?**
   - When should you return each type?
   - What does it tell the client?

### 🧪 Test your solution

Test your endpoint using curl, Thunder Client or Postman:

```bash
curl -X POST http://localhost:3000/api/test-mistral \
  -H "Content-Type: application/json"
```

**Expected behavior:**

- ✅ Should return a JSON response with a greeting from the AI
- ✅ Should include the full Mistral API response structure
- ✅ If API key is missing, should return a helpful error message
- ✅ If API key is invalid, should return an error from Mistral

**💡 Think about this**: What information does the response include beyond just the message content? Why might that metadata be useful?

---

<a name="step-3"></a>

## Step 3: Integrate AI response generation

### 🤔 Problem to solve

Now that we can call the Mistral API, we need to integrate it into the actual message creation flow. When a user sends a message, we want to:

1. Save their message to the database
2. Generate an AI response based on the conversation history
3. Save the AI's response to the database
4. Return both messages to the client

This involves coordinating multiple async operations in sequence and transforming data between different formats (database ↔ API).

### 💡 Key concepts

- **Sequential async operations**: Operations that depend on previous results
- **Conversation context**: Why the full message history matters for AI responses
- **Data transformation**: Converting between database format and API format
- **Graceful degradation**: Handling failures in external services
- **Role mapping**: Translating `type: "bot"` ↔ `role: "assistant"`

### 📝 Your task

Modify the `POST /api/threads/:id/messages` endpoint to become an AI-powered message handler:

**Step 1: Save the user's message** (you already do this)

- Keep the existing validation and authorization checks
- Insert the user's message into the database
- Store the returned message in a variable (you'll need it later)

**Step 2: Fetch conversation history**

- After saving the user's message, query ALL messages in the thread
- Order them chronologically (oldest first)
- This gives the AI context about the conversation

**Step 3: Format messages for Mistral API**

- Create a new array that transforms your database messages
- Map `type: "user"` → `role: "user"` (stays the same)
- Map `type: "bot"` → `role: "assistant"` (changes!)
- Each message should be: `{ role: "...", content: "..." }`

**Step 4: Call Mistral API**

- Use the same fetch() code from your test endpoint
- Send the formatted conversation history as the [`messages` array](https://docs.mistral.ai/api/endpoint/chat?property=operation-chat_completion_v1_chat_completions_post_request_messages#operation-chat_completion_v1_chat_completions_post_request_messages)

**Step 5: Save AI response**

- Extract the AI's message content from the response
- Insert it into the database with `type: "bot"`
- Remember: database uses "bot", API uses "assistant"!

**Step 6: Return both messages**

- Change your response to return an object with both messages:
  ```javascript
  {
    userMessage: { ... },
    botMessage: { ... }
  }
  ```

### 🔍 Implementation hints

**Common pitfalls:**

- ⚠️ Don't fetch messages before saving the user's message (you'll miss the latest context!)
- ⚠️ Remember to convert "bot" to "assistant" when talking to the API
- ⚠️ Remember to convert "assistant" to "bot" when saving to the database
- ⚠️ Always return the user message even if AI generation fails

**Where to make changes:**

- Find the existing `POST /api/threads/:id/messages` endpoint
- It currently saves one message and returns it
- You'll expand it to do much more!

### ✅ Reference implementation

**🔗 Commit**: [`aedc58d`](19/commits/aedc58d)

Pay special attention to:

- How the commit structures the 6 sequential steps
- The data transformation between database and API formats
- Error handling when the API call fails
- The updated response format

### 💬 Discussion points

1. **Why fetch the entire conversation history instead of just the latest message?**

   - Try an experiment: What happens if you only send one message?
   - How does context affect the quality of AI responses?

2. **Why return both messages instead of just the bot's response?**

   - Is this actually necessary with React Router's revalidation of client loaders?

3. **What are the tradeoffs of this approach?**
   - What happens if the AI response takes 5 seconds?
   - What happens if the AI service is down?
   - How might you improve this in a production application?

### 🧪 Test your solution

**Test in your browser:**

1. Start your frontend and backend servers
2. Navigate to a chat thread
3. Send a message: "Hello, who are you?"
4. Wait for the AI response (it might take a few seconds)
5. Send a follow-up: "What did I just ask you?"
6. Verify the AI remembers the conversation context

**Check the response in Network tab:**

- Should return both `userMessage` and `botMessage`
- Both should have proper timestamps and IDs
- User message should have `type: "user"`
- Bot message should have `type: "bot"`

**💡 Think about this**: Open your browser's Network tab and watch the timing. How long does the request take? What's causing the delay? How does this affect user experience?

---

<a name="step-4"></a>

## Step 4: Add system prompt

### 🤔 Problem to solve

Right now, the AI responds based purely on the conversation history. But we can significantly improve the AI's behavior by providing instructions through a **system prompt**. System prompts tell the AI how to act, what tone to use, and what guidelines to follow.

### 💡 Key concepts

- **System prompts**: Special instructions that guide AI behavior
- **Three message roles**:
  - `system`: Instructions for the AI (invisible to users)
  - `user`: Messages from the human
  - `assistant`: Responses from the AI
- **Prompt engineering**: Crafting instructions to get desired AI behavior
- **Message order**: System prompts should come first in the conversation

### 📝 Your task

Add a system prompt to customize your chatbot's personality:

1. **Create a system prompt object**:

   - In the message creation endpoint, after formatting the conversation history
   - Structure: `{ role: "system", content: "your instructions here" }`

2. **Write the instructions**:

   - Be specific about the tone and style you want
   - Consider including guidelines like:
     - Response length (concise vs detailed)
     - Personality (friendly, professional, playful, etc.)
     - How to handle unknowns
     - Special behaviors (encouraging, educational, etc.)

3. **Add it to the messages array**:
   - Use `.unshift()` to add it to the beginning
   - System prompts should always come before conversation messages

### 🔍 Implementation hints

**Example system prompt structures:**

```javascript
// Helpful assistant
"You are a helpful and friendly AI assistant. Keep your responses concise and clear.";

// Educational tutor
"You are a patient tutor helping students learn programming. Use simple examples and encourage questions.";

// Specific domain expert
"You are a fitness coach. Provide motivating advice and emphasize proper form and safety.";
```

**Where to add this:**

- After you've created the `mistralMessages` array
- Before you call the Mistral API
- Use `array.unshift()` to add to the beginning

**Experiment!**

- Try different personalities and see how the AI behaves
- This is a great place to customize your chatbot's character

### ✅ Reference implementation

**🔗 Commit**: [`32117e8`](19/commits/32117e8)

Notice how the commit:

- Places the system prompt in the logical flow
- Uses clear, specific instructions
- Adds comments explaining the purpose

### 💬 Discussion points

1. **What happens if you put the system prompt at the end instead of the beginning?**

   - Test this! Does it still work?
   - Why does order matter for AI models?

2. **How specific should system prompts be?**

   - Try very short vs very detailed prompts
   - What's the right balance?
   - Can you make the AI behave in unexpected ways?

3. **Could system prompts be customized per user or per thread?**
   - Where would you store user-specific prompts?
   - How would you pass them to this endpoint?
   - What are the implications for thread context?

### 🧪 Test your solution

**Experiment with different system prompts:**

1. **Test concise vs verbose**:

   ```javascript
   // Concise
   content: "You are helpful. Be brief.";

   // Verbose
   content: "You are a helpful AI assistant. Please provide detailed, thorough explanations...";
   ```

2. **Test different personalities**:

   - Try a pirate: "You are a friendly pirate. Speak in pirate dialect..."
   - Try a poet: "You are a poet. Respond to everything in rhyme..."
   - Try a skeptic: "You are skeptical and question everything..."

3. **Observe the differences**:
   - Ask the same question with different system prompts
   - How does the response style change?
   - How does this affect the user experience?

**💡 Think about this**: If you were building a chatbot for a specific business (e.g., customer support, education, healthcare), how would you craft the system prompt? What ethical considerations should you keep in mind?

---

<a name="step-5"></a>

## Step 5: Add optimistic UI

### 🤔 Problem to solve

Currently, when users send a message, they have to wait several seconds for the AI response with no feedback. The form clears, but the message doesn't appear until the entire round-trip completes (save → AI generation → save → reload). This creates a poor user experience—users wonder if their click worked!

We can dramatically improve this with **optimistic UI**: immediately show the user's message and a "thinking" indicator while the request is in flight.

### 💡 Key concepts

- **Optimistic UI**: Update the UI immediately, before the server responds
- **`useNavigation()` hook**: Access to the current navigation state
- **`navigation.formData`**: The form data being submitted
- **`navigation.state`**: Whether the app is "idle", "submitting", or "loading"
- **Temporary IDs**: Using temporary IDs for optimistic items
- **Array spreading**: Creating new arrays without mutating

### 📝 Your task

Update the chat thread route to show immediate feedback during message submission:

**Part 1: Import and use useNavigation**

1. Add `useNavigation` to your imports from `"react-router"`
2. Call it in your component: `const navigation = useNavigation()`

**Part 2: Create optimistic messages**

1. Start with the real messages from the loader: `let displayMessages = [...messages]`
2. Check if the message form is being submitted: `if (navigation.formData?.has("message")) { ... }`
3. Inside that condition:
   - Create an optimistic user message object with:
     - `id: "optimistic-user"` (temporary ID)
     - `type: "user"`
     - `content: navigation.formData.get("message")`
   - Create an optimistic bot message object with:
     - `id: "optimistic-bot"` (temporary ID)
     - `type: "bot"`
     - `content: "AI is thinking..."`
   - Push both messages onto `displayMessages`

**Part 3: Use displayMessages instead of messages**

- Change `<ChatMessages messages={messages} />` to use `displayMessages`

### 🔍 Implementation hints

**Understanding the flow:**

```
1. User clicks Send
   → navigation.formData becomes available immediately

2. Create optimistic messages from formData
   → User sees their message + "AI is thinking..."

3. Backend processes request (2-5 seconds)
   → Optimistic messages still showing

4. Action completes, loader revalidates
   → navigation.formData clears
   → Real messages from database replace optimistic ones
```

**Why this works:**

- `navigation.formData` is available during the entire request
- When the request completes, React Router clears `formData`
- When `formData` clears, your condition becomes false
- The optimistic messages disappear, replaced by real ones

**Key pattern:**

```javascript
// Start with real data
let displayMessages = [...messages];

// Add optimistic data if submitting
if (navigation.formData?.has("message")) {
  displayMessages.push(/* optimistic messages */);
}

// Render the combined array
<ChatMessages messages={displayMessages} />;
```

### ✅ Reference implementation

**🔗 Commit**: [`b388384`](19/commits/b388384)

Study how this commit:

- Uses `navigation.formData` to detect form submissions
- Creates temporary message objects
- Maintains the real messages array immutably
- Provides clear documentation of the flow

### 💬 Discussion points

1. **Could you make the optimistic UI more sophisticated?**

   - Show a typing animation for the bot?
   - Add a timestamp?
   - Show a retry button if it takes too long?

2. **Why use `useNavigation` instead of `useFetcher`?**
   - Research: What's the difference between these hooks?
   - When would you prefer one over the other?
   - What are the tradeoffs in complexity vs functionality?

### 🧪 Test your solution

**Visual feedback test:**

1. Open your app and navigate to a chat thread
2. Type a message and click Send
3. **Immediately observe**:
   - ✅ Your message should appear instantly
   - ✅ "AI is thinking..." should appear below it
4. **After a few seconds**:
   - ✅ The optimistic messages disappear
   - ✅ Real messages with proper IDs appear
   - ✅ The AI's actual response replaces "AI is thinking..."

**Edge case tests:**

- What happens if you submit multiple messages quickly?
- What happens if you navigate away during the request?
- What happens if the request fails?

**💡 Think about this**: Measure the perceived performance difference. How much faster does the app _feel_ even though the actual request time hasn't changed? This is the power of optimistic UI!

---

## 🎉 Congratulations!

You've successfully transformed your chatbot into an AI-powered conversational interface! Here's what you've accomplished:

✅ **Integrated an external API** - You learned how `fetch()` works on the server just like it does in the browser

✅ **Handled sequential async operations** - Your endpoint now coordinates multiple database queries and API calls in the correct order

✅ **Managed data transformation** - You translated between your database schema and the Mistral API format seamlessly

✅ **Implemented conversation context** - Your AI remembers and responds based on the full conversation history

✅ **Customized AI behavior** - System prompts let you shape the chatbot's personality and response style

✅ **Created optimistic UI** - Users get instant feedback, making your app feel dramatically faster

## 🚀 Extra challenges

Ready to take your chatbot further? Try these enhancements:

### 1. **Model selection**

Let users choose different AI models:

- Add a dropdown to select: `mistral-small-latest`, `mistral-medium-latest`, etc.
- Store the selection in thread metadata or user preferences
- Experiment: how do different models compare in speed and quality?

### 2. **Temperature control**

Add a "creativity" slider:

- Temperature parameter (0.0 = deterministic, 1.0 = very creative)
- UI slider that passes temperature to the API
- Test: how does temperature affect responses?

### 3. **Custom system prompts per thread**

Allow users to set a custom personality per conversation:

- Add a `system_prompt` column to the threads table
- UI to edit the system prompt
- Use the thread's custom prompt instead of the hardcoded one

### 4. **Message regeneration**

Allow users to regenerate AI responses:

- "Regenerate" button on bot messages
- Delete and recreate the message
- Keep conversation context intact

## 📚 Additional resources

### Mistral AI Documentation

- [Mistral API Documentation](https://docs.mistral.ai/api/)
- [Chat Completion Endpoint](https://docs.mistral.ai/api/endpoint/chat)
- [Model Overview](https://docs.mistral.ai/models/) - Compare different models

### React Router

- [useNavigation Hook](https://reactrouter.com/api/hooks/useNavigation#usenavigation) - Accessing navigation state
- [Optimistic UI Patterns](https://reactrouter.com/start/framework/pending-ui#optimistic-ui)

### Fetch API

- [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN: Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)

### Prompt Engineering

- [Mistral Prompt Engineering Guide](https://docs.mistral.ai/capabilities/completion/prompting_capabilities)
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering) - Techniques apply to all LLMs
