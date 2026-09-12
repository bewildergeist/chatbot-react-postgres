# Rendering lists, passing props and prop drilling - step-by-step tutorial

## 🎯 Learning objectives

By the end of this tutorial, you will be able to:

- **Render a list from data** using `Array.map()` instead of writing out each item by hand
- **Use the `key` prop** correctly, and explain why React insists on it
- **Decide where data should live** in a component tree
- **Lift data up** to a parent so that children can receive it as props
- **Recognise prop drilling** — passing data through a component that doesn't use it itself

## 📋 Prerequisites

- **[PR #1](../pull/1) completed**: components extracted into `Sidebar.jsx` and `Chat.jsx`, and
  a working `ChatThreadItem` that takes `href` and `title` props
- **JavaScript array methods**: particularly `.map()` — if that's shaky, read
  [MDN on `Array.prototype.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
  first, because it's the core of this whole tutorial
- **Arrow functions** and **object literals**

## 📑 Table of contents

1. [Render messages from an array](#step-1)
2. [Move the messages array up to Home](#step-2)
3. [Render threads from an array](#step-3)
4. [Move the threads array up to Layout](#step-4)

## 🗺️ Overview

At the end of the last tutorial you removed a lot of duplicated *markup* — but the duplication
didn't really go away, it just changed shape. `ChatMessages` still writes out ten `<Message>`
elements by hand, and `ChatThreadsList` still writes out fourteen `<ChatThreadItem>` elements.

In this tutorial you'll separate **data** from **presentation**. The data becomes a plain
JavaScript array; the component's job becomes turning that array into UI. Then you'll move each
array *up* the component tree to where it really belongs.

You'll do the same two-step move twice — once for messages, once for threads — because seeing a
pattern twice is what turns it into something you can reuse.

## 🧑‍💻 Today's starting point

If you haven't fully completed the prior tutorial, you may copy the starting point of this
tutorial by running this command in the root of your local repository:

```bash
npx degit --force bewildergeist/chatbot-react-postgres#pr-2-start
```

**Important**: make a commit of this initial version before you start changing anything.

### Getting the app running

Everything happens inside the `frontend/` folder:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Leave the dev server running while you work — it reloads the page
automatically every time you save.

> ⚠️ **About the security warnings.** `npm install` reports around 23 vulnerabilities. These are
> in build tools that run on your own machine, not in anything a visitor to your app could reach.
> Run `npm audit fix` to get down to 8, then **leave the rest alone** — including the ones marked
> critical. **Never run `npm audit fix --force`**: it upgrades React Router and Vite to new major
> versions, and the code in this tutorial and every following one will stop matching what you
> see. (There's a fuller explanation in [PR #1](../pull/1).)

---

<a name="step-1"></a>

## Step 1: Render messages from an array

### 🤔 Problem to solve

Open `app/components/Chat.jsx` and look at `ChatMessages`. It contains ten `<Message>` elements
written out by hand. That means:

- Adding a message means writing more JSX
- The conversation content is tangled up with the layout code
- There's no way this could ever come from a database

Real applications don't hardcode their content — they receive data and render it.

### 💡 Key concepts

- **Separating data from presentation**: content as data, rendering as code
- **`Array.map()`**: transforms an array of values into an array of elements
- **The `key` prop**: how React identifies individual items in a list
- **Data-driven UI**: the markup is a function of the data

### 📝 Your task

1. Inside `ChatMessages`, declare an array called `messages`
2. Give each message an object with three properties: `id`, `type` (`"user"` or `"bot"`), and
   `content` (the text)
3. Transfer all ten messages from the JSX into that array
4. Replace the ten `<Message>` elements with a single `messages.map(...)` call that renders one
   `<Message>` per item
5. Give each rendered `<Message>` a `key` prop set to the message's `id`

### 🔍 Implementation hints

<details>
<summary>💡 Hint: The shape of the data</summary>

An array of objects, one per message:

```js
const messages = [{ id: 1, type: "user", content: "Hello!" }];
```

</details>

<details>
<summary>💡 Hint: Mapping inside JSX</summary>

Curly braces let you drop a JavaScript expression into JSX. `.map()` returns an array of
elements, and React renders arrays by rendering each element in turn:

```jsx
{messages.map((message) => (
  <Message key={message.id} type={message.type}>{message.content}</Message>
))}
```

Note that the message text goes *between* the tags — that's `props.children`, from step 11 of the
last tutorial.

</details>

<details>
<summary>💡 Hint: Arrow function bodies</summary>

`(message) => ( ... )` with parentheses returns the JSX. If you use curly braces instead —
`(message) => { ... }` — you've written a function *body* and must `return` explicitly.
Forgetting that is the single most common cause of "nothing renders".

</details>

### 💡 Think about this

Before you write any code, try to answer these:

- Why does React need a `key` at all? What would it have to do without one when the list changes?
- Could you use the array index as the key? When would that be a bad idea?

### ✅ Reference implementation

**🔗 Commit**: [`99a4a48`](2/commits/99a4a48d7e5f8a9c8da7efc0bb4091f8f08e3e0c)

### ⚠️ Common mistakes

- **Forgetting `key`.** The app still works, but React logs
  *"Warning: Each child in a list should have a unique key prop"*. Keep your console open — a
  warning you've learned to ignore is a bug you'll miss later.
- **Putting `key` on the wrong element.** It belongs on the outermost element returned by the
  `.map()` callback, not on something nested inside it.
- **Using curly braces in the arrow function without `return`.** The map produces an array of
  `undefined` and you get a blank conversation with no error at all.

### 💬 Discussion points

1. **Why an `id` field?** You could have used the array position. What does an explicit `id` buy
   you once messages can be added and deleted?
2. **Performance**: how does `key` help React update the DOM efficiently?
3. **Maintainability**: how much work is it to add an eleventh message now?

### 🧪 Test your solution

- All ten messages render, in the right order, with user and bot styling intact
- No warnings in the browser console
- Temporarily delete the `key` prop and reload — read the exact warning React gives you
- Add a new message to the array. Did you have to touch any JSX?

---

<a name="step-2"></a>

## Step 2: Move the messages array up to Home

### 🤔 Problem to solve

The conversation is data now, but it's *trapped* inside `ChatMessages`. That component can only
ever display those ten messages. It can't be reused for a different conversation, and `Home` —
the component that owns the page — has no control over what's displayed.

Eventually these messages will come from a database. When that happens, the fetching will not
live inside a component whose job is to render bubbles.

### 💡 Key concepts

- **Lifting data up**: moving data to a parent component
- **Props for data**: a parent supplies the data, the child renders it
- **Reusability**: a component that accepts data works with *any* data
- **Separation of concerns**: who owns the data vs. who displays it

### 📝 Your task

1. Move the `messages` array out of `ChatMessages` and into `app/routes/home.jsx`, at module
   scope (top level of the file, outside the `Home` function)
2. Change `ChatMessages` to accept `props` and render `props.messages` instead of its own array
3. In `Home`, pass the array down: `<ChatMessages messages={messages} />`

### 🔍 Implementation hints

<details>
<summary>💡 Hint: Module scope</summary>

"Module scope" just means the top level of the file — a `const` declared there, outside any
function, visible to everything in the file:

```jsx
import { ChatMessages, ChatInput } from "../components/Chat.jsx";

const messages = [ /* ... */ ];

export default function Home() { /* ... */ }
```

</details>

<details>
<summary>💡 Hint: Receiving the data</summary>

Same props mechanism as `ChatThreadItem` in the last tutorial — the component takes a `props`
parameter and reads `props.messages`.

</details>

### 💡 Think about this

Where *should* data live in a React app? There's a general rule here that you'll use constantly:
data belongs in the closest component that needs to know about it. Right now only `ChatMessages`
uses the messages — so why move them up at all?

(Hint: think about what will need to happen when the user can *send* a message.)

### ✅ Reference implementation

**🔗 Commit**: [`2e28c3c`](2/commits/2e28c3c10d83973814c3333811500583a19ea297)

### ⚠️ Common mistakes

- **Declaring the array inside `Home` instead of at module scope.** It works, but the reference
  puts it at module scope — the array is fixed data, not something `Home` computes.
- **Passing without receiving** (or the reverse). `<ChatMessages messages={messages} />` plus a
  component that still reads a local variable will keep working until you delete the local one,
  then break confusingly.

### 💬 Discussion points

1. **Data ownership**: why is it better for the parent to own the data?
2. **Reusability**: could you now render a *second* `ChatMessages` with completely different
   messages on the same page?
3. **Data flow**: describe the path the data takes, from where it's defined to where it's shown.

### 🧪 Test your solution

- The conversation renders exactly as before
- Temporarily change `<ChatMessages messages={messages} />` to `<ChatMessages />`. What happens,
  and what does the error message actually tell you?
- Try passing a shortened array of two messages. Does the component cope without any changes?

---

<a name="step-3"></a>

## Step 3: Render threads from an array

### 🤔 Problem to solve

The sidebar has exactly the problem you just solved in the chat area: `ChatThreadsList` writes
out fourteen `<ChatThreadItem>` elements by hand.

You've already seen this movie. This step is deliberately a repeat — the goal is to recognise the
pattern and apply it without needing the hints.

### 💡 Key concepts

- **Pattern recognition**: spotting that a solution you know already fits
- **Consistency**: solving similar problems the same way across a codebase

### 📝 Your task

Apply exactly the same transformation as step 1, in
`app/components/Sidebar.jsx`:

1. Declare a `threads` array inside `ChatThreadsList`
2. Give each thread an `id`, an `href` and a `title`
3. Replace the fourteen hardcoded items with a `threads.map(...)` call
4. Set `key` from the thread's `id`

### 💡 Think about this

Before you look at anything: can you write this step from memory, based on step 1? If yes, you've
genuinely learned the pattern rather than copied it.

### ✅ Reference implementation

**🔗 Commit**: [`8532f6b`](2/commits/8532f6b8e85a018218dcd845102e66c44d2c184c)

### 💬 Discussion points

1. **Pattern consistency**: how does this mirror what you did with messages?
2. **Data shape**: threads have `href` and `title`; messages have `type` and `content`. What
   determines which properties a piece of data needs?

### 🧪 Test your solution

- All fourteen threads appear, with the correct titles, and the links still work
- No `key` warnings in the console
- Give two threads the same `id` and reload. What does React say?

---

<a name="step-4"></a>

## Step 4: Move the threads array up to Layout

### 🤔 Problem to solve

Same move as step 2 — get the data out of the component that renders it. But this one is harder,
and that's the point.

The threads list is navigation data: it belongs to the whole application, not just to the
sidebar. Its natural home is `layout.jsx`. But `Layout` doesn't render `ChatThreadsList`
directly — it renders `Sidebar`, which renders `ChatThreadsList`. The data has to travel through
**two** components to reach the one that needs it.

That's called **prop drilling**, and `Sidebar` becomes a component that accepts a prop purely to
hand it onwards.

### 💡 Key concepts

- **Prop drilling**: passing data down through intermediate components
- **Intermediate components**: components that receive a prop they don't use themselves
- **Data architecture**: choosing the right level for a piece of data

### 📝 Your task

1. Move the `threads` array from `ChatThreadsList` to module scope in `app/routes/layout.jsx`
2. In `Layout`, pass it to the sidebar: `<Sidebar threads={threads} />`
3. Change `Sidebar` to accept `props` and pass the data onwards:
   `<ChatThreadsList threads={props.threads} />`
4. Change `ChatThreadsList` to map over `props.threads` instead of its own array

The data flow you're building: **`Layout` → `Sidebar` → `ChatThreadsList`**

### 🔍 Implementation hints

<details>
<summary>💡 Hint: The middle component</summary>

`Sidebar` never reads the threads — it only forwards them:

```jsx
export default function Sidebar(props) {
  return <ChatThreadsList threads={props.threads} />;
}
```

Receiving a prop and immediately passing it on is what "drilling" means.

</details>

<details>
<summary>💡 Hint: Work from one end</summary>

Change one component at a time and check the browser after each. If you change all three at once
and it breaks, you won't know which link in the chain is wrong.

</details>

### 💡 Think about this

- Why does navigation data belong at the layout level rather than inside `Sidebar`?
- `Sidebar` now has a prop it never uses. Does that bother you? Should it?
- If the chain were six components deep instead of three, would this still feel reasonable?

### ✅ Reference implementation

**🔗 Commit**: [`b745827`](2/commits/b745827bcf85c156febd80d2259e38b1439da1dc)

### ⚠️ Common mistakes

- **Breaking the chain in the middle.** If `Sidebar` forgets to pass `threads` on,
  `ChatThreadsList` receives `undefined` and `props.threads.map(...)` throws
  *"Cannot read properties of undefined (reading 'map')"*. Learn to recognise that message — it
  almost always means a prop didn't arrive.
- **Renaming the prop along the way.** Passing `threadList={threads}` from `Sidebar` while
  `ChatThreadsList` reads `props.threads` fails silently until the `.map()` throws.

### 💬 Discussion points

1. **When is prop drilling fine, and when does it become a problem?**
2. **Data placement**: why `Layout` rather than `Sidebar`?
3. **Alternatives**: if drilling through six layers is bad, what could you use instead? (Search
   for React's Context API — you don't need it yet, but it's worth knowing the name.)

### 🧪 Test your solution

- All fourteen threads still render in the sidebar
- Trace the complete path of one thread's title, from `layout.jsx` to the screen, naming every
  component it passes through
- Delete a thread from the array in `layout.jsx`. Does it disappear from the sidebar?
- Temporarily remove `threads={props.threads}` from `Sidebar` and read the error carefully

---

## 🚀 Extra challenges if you have time

1. **Timestamps**: add a `timestamp` to each message object and display it in the bubble
2. **Filter by type**: render only the user's messages, using `.filter()` before `.map()`
3. **Empty states**: what does the sidebar look like with an empty `threads` array? Should it say
   something helpful?
4. **Count them**: show the number of threads in the sidebar header — where does that number come
   from, and which component should calculate it?

## 💭 Reflection questions

1. **Pattern recognition**: where else in a web app would you map an array into UI?
2. **Data architecture**: how do you decide which component data should live in?
3. **Component design**: what makes a component genuinely reusable?

## 📚 Additional resources

- [React docs: Rendering lists](https://react.dev/learn/rendering-lists)
- [React docs: Keeping components pure](https://react.dev/learn/keeping-components-pure)
- [React docs: Passing props to a component](https://react.dev/learn/passing-props-to-a-component)
- [MDN: `Array.prototype.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

---

**🏁 Congratulations!** Your components are now driven by data rather than hardcoded markup. You
now understand:

✅ **List rendering** with `.map()` and why `key` matters  
✅ **Lifting data up** to the component that should own it  
✅ **Prop drilling** and its trade-offs  
✅ **Separating data from presentation**  

Everything on screen is still fixed, though — the arrays never change. In the next tutorial you'll
make the app *react* to the user: clicking, typing, and data that changes over time 🤘
