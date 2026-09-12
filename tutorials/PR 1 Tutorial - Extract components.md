# Component extraction and React hierarchy - step-by-step tutorial

## 🎯 Learning objectives

By the end of this tutorial, you will be able to:

- **Break a large component into smaller ones**: identify good boundaries and extract them
- **Pass data with props**: send values from a parent component into a child
- **Build a component hierarchy**: compose complex UI out of simple, focused pieces
- **Organise components into files**: use `import` / `export` to split code across modules
- **Use `props.children`**: React's pattern for passing content *inside* a component

## 📋 Prerequisites

- **JavaScript fundamentals**: variables, functions, objects, and ES6 syntax
- **Basic HTML/CSS**: HTML elements and CSS classes
- **React basics** (helpful but not required): some of you may have prior React experience — if so, help out others who don't!

## 📑 Table of contents

1. [Extract the Sidebar component](#step-1)
2. [Extract the SidebarHeader component](#step-2)
3. [Extract the SidebarFooter component](#step-3)
4. [Extract the ChatThreadsList component](#step-4)
5. [Extract ChatThreadItem with props](#step-5)
6. [Move the sidebar components to their own file](#step-6)
7. [Extract the Message component with props](#step-7)
8. [Extract the ChatMessages component](#step-8)
9. [Extract the ChatInput component](#step-9)
10. [Move the chat components to their own file](#step-10)
11. [Use props.children for message content](#step-11)

## 🗺️ Overview

In this tutorial you'll take a chatbot interface that is written as two big components and break
it down into a well-structured set of small ones. The focus is on *how you organise the code*,
not on what the app does — the UI should look exactly the same when you're finished.

You'll work outside-in: first the sidebar, then the chat area, and in both cases you'll extract
the pieces one at a time before moving them into their own file. This is how refactoring actually
happens in real projects — in small, safe steps where the app keeps working the whole way.

## 🧑‍💻 Today's starting point

To skip the initial setup of the project, copy the starting point of this tutorial by running
this command in the root of your local repository:

```bash
npx degit --force bewildergeist/chatbot-react-postgres#pr-1-start
```

**Important**: make a commit of this initial version before you start changing anything.

### Getting the app running

The command above gives you a `frontend/` folder. Everything in this tutorial happens inside it:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** and you should see the chatbot interface. Leave the dev server
running while you work — it reloads the page automatically every time you save a file.

> ⚠️ **About the security warnings.** `npm install` will report something like
> *"23 vulnerabilities (1 low, 4 moderate, 14 high, 4 critical)"*. This looks alarming, but these
> are all in build tools that run on your own machine during development — this project's
> dependencies were pinned a while ago and have since had advisories published. Nothing here is
> reachable by a visitor to your app. Clear the easy ones with:
>
> ```bash
> npm audit fix
> ```
>
> That takes you from 23 down to 8 and the app keeps working.
>
> **The 8 that remain — including 4 marked critical — are expected. Leave them.** Clearing them
> requires major version upgrades of React Router and Vite, which will break the code in this tutorial. 

### Where the code lives

Two files matter today:

| File | What's in it |
| --- | --- |
| `app/routes/layout.jsx` | The page shell — sidebar plus a slot for the main content |
| `app/routes/home.jsx` | The chat area — messages and the input box |

Open both and read them before you start. Notice how much is crammed into each one.

---

<a name="step-1"></a>

## Step 1: Extract the Sidebar component

### 🤔 Problem to solve

`layout.jsx` is doing two jobs at once: it defines the overall page structure *and* it contains
every last detail of the sidebar — header, navigation, footer. That makes the file long and hard
to scan, and it means you can't reuse the sidebar anywhere else.

### 💡 Key concepts

- **Function components**: a React component is just a function that returns JSX
- **Component extraction**: moving a chunk of JSX into its own function
- **Component composition**: using one component inside another, like an HTML tag
- **Separation of concerns**: each component should have one clear responsibility

### 📝 Your task

1. In `layout.jsx`, add a new function called `Sidebar` above the existing `Layout` function
2. Move the entire `<aside className="sidebar">…</aside>` block into it, and `return` it
3. In `Layout`, replace where that block used to be with `<Sidebar />`
4. Check the browser — the page should look **exactly** the same as before

### 🔍 Implementation hints

<details>
<summary>💡 Hint: What a function component looks like</summary>

A component is a function that returns JSX. The name **must** start with a capital letter —
that's how React tells your components apart from HTML tags:

```jsx
function Sidebar() {
  return <aside className="sidebar">...</aside>;
}
```

</details>

<details>
<summary>💡 Hint: Using your component</summary>

Once the function exists, you use it like a self-closing HTML tag: `<Sidebar />`. Note the space
and slash — React components written this way must be self-closed.

</details>

### 💡 Think about this

Before you start: when you move that JSX, does anything inside it depend on something defined in
`Layout`? (For this step, no — which is exactly why it's a safe boundary to cut along.)

### ✅ Reference implementation

**🔗 Commit**: [`2c8065b`](1/commits/2c8065b7c9f150592351cfd080afdde1a71732b8)

### 💬 Discussion points

1. **Component boundaries**: what made this a good place to split the component?
2. **Responsibility**: describe what `Layout` is responsible for now, compared to before.

### 🧪 Test your solution

- The page renders identically to before — same sidebar, same chat area
- Check the browser console: no errors, no warnings
- Try temporarily renaming `Sidebar` to `sidebar` (lowercase) and reload. What happens, and why?

---

<a name="step-2"></a>

## Step 2: Extract the SidebarHeader component

### 🤔 Problem to solve

`Sidebar` is now its own component, but it's still doing three things: the header with the title
and "New" button, the list of chat threads, and the user profile footer. Each of those is a
distinct chunk of UI with its own job.

### 💡 Key concepts

- **Single responsibility principle**: each component should do one thing well
- **Naming**: a good component name describes what it *is*, not what it looks like

### 📝 Your task

1. Create a `SidebarHeader` function containing the `<div className="sidebar-header">` block —
   the "Chatbot" title and the "+ New" link
2. Use `<SidebarHeader />` inside `Sidebar` where that block used to be

### 💬 Discussion points

1. **Why extract this?** The header is only used once. What do you gain by pulling it out anyway?
2. **Naming conventions**: why is `SidebarHeader` a better name than, say, `TopBit` or `Header`?

### ✅ Reference implementation

**🔗 Commit**: [`b6b7cdb`](1/commits/b6b7cdbc7883ddd5e24e51f7930ae6b11ee7d883)

### 🧪 Test your solution

- The header still shows the "Chatbot" title and the "+ New" button
- `Sidebar` is now noticeably shorter and easier to read

---

<a name="step-3"></a>

## Step 3: Extract the SidebarFooter component

### 🤔 Problem to solve

The user profile at the bottom of the sidebar has the same story as the header: its own distinct
job, currently mixed in with everything else.

### 📝 Your task

Apply exactly the same pattern as step 2. Create a `SidebarFooter` function for the
`<div className="sidebar-footer">` block (the avatar image and username), and use it inside
`Sidebar`.

### 💡 Think about this

You've now done this twice. Can you describe the recipe in one sentence, without looking at the
code? Being able to name a pattern is what lets you apply it somewhere new.

### ✅ Reference implementation

**🔗 Commit**: [`70fe14f`](1/commits/70fe14faa78bcda6ccd50f0b552a447434b9de4a)

### 💬 Discussion points

1. **Pattern recognition**: how is this identical to the `SidebarHeader` extraction?
2. **Boundaries**: what visual or logical cues tell you where one component ends and the next begins?

---

<a name="step-4"></a>

## Step 4: Extract the ChatThreadsList component

### 🤔 Problem to solve

The navigation list is the biggest thing left in `Sidebar` — fourteen chat threads, each one a
`<li>` with a link inside. It deserves its own component.

### 💡 Key concepts

- **Container components**: components whose job is to hold a collection of things
- **Semantic HTML**: keeping `<nav>`, `<ul>` and `<li>` properly nested as you move code around

### 📝 Your task

1. Create a `ChatThreadsList` function containing the whole `<nav className="chat-threads-list">`
   block, including the `<ul>` and all fourteen `<li>` items
2. Use `<ChatThreadsList />` inside `Sidebar`

After this step, `Sidebar` should be short enough to read at a glance — just three components
stacked inside an `<aside>`.

### ⚠️ Common mistakes

- **Moving only the `<ul>` and leaving the `<nav>` behind.** Keep the whole block together — the
  `<nav>` and its `aria-label` are part of what makes this list meaningful to screen readers.
- **Forgetting that the fourteen `<li>` items come too.** They're still hardcoded at this point;
  you'll deal with the repetition in the next step.

### ✅ Reference implementation

**🔗 Commit**: [`e5ac28d`](1/commits/e5ac28d3bd91447ba6aa86a7463f47aff13921d1)

### 💬 Discussion points

1. **Granularity**: is this the right level of extraction, or could you go smaller?
2. **Data vs. structure**: this component contains both the markup *and* the list of threads.
   What are the downsides of that?

### 🧪 Test your solution

- All fourteen threads still appear in the sidebar
- Look at your `Sidebar` function — can you now understand the whole sidebar in about five seconds?

---

<a name="step-5"></a>

## Step 5: Extract ChatThreadItem with props

### 🤔 Problem to solve

Look inside `ChatThreadsList`. There are fourteen `<li>` elements with *identical* structure —
only the link target and the text differ. That's the same markup written out fourteen times. If
you ever needed to change how a thread item looks, you'd have to make the same edit fourteen
times and hope you didn't miss one.

This is your first encounter with **props**, and it's the most important idea in this tutorial.

### 💡 Key concepts

- **Props**: how a parent component passes data down to a child
- **Parameterisation**: one component, many different sets of data
- **DRY (Don't Repeat Yourself)**: write the structure once, reuse it with different values

### 📝 Your task

1. Create a `ChatThreadItem` function that takes a single `props` parameter
2. Move **one** `<li className="chat-thread-item">…</li>` into it
3. Replace the hardcoded link target and text with `props.href` and `props.title`
4. Back in `ChatThreadsList`, replace all fourteen `<li>` elements with fourteen
   `<ChatThreadItem />` elements, passing the right `href` and `title` to each

### 🔍 Implementation hints

<details>
<summary>💡 Hint: Receiving props</summary>

Props arrive as a single object — the first parameter of your function:

```jsx
function ChatThreadItem(props) {
  return <a href={props.href}>{props.title}</a>;
}
```

The curly braces mean "evaluate this JavaScript expression and put the result here".

</details>

<details>
<summary>💡 Hint: Passing props</summary>

You pass props like HTML attributes, but the values can be any JavaScript:

```jsx
<ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
```

The names you choose here (`href`, `title`) are the names you read inside the component
(`props.href`, `props.title`). They have to match.

</details>

### 💡 Think about this

Before you write it: where does `props.href` get its value from? Trace the path with your finger,
from where the value is written to where it's used. This direction — parent to child, always
downwards — is the single most important rule in React.

### ✅ Reference implementation

**🔗 Commit**: [`75ee544`](1/commits/75ee544ef4edbeb2544e01ec134bc5191554b1c2)

### ⚠️ Common mistakes

- **Quoting the curly braces**: `href="{props.href}"` passes the literal string `{props.href}`.
  Write `href={props.href}` with no quotes.
- **Mismatched names**: passing `title=` but reading `props.name` gives you `undefined`, and
  React renders nothing at all rather than throwing an error. Silent failures like this are
  worth learning to recognise early.

### 💬 Discussion points

1. **Reusability**: how many times is `ChatThreadItem` used? What does that tell you about when
   extraction is worth it?
2. **Before the next step**: your `layout.jsx` now holds five separate components. Is that still
   a good place for all of them?

### 🧪 Test your solution

- All fourteen threads render with the correct titles and links
- Deliberately remove the `title` prop from one of them. What renders? Any console error?
- Add a fifteenth thread. How many lines did that take, compared to before this step?

---

<a name="step-6"></a>

## Step 6: Move the sidebar components to their own file

### 🤔 Problem to solve

`layout.jsx` now contains five component definitions. In a real project this file would keep
growing until nobody could find anything in it. Time to split it up.

> **Note**: the commit for this step has a misleading message — it repeats the previous step's
> "Extract ChatThreadItem component with props". What it actually does is move the sidebar
> components into a separate file. Look at the diff, not the message. (Writing accurate commit
> messages is a real skill, and this is what happens when you don't!)

### 💡 Key concepts

- **ES modules**: splitting JavaScript across files with `import` and `export`
- **Default exports**: each file can have one "main" thing it exports
- **File organisation**: grouping related components together

### 📝 Your task

1. Create a new file `app/components/Sidebar.jsx`
2. Move `SidebarHeader`, `ChatThreadItem`, `ChatThreadsList`, `SidebarFooter` and `Sidebar` into it
3. Give `Sidebar` a **default export**; the other four stay private to the file
4. In `layout.jsx`, import `Sidebar` from the new file and delete the moved code

### 🔍 Implementation hints

<details>
<summary>💡 Hint: The export / import pair</summary>

```jsx
// In Sidebar.jsx
export default function Sidebar() { /* ... */ }

// In layout.jsx
import Sidebar from "../components/Sidebar.jsx";
```

With a default export, the importing file chooses the name — it doesn't have to match.

</details>

<details>
<summary>💡 Hint: Getting the path right</summary>

`layout.jsx` lives in `app/routes/`, and the new file is in `app/components/`. So you need to go
*up* one level and back down: `../components/Sidebar.jsx`.

</details>

### 💡 Think about this

Only `Sidebar` is exported, even though there are five components in the file. Why don't the
other four need exporting? What would it mean if you exported all of them?

### ✅ Reference implementation

**🔗 Commit**: [`8f3919a`](1/commits/8f3919ac52b4682ebb1c9507c976e62d65ec0213)

### ⚠️ Common mistakes

- **Forgetting the `.jsx` extension** in the import path.
- **Leaving the old definitions behind** in `layout.jsx` — you'll get a confusing "already
  declared" error, or worse, the old version silently wins.

### 💬 Discussion points

1. **File organisation**: what do you gain by moving components into their own files?
2. **Component boundaries**: how do you decide which components belong in the *same* file?

---

<a name="step-7"></a>

## Step 7: Extract the Message component with props

### 🤔 Problem to solve

Now turn to the chat area. Open `home.jsx` and you'll see ten message bubbles, alternating
between the user and the bot. Same structure every time, only the styling class and the text
change — exactly the repetition you fixed in the sidebar.

### 💡 Key concepts

- **Props for variation**: using a prop to change *styling*, not just content
- **Template literals in JSX**: building a class name from a fixed part and a variable part

### 📝 Your task

1. In `home.jsx`, create a `Message` function taking `props`
2. Give it two props: one for the message type (`"user"` or `"bot"`) and one for the text
3. Use the type prop to build the CSS class, so a user message gets `message user-message` and a
   bot message gets `message bot-message`
4. Replace all ten hardcoded message blocks with `<Message />` elements

### 🔍 Implementation hints

<details>
<summary>💡 Hint: Building a class name from a prop</summary>

A template literal (backticks) lets you mix fixed text with a value:

```jsx
<div className={`message ${props.type}-message`}>
```

With `type="user"` that produces `message user-message`.

</details>

### ✅ Reference implementation

**🔗 Commit**: [`4494bbe`](1/commits/4494bbea98ad8ee27c364b2fae53ab69bebf608d)

### 💬 Discussion points

1. **Props variety**: compare this component's props to `ChatThreadItem`'s. One controls
   appearance and one controls content — does that distinction matter?
2. **Conditional styling**: what other ways could you handle "user vs bot" styling?

### 🧪 Test your solution

- User messages and bot messages still look visually different
- Inspect a message in dev tools and confirm the class is `message user-message`, not
  `message undefined-message`

---

<a name="step-8"></a>

## Step 8: Extract the ChatMessages component

### 🤔 Problem to solve

The messages are components now, but they still sit directly inside `Home` along with the input
box. The scrollable conversation area is its own piece of UI.

### 📝 Your task

Create a `ChatMessages` function containing the `<div className="chat-messages">` wrapper and all
the `<Message />` elements inside it. Use `<ChatMessages />` in `Home`.

### ✅ Reference implementation

**🔗 Commit**: [`90bc5ab`](1/commits/90bc5abd13ad3b37d59f25655a59b32cd97e1b30)

### 💬 Discussion points

1. **Hierarchy**: describe the relationship between `ChatMessages` and `Message`. Which one
   knows about the other?
2. **Container vs. item**: this is the same shape as `ChatThreadsList` and `ChatThreadItem`.
   What's the general pattern?

---

<a name="step-9"></a>

## Step 9: Extract the ChatInput component

### 🤔 Problem to solve

One piece of the chat UI is left: the textarea and send button at the bottom.

### 📝 Your task

Create a `ChatInput` function containing the `<div className="chat-input-container">` block, and
use it in `Home`. When you're done, `Home` should be just two components inside a `<main>`.

### ✅ Reference implementation

**🔗 Commit**: [`f6c1923`](1/commits/f6c1923533fd7bd6e6996fed74439acc9a7c75c8)

### 💡 Think about this

Look at how short `Home` is now. Can you predict what the next step will be? (You've done it
once already.)

### 🧪 Test your solution

- The input box and Send button still render at the bottom of the chat area
- `Home` is now about five lines of JSX

---

<a name="step-10"></a>

## Step 10: Move the chat components to their own file

### 🤔 Problem to solve

Same problem as step 6, same solution — but with a twist. This time you need **three**
components available outside the file, not one.

### 💡 Key concepts

- **Named exports**: exporting several things from one file, each by its own name
- **Named imports**: pulling specific names out with `{ curly braces }`

### 📝 Your task

1. Create `app/components/Chat.jsx`
2. Move `Message`, `ChatMessages` and `ChatInput` into it
3. Export them as **named exports** rather than a default export
4. In `home.jsx`, import the ones it actually uses and delete the moved code

### 🔍 Implementation hints

<details>
<summary>💡 Hint: Named exports, two ways</summary>

You can mark each one as you define it:

```jsx
export function ChatMessages() { /* ... */ }
```

…or list them together at the bottom of the file, which keeps the exports in one place:

```jsx
export { Message, ChatMessages, ChatInput };
```

The reference implementation uses the second style. Both are equally valid.

</details>

<details>
<summary>💡 Hint: Importing named exports</summary>

Named imports use curly braces, and the names **must** match the exported names exactly:

```jsx
import { ChatMessages, ChatInput } from "../components/Chat.jsx";
```

</details>

### 💡 Think about this

`Home` renders `<ChatMessages />` and `<ChatInput />`, but not `<Message />` directly — `Message`
is only used *inside* `ChatMessages`. So which names does `home.jsx` actually need to import?

### ✅ Reference implementation

**🔗 Commit**: [`f6d5cda`](1/commits/f6d5cdaf70c36cbf610e224458d1082fc827a4b7)

### ⚠️ Common mistakes

- **Mixing up the two import styles**: `import ChatMessages from ...` (no braces) asks for the
  *default* export. If the file only has named exports, you'll get `undefined` and a confusing
  render error.
- **Misspelling a name**: with named imports the spelling must match exactly, including case.

### 💬 Discussion points

1. **Named vs. default**: why named exports here, but a default export for `Sidebar`?
2. **Grouping**: what makes `Message`, `ChatMessages` and `ChatInput` belong in the same file?

---

<a name="step-11"></a>

## Step 11: Use props.children for message content

### 🤔 Problem to solve

Your `Message` component takes its text through a normal prop, which means the message content
has to be a plain string. But message content is *content* — one day you might want a link, or
bold text, or another component inside it. React has a dedicated pattern for exactly this.

### 💡 Key concepts

- **`props.children`**: the special prop holding whatever you put *between* the opening and
  closing tags
- **Composition**: components that wrap other content rather than just receiving values

### 📝 Your task

1. Change `Message` to render `props.children` instead of its content prop
2. Update every usage from a self-closing tag with a content prop to an opening and closing tag
   with the text in between

The change looks like this:

```jsx
<Message type="user">Hello there</Message>
```

### 💡 Think about this

`children` isn't a prop you pass by name — React fills it in automatically from whatever sits
between the tags. Where have you seen this shape before? (Every HTML element you've ever
written works this way.)

### ✅ Reference implementation

**🔗 Commit**: [`5117c45`](1/commits/5117c452d962c182cec882c0960ec9747e7aaeb6)

### ⚠️ Common mistakes

- **Leaving some usages self-closed.** `<Message type="user" />` with no children renders an
  empty bubble — no error, just a blank message. Check all ten.

### 💬 Discussion points

1. **How is `children` different** from a regular prop like `type`?
2. **Flexibility**: name something you could put inside a `Message` now that you couldn't before.
3. **Where else?** Which of your other components would benefit from taking `children`?

### 🧪 Test your solution

- All ten messages still show their text
- Try putting `<strong>bold</strong>` inside one message — it renders as actual bold text, and
  reads naturally in the JSX. Writing the same thing as a string prop would have rendered the
  tags as visible characters.

---

## 🚀 Extra features if you have time

1. **Go smaller**: is there anything left that could reasonably be its own component?
2. **More props**: give `ChatThreadItem` an `isActive` prop that adds a highlight class
3. **Break it on purpose**: remove a prop, misspell an import, lowercase a component name. Learn
   what each mistake looks like in the browser — you'll meet all of them again for real
4. **Read the whole thing**: open all four files and trace the component tree from `Layout` down
   to a single `Message`

## 📚 Additional resources

- [React docs: Your first component](https://react.dev/learn/your-first-component)
- [React docs: Passing props to a component](https://react.dev/learn/passing-props-to-a-component)
- [React docs: Passing JSX as children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
- [React docs: Understanding your UI as a tree](https://react.dev/learn/understanding-your-ui-as-a-tree)
- [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

**🏁 Congratulations:** you've turned two crowded files into a clean component hierarchy. You now
understand:

✅ **Component extraction**: breaking large components into small, focused ones  
✅ **Props**: passing data from parent to child  
✅ **Component hierarchy**: building complex UI from simple pieces  
✅ **File organisation**: default vs. named exports, and when to use each  
✅ **`props.children`**: the composition pattern used by every React library you'll ever touch

One thing to notice before you go: `ChatThreadsList` still writes out fourteen `ChatThreadItem`
elements by hand, and `ChatMessages` still lists ten messages. You've removed the duplicated
*markup*, but the duplication has just moved. That's exactly what the next tutorial fixes 🤘
