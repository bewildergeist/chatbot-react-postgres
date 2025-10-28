# Automatic authentication error handling

## 📋 Table of Contents

1. [Step 1: Add automatic redirect to login on 401 responses](#step-1)
2. [Step 2: Add URL preservation for post-login redirect](#step-2)

## 🗺️ Overview

Your chatbot application has complete authentication and authorization, but there's a user experience problem: when a user's session expires (JWT tokens expire after a period of time), API requests return 401 Unauthorized errors. Currently, these errors are handled by each route individually—some show error messages, some might break the UI.

It would be much better UX to **automatically redirect users to login when their session expires**, and even better to **return them to where they were** after they log in again.

In this tutorial, you'll implement **centralized session expiration handling** in the `apiFetch` wrapper function. When any API request returns 401, you'll automatically redirect to login with the current URL preserved, so users can seamlessly continue their work after re-authenticating.

**Key Learning Outcomes:**

- Handle session expiration gracefully with automatic redirects
- Understand the special nature of 401 Unauthorized responses
- Preserve user context across authentication flows
- Implement URL-based state management with query parameters
- Improve UX by reducing friction during re-authentication

## 🧑‍💻 Today's starting point

If you haven't fully completed the prior tutorials, you may copy the starting point of this tutorial by running this command in the root of your local repository:

```bash
npx degit --force bewildergeist/chatbot-react-postgres#pr-18-start
```

**Important**: Make a commit of this initial version before you start changing anything.

---

<a name="step-1"></a>

## Step 1: Add automatic redirect to login on 401 responses

### 🤔 Problem to solve

When a user's JWT token expires, API requests return **401 Unauthorized**. Currently, the `apiFetch` function just returns this response like any other, and each route has to handle it individually.

This creates problems:

- Some routes might not handle 401 properly, showing confusing errors
- Users have to manually navigate to the login page
- It's unclear to users that their session expired
- Inconsistent behavior across different parts of the app

The 401 response is special—it means "you need to authenticate." The user can't fix this by retrying or changing data; they **must log in again**. So it makes sense to handle it centrally in `apiFetch` rather than in every route.

### 💡 Key concepts

**Why 401 is Different**

- **400 Bad Request**: Route can show validation errors in the form
- **404 Not Found**: Route can show "resource not found" message
- **500 Server Error**: Route can show "something went wrong" error
- **401 Unauthorized**: User MUST log in → automatic redirect makes sense

**React Router's redirect() Function**
When you `throw redirect('/path')` from a loader or action:

- React Router cancels the current navigation
- Redirects to the specified path instead
- No error is shown (it's a navigation, not an error)
- Can be thrown from anywhere, including helper functions

**Session Expiration in Real Applications**

- JWT tokens typically expire after a period (e.g., 1 hour, 24 hours)
- This is a security feature—stolen tokens don't work forever
- Supabase handles token refresh automatically in many cases
- But when refresh fails or token is invalid, you get 401
- Good UX makes this seamless with automatic redirects

**Single Responsibility**
By handling ONLY 401 in `apiFetch`, you maintain separation of concerns:

- `apiFetch` handles session expiration (one thing, well)
- Routes handle their own business logic errors (validation, not found, etc.)
- Simple, focused, easy to understand

### 📝 Your task

Modify the `apiFetch` function in `frontend/app/lib/apiFetch.js`:

1. Import `redirect` from `react-router`
2. After getting the response from `fetch()`, check if `response.status === 401`
3. If it's a 401, `throw redirect('/login')`
4. Otherwise, return the response normally (routes handle other errors)
5. Update the documentation comments to explain this behavior

### 🔍 Implementation hints

**Import redirect:**

```javascript
import { redirect } from "react-router";
```

**After the fetch call:**

```javascript
const response = await fetch(url, { ...options, headers });

// Check for 401 and redirect
if (response.status === 401) {
  throw redirect("/login");
}

// Return response for routes to handle
return response;
```

**Why throw instead of return?**

- `throw` makes React Router handle it immediately
- `redirect()` creates a special Response that triggers navigation
- React Router catches the thrown redirect and navigates

**Important:** Don't check `response.ok` or throw errors for other status codes. Routes need to handle their own 400 validation errors, 404s, etc.

### ✅ Reference implementation

**🔗 Commit**: [`c6e8e9f`](18/commits/c6e8e9f)

After implementing your solution, compare it with the reference commit. Notice:

- The import statement for `redirect`
- The simple 401 check before returning the response
- Updated documentation explaining session handling

### 💬 Discussion points

1. **Why only 401?** Why does `apiFetch` only handle 401 and not other error status codes? What would be the problem with throwing errors for 400 or 404?

2. **Centralized vs Distributed**: This centralizes session expiration handling. What are the pros and cons compared to handling 401 in each route individually?

3. **User Experience**: How does automatic redirect improve UX compared to showing an error message that says "401 Unauthorized"?

### 🧪 Test your solution

**Test session expiration simulation:**

Since JWT tokens typically last hours or days, you need to simulate an expired token:

1. Open DevTools → Application → Local Storage
2. Find the Supabase auth token (starts with `sb-`)
3. Delete it or change a character to invalidate it
4. Try to navigate to a thread or create a message
5. You should be automatically redirected to `/login`

**Expected behavior:**

- Invalid/expired tokens trigger automatic redirect to login
- No error message is shown (just seamless navigation)
- Login page is displayed
- Other errors (400, 404, 500) still work as before in routes

**⚠️ Current limitation**: After logging in, you're sent to the home page, not back to where you were. You'll fix this in the next step!

---

<a name="step-2"></a>

## Step 2: Add URL preservation for post-login redirect

### 🤔 Problem to solve

Your automatic redirect to login works, but there's a UX issue: after logging in, users always land on the home page (`/`), regardless of where they were when their session expired.

Imagine this scenario:

1. User is editing a thread at `/chat/abc-123/edit`
2. Their session expires after an hour
3. They try to save → redirected to login
4. They log in → sent to home page
5. They have to navigate back to `/chat/abc-123/edit` manually

This is frustrating! It would be much better if logging in returned them to exactly where they were.

### 💡 Key concepts

**URL Preservation Pattern**
A common pattern in web applications:

1. Save the current URL before redirecting to login
2. Pass it as a query parameter: `/login?redirect=/chat/abc-123/edit`
3. After successful login, redirect to that URL
4. If no redirect parameter, use a default (home page)

**Query Parameters for State**
The `?redirect=/chat/abc-123/edit` pattern:

- Stores the intended destination in the URL itself
- Survives page refreshes (URL is still there)
- Simple to implement (no localStorage or complex state)
- Visible to users (they can see where they'll go after login)

**window.location in JavaScript**

- `window.location.pathname`: The path (e.g., `/chat/abc-123/edit`)
- `window.location.search`: Query parameters (e.g., `?tab=settings`)
- Combining them preserves the complete URL state

**URL Encoding**

- URLs can't contain certain characters without encoding
- `/chat/abc-123?editing=true` needs encoding in a query parameter
- `encodeURIComponent()` makes URLs safe to pass as parameter values
- React Router automatically decodes when you read searchParams

**Conditional Messaging**
Show different messages based on context:

- Just registered → "Account created! Please log in."
- Session expired → "Your session has expired. Please log in again."
- Direct login → No special message

### 📝 Your task

You'll modify two files:

**File 1: `frontend/app/lib/apiFetch.js`**

1. When redirecting on 401, capture the current URL
2. Combine `window.location.pathname` and `window.location.search`
3. Encode it with `encodeURIComponent()`
4. Include it as a query parameter: `/login?redirect=...`

**File 2: `frontend/app/routes/login.jsx`**

1. In `clientAction`, extract the `redirect` parameter from the request URL
2. After successful login, redirect to that URL instead of always `/`
3. If no redirect parameter exists, default to `/`
4. In the component, detect if there's a redirect parameter
5. Show a message: "Your session has expired. Please log in again."

### 🔍 Implementation hints

**In apiFetch.js:**

```javascript
if (response.status === 401) {
  const currentPath = window.location.pathname + window.location.search;
  throw redirect(`/login?redirect=${encodeURIComponent(currentPath)}`);
}
```

**In login.jsx clientAction:**

```javascript
// Extract redirect parameter from URL
const url = new URL(request.url);
const redirectTo = url.searchParams.get("redirect") || "/";

// After successful login
return redirect(redirectTo);
```

**In login.jsx component:**

```javascript
const [searchParams] = useSearchParams();
const wasRedirected = searchParams.has("redirect");

// In JSX
{
  wasRedirected && (
    <div className="info-message">
      Your session has expired. Please log in again.
    </div>
  );
}
```

### ✅ Reference implementation

**🔗 Commit**: [`46f9211`](18/commits/46f9211)

Study the reference implementation carefully:

- How the current URL is captured and encoded in `apiFetch`
- The updated redirect call with the query parameter
- How the login action extracts and uses the redirect parameter
- The conditional message shown when user was redirected
- The fallback to `/` when no redirect parameter exists

### 💬 Discussion points

1. **Why encode?** What could go wrong if you didn't use `encodeURIComponent()`? Try to think of a URL that would break without encoding.

2. **Security consideration**: Should you validate the redirect URL before using it? What if someone crafted a malicious URL like `/login?redirect=https://evil-site.com`? How could you prevent redirecting to external sites?

3. **Alternative approaches**: Instead of using a query parameter, you could save the URL in `sessionStorage` or `localStorage`. What are the trade-offs?

### 🧪 Test your solution

**Test the complete flow:**

1. **Navigate to a specific thread** (e.g., `/chat/abc-123`)
2. **Simulate session expiration:**
   - Open DevTools → Application → Local Storage
   - Delete or invalidate (by editing) your Supabase auth token
3. **Try to interact** (add a message, edit title, etc.)
4. **Verify redirect:**
   - You should be redirected to `/login?redirect=%2Fchat%2Fabc-123`
   - You should see "Your session has expired. Please log in again."
5. **Log in with valid credentials**
6. **Verify return:**
   - You should be automatically redirected back to `/chat/abc-123`
   - Not to the home page!

**Test the default behavior:**

1. Navigate directly to `/login` (no redirect parameter)
2. Log in
3. You should be sent to `/` (home page)

**Test with query parameters:**

1. Navigate to a URL with query params (our app doesn't have any, so add one manually to the URL, e.g., `/chat/abc-123?editing=true`)
2. Simulate expiration and test
3. Verify query params are preserved in the redirect

**Expected behavior:**

- Redirect preserves the full URL (path + query params)
- Redirect from home page works (redirect to `/`)
- Direct login (no redirect param) still works normally
- Session expired message only shows when redirected
- After login, users return to exactly where they were

---

## 🎉 Congratulations!

You've successfully implemented **automatic session expiration handling** with intelligent URL preservation! This is a professional-grade feature that significantly improves user experience.

### What you've accomplished

**User Experience Improvements:**

- ✅ Automatic redirect to login when sessions expire
- ✅ Preservation of user context across authentication flows
- ✅ Clear messaging explaining why users were redirected
- ✅ Seamless return to intended destination after login

**Code Quality:**

- ✅ Single Responsibility—`apiFetch` handles session expiration, nothing more
- ✅ Routes maintain control of their own error handling
- ✅ Simple, focused implementation (just a few lines of code)
- ✅ Leveraging React Router's redirect mechanism effectively

### The complete flow

**Before this PR:**

1. Session expires → API returns 401
2. Route shows error or breaks
3. User confused, has to manually navigate to login
4. After login, starts over from home page
5. Has to find their way back to what they were doing

**After this PR:**

1. Session expires → API returns 401
2. Automatic redirect to login with URL preserved
3. Clear message: "Your session has expired. Please log in again."
4. User logs in
5. Automatically returns to exactly where they were
6. Seamless continuation of work!

## 🚀 Extra challenges (if you have time)

Want to explore further? Try these extensions:

### Challenge 1: Redirect validation

Add security checks to the redirect parameter:

- Ensure it starts with `/` (internal URLs only)
- Prevent redirects to external sites
- Whitelist allowed paths
- Return a sanitized redirect or fallback to home

## 📚 Additional resources

**URL Parameters:**

- [encodeURIComponent() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- [URLSearchParams - MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

**React Router:**

- [redirect() Function](https://reactrouter.com/api/utils/redirect#redirect)
- [useSearchParams Hook](https://reactrouter.com/api/hooks/useSearchParams)

**UX Patterns:**

- [Error Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/) from Nielsen Norman Group

**Security:**

- [Open Redirect Vulnerabilities](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
