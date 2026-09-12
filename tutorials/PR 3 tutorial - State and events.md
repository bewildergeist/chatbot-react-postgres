# React State and Event Handling - Step-by-Step Tutorial

## 🎯 Learning Objectives

By the end of this tutorial, you will understand and be able to implement:

- **Props destructuring** patterns for cleaner, more maintainable code
- **Event handling** in React components with onClick and onSubmit
- **React hooks**, specifically `useState` for managing component state
- **State lifting** and callback props for parent-child communication
- **Form handling** with controlled and uncontrolled component patterns
- **Computed state** and real-time data filtering
- **Accessibility** considerations for interactive elements

## 📋 Prerequisites

You should be comfortable with:

- Basic React component creation and JSX syntax ([PR #1](../pull/1))
- Rendering lists with `.map()` and keys ([PR #2](../pull/2))
- ES6 features like destructuring, arrow functions, and template literals
- Basic CSS and HTML concepts

## 📑 Table of Contents

1. [Mastering props destructuring](#step-1)
2. [Adding interactive UI elements](#step-2)
3. [Handling events and debugging](#step-3)
4. [Managing state with React hooks](#step-4)
5. [Form handling and component state](#step-5)
6. [State lifting and parent-child communication](#step-6)
7. [Advanced state patterns with real-time filtering](#step-7)

## 🗺️ Overview

In this tutorial, we'll build upon our basic chat application by adding interactive features. You'll learn how to handle user interactions, manage changing data with state, and create responsive user interfaces. We'll start with simple button clicks and progress to complex form handling and real-time filtering.

## 🧑‍💻 Today's starting point

If you haven't fully completed the prior tutorials, you may copy the starting point of this tutorial by running this command in the root of your local repository:

```bash
npx degit --force bewildergeist/chatbot-react-postgres#pr-3-start
```

**Important**: Make a commit of this initial version before you start changing anything.

---

<a name="step-1"></a>

## Step 1: Mastering props destructuring

### 🤔 Problem to solve

As React applications grow, accessing props with `props.propName` everywhere becomes verbose and makes components harder to read. You need a cleaner way to work with props that makes your component interfaces more explicit and maintainable.

### 💡 Key concepts

- **Props destructuring** extracts specific props directly in function parameters
- **Default values** prevent errors when props are undefined
- **Self-documenting code** makes component interfaces clearer at a glance

### 📝 Your task

Refactor all components in the chat application to use props destructuring:

1. Open each component file (`Chat.jsx`, `Sidebar.jsx`, and components within them)
2. Replace `props.propName` access patterns with destructured parameters
3. Add sensible default values for props that might be undefined (especially arrays and objects)
4. Ensure the application still works correctly after your changes

### 🔍 Implementation hints

- Function parameters support destructuring syntax: `function MyComponent({ propName })`
- Default values use the `=` operator: `{ threads = [] }`
- Consider what happens if a parent forgets to pass a prop—what's a safe fallback?
- Test with missing props to verify your defaults work correctly

### 💡 Think about this

Before implementing: Which props are most critical to have defaults for? What could break if an array prop is `undefined` when you try to call `.map()` on it?

### ✅ Reference implementation

**🔗 Commit**: [`edc0b74`](3/commits/edc0b74ee1c4a61ba284bab32c1176a4fc19a2e9)

### 💬 Discussion points

1. **Why are default values important?** What happens if a parent component forgets to pass a required prop?
2. **How does destructuring make code more maintainable?** Consider a component that uses 5-6 different props.

### 🧪 Test your solution

- Remove a default value and observe what error appears in the browser console
- Pass `undefined` for a prop and verify your defaults handle it gracefully
- Check that the `ChatThreadsList` component works even without the `threads` prop

---

<a name="step-2"></a>

## Step 2: Adding interactive UI elements

![hover-button-chat-thread](https://github.com/user-attachments/assets/841f39d3-f796-435f-9098-d473f13fa9ab)

### 🤔 Problem to solve

User's might want to be able to delete a chat thread. First you need to add delete buttons to each chat thread that appear on hover and provide clear visual feedback about their destructive action.

### 💡 Key concepts

- **Semantic HTML** using proper button elements for interactions
- **CSS hover states** for progressive disclosure of UI elements
- **Accessibility** with ARIA labels and focus management
- **Flexbox layouts** for aligning interactive elements

### 📝 Your task

Add a delete button to each thread item in the chat sidebar:

1. In `ChatThreadItem`, wrap the existing `<a>` in a new `<div className="chat-thread-item-content">`
2. Add a `<button>` **next to the link, inside that same wrapper** — as a sibling of the `<a>`, not inside it
3. Style the wrapper with flexbox so the link takes the available space and the button sits at the right
4. Make the button appear only when the thread item is hovered, using a CSS transition
5. Give it a red hover colour to signal that it's destructive
6. Add proper accessibility attributes (`aria-label`, `type="button"`)

### ⚠️ Get the nesting right — this matters later

It's tempting to put the button *inside* the `<a>`, since it visually sits on top of the thread
row. **Don't.** Two reasons:

- **It's invalid HTML.** The spec forbids interactive elements (like `<button>`) inside other
  interactive elements (like `<a>`).
- **It would break step 3.** A click on a button nested inside a link still activates the link,
  and it is surprisingly awkward to stop that. Putting the button beside the link avoids the
  problem entirely rather than fighting it.

This is a good example of a general principle: when an interaction is fiddly to implement, the
markup structure is often the thing to change, not the event handling.

### 🔍 Implementation hints

<details>
<summary>💡 Hint: The structure you're aiming for</summary>

```jsx
<li className="chat-thread-item">
  <div className="chat-thread-item-content">
    <a ...>{title}</a>
    <button ...>&times;</button>
  </div>
</li>
```

The link and the button are siblings. The wrapper is what gets the flexbox layout and the hover
state.

</details>

<details>
<summary>💡 Hint: Show on hover</summary>

Give the button `opacity: 0` by default, and reveal it when the *wrapper* is hovered:

```css
.chat-thread-item-content:hover .delete-thread-btn { opacity: 1; }
```

Add a `transition` on the button so it fades rather than snaps.

</details>

<details>
<summary>💡 Hint: Layout</summary>

`display: flex` on the wrapper, plus `flex: 1` on the link, pushes the button to the right edge
without needing `justify-content`.

</details>

- The button needs `type="button"` so it never submits a form
- Use an icon-like character for the content — the reference uses `&times;` (✕)

### ✅ Reference implementation

**🔗 Commit**: [`17812b4`](3/commits/17812b46701fd489a722fced2e81579fa07fb7f2)

### 💬 Discussion points

1. **Why hide buttons until hover?** What are the UX benefits of progressive disclosure?
2. **How do accessibility attributes help users?** Consider users with screen readers or keyboard navigation.

### ⚠️ Common mistakes

- **Putting the `<button>` inside the `<a>`** — invalid HTML, and it makes step 3 much harder
- Forgetting `type="button"` makes buttons submit forms unexpectedly
- Hiding the button with `display: none` instead of `opacity: 0` — it can't be focused by
  keyboard and won't animate
- Poor colour choices don't communicate button purpose

### 🧪 Test your solution

- Hover over different threads and verify the buttons fade in smoothly
- Try tabbing through the interface — can you reach the delete buttons with a keyboard?
- Open dev tools and confirm the `<button>` is a **sibling** of the `<a>`, not a child of it
- Clicking the thread title still navigates (the links don't do anything useful yet, but the URL
  should change)

---

<a name="step-3"></a>

## Step 3: Handling events and debugging

<img width="1198" height="386" alt="console-log-on-button-click" src="https://github.com/user-attachments/assets/800b9bfc-c840-445c-b875-a7c199375402" />

### 🤔 Problem to solve

Pretty buttons are useless without functionality! You need to respond to user clicks on the
delete button and understand how events work in React.

Because you put the button *beside* the link in step 2 rather than inside it, clicking delete
already doesn't navigate anywhere — the structure solved that for you. But events in the DOM
travel upwards through ancestors, so it's worth handling this deliberately and understanding
exactly what's happening.

### 💡 Key concepts

- **Event handlers**: functions that respond to user interactions
- **Event objects**: contain information about what happened
- **Event bubbling**: an event fires on the element you clicked, then on each of its ancestors
- **`stopPropagation()` vs `preventDefault()`**: two very different things that are easy to confuse
- **Console logging** for debugging and development

### 📝 Your task

Make the delete button respond to clicks:

1. Create an event handler function called `handleDeleteClick` inside `ChatThreadItem`
2. Attach it to the delete button's `onClick` prop
3. Call `event.stopPropagation()` so the click doesn't bubble up to the surrounding `<li>` and
   anything that might later listen there
4. Log useful debugging information to the console (thread id, title, timestamp)

### 🔍 Implementation hints

<details>
<summary>💡 Hint: Handler shape</summary>

Event handlers receive the event object as their first parameter, and you pass the function *by
reference* — no parentheses:

```jsx
<button onClick={handleDeleteClick}>
```

Writing `onClick={handleDeleteClick()}` calls it immediately during render instead.

</details>

<details>
<summary>💡 Hint: Structured logging</summary>

`console.log()` with an object keeps related values together and expandable in dev tools:

```js
console.log("Delete clicked", { id, title, timestamp: new Date().toISOString() });
```

</details>

### 💡 Think about this

**`stopPropagation()` and `preventDefault()` do completely different jobs, and confusing them
causes bugs that are genuinely hard to diagnose.**

- `stopPropagation()` stops the event travelling further *up the tree* to ancestor elements. It
  has **no effect** on what the browser does by default.
- `preventDefault()` cancels the browser's **default behaviour** for that event — following a
  link, submitting a form, ticking a checkbox. It does not stop the event propagating.

Here's the trap worth remembering. If you *had* nested the button inside the `<a>`, calling
`stopPropagation()` alone would **not** have stopped the browser navigating — a link's activation
isn't a listener on an ancestor, it's the browser's default action, so only `preventDefault()`
cancels it. You'd need both, on invalid HTML, to get behaviour you can achieve for free by
putting the button beside the link instead.

Which of the two would you need to stop a form submitting? Which to stop a click reaching a
parent's `onClick`?

### ✅ Reference implementation

**🔗 Commit**: [`2034b20`](3/commits/2034b200f56338eddcac3d02a98b982aa17b7754)

### 💬 Discussion points

1. **Is `stopPropagation()` actually doing anything here?** Nothing currently listens for clicks
   on the ancestors of the button. So is it pointless, or is it reasonable defensive code? Make
   an argument either way.
2. **What information is useful for debugging?** How can console logs help during development?

### ⚠️ Common mistakes

- **Calling the handler instead of passing it**: `onClick={handleDeleteClick()}` runs it once
  during render and passes the return value to `onClick`. Leave the parentheses off.
- **Assuming `stopPropagation()` prevents navigation.** It doesn't — that's `preventDefault()`.
  This is the single most common misunderstanding about DOM events.

### 🧪 Test your solution

- Open your browser's developer tools (F12) and click delete buttons — each click should log
- Clicking the thread title still navigates; clicking delete does not
- **Run the experiment**: temporarily remove `stopPropagation()`. Nothing changes, because the
  button isn't inside the link and nothing above it is listening. Now you've seen for yourself
  that it isn't what's preventing navigation — the markup structure is.
- **Optional, to see the trap for real**: temporarily move the `<button>` inside the `<a>`,
  keeping only `stopPropagation()` in the handler. Click delete — the browser navigates anyway.
  Add `preventDefault()` and it stops. Then put the markup back the way it was.

---

<a name="step-4"></a>

## Step 4: Managing state with React hooks

![delete-thread-on-click](https://github.com/user-attachments/assets/38a59ae1-1df3-49c1-80a0-bfad362747a2)

### 🤔 Problem to solve

Console logging is great for debugging, but users expect buttons to actually do something! You need to transform the static `threads` array into dynamic state that can be modified when users click delete. This requires understanding where state should live and how to communicate changes up the component tree.

### 💡 Key concepts

- **useState hook** for managing dynamic data
- **State updates** must be immutable (create new arrays, don't modify existing ones)
- **Callback props** for passing functions to child components
- **Unidirectional data flow** - data flows down, events flow up

### 📝 Your task

Transform the static threads array into stateful data and implement actual deletion:

1. In `layout.jsx`, convert the `threads` array to state using `useState`
2. Create a `deleteThread` function that removes a thread by its ID
3. Use `filter()` to create a new array without the deleted thread (don't mutate!)
4. Pass the `deleteThread` function down through props: Layout → Sidebar → ChatThreadsList → ChatThreadItem
5. In `ChatThreadItem`, call the `onDeleteThread` callback instead of just logging
6. Test that clicking delete actually removes threads from the UI

### 🔍 Implementation hints

- Import `useState` from React: `import { useState } from 'react'`
- Use the functional form of `setState` when the new state depends on the old state
- The `filter()` method returns a new array containing only items that pass a test
- Each component in the chain needs to accept and pass down the callback prop
- Think about prop names: `onDeleteThread` in the child, `deleteThread` in the parent

### 💡 Think about this

Before implementing: How would you remove an item from an array without modifying the original array? Why is immutability important in React?

### ✅ Reference implementation

**🔗 Commit**: [`33de560`](3/commits/33de56090b7491b82d2caf6028bb3140f6c0c5c4)

### 💬 Discussion points

1. **Why use `filter()` instead of `splice()`?** What's the difference between mutating and creating new arrays?
2. **How does the callback pattern work?** Trace the path from clicking delete to updating state.

### 🧪 Test your solution

- Click delete buttons and watch threads disappear from the UI
- Open React DevTools to see state changes in real-time
- What happens if you forget to pass `onDeleteThread` to a child component?
- Challenge: try modifying the delete function to restore a thread after 3 seconds using `setTimeout`

---

<a name="step-5"></a>

## Step 5: Form handling and component state

![pending-submit-on-chat-input](https://github.com/user-attachments/assets/49f35a2b-682f-44cd-88ae-66458b65f930)

### 🤔 Problem to solve

The chat input looks like a form but doesn't behave like one. You need to add proper form submission handling, implement loading states to show when something is processing, and provide user feedback during operations. This is crucial for good user experience, especially with async operations.

### 💡 Key concepts

- **Form elements** and semantic HTML for better accessibility
- **onSubmit handlers** vs onClick handlers
- **Component-level state** with useState
- **Conditional rendering** based on state values
- **Async operation simulation** for realistic user experience

### 📝 Your task

Transform the ChatInput component into a proper interactive form:

1. Wrap the textarea and button in a `<form>` element
2. Add state to track whether the form is submitting: `isSubmitting`
3. Create a `handleSubmit` function that:
   - Prevents default form submission (no page refresh!)
   - Sets `isSubmitting` to true
   - Simulates an async operation with `setTimeout` (1 second)
   - Sets `isSubmitting` back to false after the delay
4. Attach the handler to the form's `onSubmit` prop
5. Disable the submit button while `isSubmitting` is true
6. Show different button text while submitting (e.g., "Sending...")

### 🔍 Implementation hints

- Forms trigger submit events, not click events - use `onSubmit` on the `<form>` element
- Always call `event.preventDefault()` in form submit handlers to prevent page reload
- Use conditional rendering: `{isSubmitting ? "Sending..." : "Send"}`
- The `disabled` attribute on buttons prevents interaction during processing
- `setTimeout` mimics async operations like API calls for now

### 💡 Think about this

What happens if you forget `event.preventDefault()`? Try it and see! Also, why disable the button during submission?

### ✅ Reference implementation

**🔗 Commit**: [`c1f8119`](3/commits/c1f8119808be387e49af90c3e0325f2568b6704c)

### 💬 Discussion points

1. **Why use a form element instead of just div + button?** Consider keyboard users and screen readers.
2. **When should you show loading states?** How do they improve user experience?

### ⚠️ Common mistakes

- Forgetting `event.preventDefault()` causes page refreshes
- Not disabling buttons during submission allows double-clicks
- Missing loading states leave users wondering if something happened

### 🧪 Test your solution

- Try submitting the form multiple times quickly. What prevents duplicate submissions?
- Press Enter while focused in the textarea. Does the form submit properly?
- Watch the button text and state change during submission

---

<a name="step-6"></a>

## Step 6: State lifting and parent-child communication

![add-message-on-submit](https://github.com/user-attachments/assets/2119afe2-d10d-4e20-b1c3-e7d3f138b254)

### 🤔 Problem to solve

The chat input can submit but messages don't appear anywhere! You need to connect form submission to the messages list. This requires understanding where state should live and how child components communicate changes back to parents. The `ChatInput` and `ChatMessages` components are siblings, so their shared state must live in their common parent.

### 💡 Key concepts

- **State lifting** - moving state up to the nearest common parent
- **Callback props** for child-to-parent communication
- **FormData API** for uncontrolled form handling
- **Immutable updates** with spread operator
- **Form validation** and user experience

### 📝 Your task

Connect form submission to the messages list through lifted state.

**First, decide the contract between the two components.** `ChatInput` owns the form;
`Home` owns the list. What should travel between them? Pass the **finished message text as a
string** — `ChatInput` deals with form mechanics, `Home` deals with messages. Keep that split
clear and both components stay simple.

1. Add `name="message"` to the textarea so `FormData` can find it
2. In `ChatInput`, extend `handleSubmit` to:
   - Build a `FormData` object from the form
   - Pull out the message text and `.trim()` it
   - **Return early if it's empty** — don't submit blank messages
   - Call the `onAddMessage` callback, passing **the trimmed string**
   - Reset the form afterwards
3. In `Home`, convert the `messages` array to state using `useState`
4. Create an `addMessage` function in `Home` that:
   - Accepts the message **text** as its parameter
   - Builds a new message object with an `id`, `type: "user"`, and that text as `content`
   - Appends it to the messages array **immutably**
5. Pass `addMessage` down: `<ChatInput onAddMessage={addMessage} />`
6. Test by typing messages and watching them appear in the chat

### ⚠️ Keep the contract straight

It's tempting to hand the whole `FormData` object up to `Home` and let it do the extracting. It
works, and you'll see the pattern in real codebases — but **pick one and be consistent**, because
the two options are not interchangeable and mixing them fails in a nasty way.

If `ChatInput` passes a `FormData` object while `Home` expects a string, you don't get an error.
React quietly renders the FormData's contents, and your message appears as something like
`messagehello world` — the field name stuck onto the front of the text. No crash, no warning,
just a wrong result. Silent failures like this are much harder to track down than exceptions.

**This tutorial and the reference implementation both pass a string.** Later tutorials build on
that, so stick with it.

### 🔍 Implementation hints

<details>
<summary>💡 Hint: Reading a form field</summary>

```js
const formData = new FormData(event.target);
const message = formData.get("message").trim();
```

`event.target` is the `<form>` element. `"message"` matches the `name` attribute on the textarea
— if they don't match, you get `null` and `.trim()` throws.

</details>

<details>
<summary>💡 Hint: Immutable append</summary>

Never `push()` into state. Build a new array with the spread operator:

```js
setMessages([...messages, newMessage]);
```

React compares the old and new values to decide whether to re-render; mutating in place leaves it
looking at the same array and nothing updates.

</details>

<details>
<summary>💡 Hint: Generating an id</summary>

The reference uses `messages.length + 1` — simple, and fine while messages are only ever added.
`Date.now()` is another easy option. Have a look at the discussion point below about which one
survives contact with a delete button.

</details>

### 💡 Think about this

Where should the messages state live — in `ChatInput`, in `ChatMessages`, or in `Home`? Work
through each option before you look:

- `ChatInput` has the new message but doesn't render the list
- `ChatMessages` renders the list but never sees the new message
- `Home` renders both

The rule this illustrates: **when two sibling components need to share data, the state belongs in
their nearest common parent.** That's what "lifting state up" means, and you'll apply it
constantly.

### ✅ Reference implementation

**🔗 Commit**: [`88ed179`](3/commits/88ed1791b4ccfda6c71e289193d40b7393a187fa)

### 💬 Discussion points

1. **What's the difference between controlled and uncontrolled forms?** This form is
   *uncontrolled* — React never tracks what you type, it just reads the values on submit. When
   would you want the controlled approach instead? (You'll build one in step 7.)
2. **Where does validation belong?** You put the empty check in `ChatInput`. Could it just as
   well live in `Home`? What about in both?
3. **Is `messages.length + 1` a good id?** Add three messages, then imagine deleting the second
   one and adding another. What id does the new message get, and what breaks?

### ⚠️ Common mistakes

- **Mismatched contract**: passing `FormData` from `ChatInput` while `Home` expects a string.
  Renders `messagehello world` instead of `hello world`, with no error. See the warning above.
- **Forgetting `name="message"`** on the textarea — `formData.get("message")` returns `null` and
  `.trim()` throws `Cannot read properties of null`.
- **Mutating state**: `messages.push(newMessage)` followed by `setMessages(messages)` renders
  nothing, because it's still the same array.

### 🧪 Test your solution

- Type a message and watch it appear in the chat
- Submit an empty message, and one containing only spaces — neither should be added
- The form clears after a successful submission
- Check your own contract: `console.log` what `addMessage` receives. It should be a plain string,
  not a `FormData` object
- Challenge: add a timestamp to each message object and display it in the bubble

---

<a name="step-7"></a>

## Step 7: Advanced state patterns with real-time filtering

![filter-chat-threads](https://github.com/user-attachments/assets/2e4ee14b-a3b3-4f70-8daf-1b1719a94b82)

### 🤔 Problem to solve

As users accumulate many chat threads, finding specific conversations becomes difficult. You need to add search functionality that filters threads in real-time as users type. This introduces the concept of controlled components and computed state - important patterns for creating responsive, interactive UIs.

### 💡 Key concepts

- **Controlled components** where React manages input values
- **Computed state** - deriving data without additional useState
- **Real-time filtering** with array methods
- **Case-insensitive search** for better user experience
- **When to compute vs store** - performance considerations

### 📝 Your task

Add a search input that filters the thread list in real-time:

1. In the `ChatThreadsList` component, add state for the search value
2. Create an `<input>` element above the threads list
3. Make it a **controlled component** by:
   - Setting its `value` prop to the search state
   - Handling `onChange` events to update the state
4. Compute filtered threads (don't use `useState` for this!):
   - Use `filter()` to create a new array of matching threads
   - Use `includes()` to check if the thread title contains the search text
   - Convert both to lowercase for case-insensitive matching
5. Pass `filteredThreads` instead of `threads` to the list component
6. Test by typing in the search box and watching threads filter instantly

### 🔍 Implementation hints

- Controlled components: `<input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />`
- The event object has `e.target.value` containing the current input value
- Computed values are just regular variables: `const filtered = array.filter(...)`
- String methods: `.toLowerCase()` and `.includes(substring)`
- Think about when to compute: is this data that changes based on other state?
- Add a placeholder to guide users: `placeholder="Search threads..."`

### 💡 Think about this

Should `filteredThreads` be stored in state with `useState`, or computed on each render? What are the performance implications? When would you choose one approach over the other?

### ✅ Reference implementation

**🔗 Commit**: [`6425c64`](3/commits/6425c6405fc04155a264ccb683c11fb31698bb22)

### 💬 Discussion points

1. **Controlled vs uncontrolled components**: What are the benefits and drawbacks of each approach?
2. **When should you compute state vs store it?** Consider memory usage and re-render frequency.

### 🧪 Test your solution

- Type in the search box and watch threads filter in real-time!
- Try partial matches (e.g., typing "work" to find "Work project")
- Test case-insensitivity (uppercase and lowercase searches should work the same)
- What happens if you search for something that doesn't match any threads?
- Challenge: try implementing "clear search" functionality - where would you add it?

---

## 🚀 Extra features if you have time

### Challenge 1: Enhanced form validation

- Add minimum message length requirements
- Show validation errors to users
- Prevent submission of whitespace-only messages

### Challenge 2: Advanced filtering

- Add filtering by thread topic or date
- Implement multiple search terms with AND/OR logic
- Add search history dropdown

### Challenge 3: Keyboard shortcuts

- Implement Ctrl+K for focusing search
- Add Enter/Escape handling for search
- Tab navigation improvements

---

## 📚 Additional resources

### React documentation

- [useState hook](https://react.dev/reference/react/useState)
- [Responding to Events](https://react.dev/learn/responding-to-events)
- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)

### Advanced topics for future learning

- useEffect for side effects and lifecycle management
- Custom hooks for reusable stateful logic
- Context API for global state management
- useReducer for complex state logic

### Best practices

- Always use keys when rendering lists
- Keep state as close to where it's used as possible
- Prefer computed state over storing derived data
- Use semantic HTML for better accessibility
- Implement proper loading and error states

---

**🏁 Congratulations:** You've completed a comprehensive tutorial on React state management and event handling! You now understand:

✅ How to structure components with clean props destructuring  
✅ Creating interactive UIs with proper event handling  
✅ Managing dynamic data with React hooks  
✅ Implementing parent-child communication patterns  
✅ Building forms with proper validation and feedback  
✅ Advanced state patterns with computed data and real-time filtering

These concepts form the foundation for building modern, interactive React applications. Keep practicing and experimenting with different state patterns 🤘
