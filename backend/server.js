// ========== Import dependencies ========== //
import express from "express";
import cors from "cors";
import sql from "./db.js";

// ========== Setup Express App ========== //
const app = express();
const PORT = process.env.PORT || 3000;

// ========== Middleware ========== //
// Middleware functions run in order for each request

// Enable CORS (Cross-Origin Resource Sharing)
// This allows our frontend (running on http://localhost:5173) to make requests
// to this API (running on http://localhost:3000)
// Without CORS, browsers block requests between different origins for security
app.use(cors());

// ========== Define API Endpoints ========== //

// Root endpoint - verify server is running
app.get("/", (req, res) => {
  res.json({
    message: "Chatbot API Server 🤖",
    version: "1.0.0",
  });
});

/**
 * GET /api/threads
 *
 * Fetches all chat threads from the database, ordered by creation date (newest first).
 *
 * SQL Concepts:
 * - SELECT: Retrieve data from the database
 * - Specific columns: Only fetch the columns we need (id, title, created_at)
 * - ORDER BY: Sort the results
 * - DESC: Descending order (newest first)
 *
 * API Concepts:
 * - async/await: Handle asynchronous database queries
 * - try/catch: Handle errors gracefully
 * - Status codes: 200 for success, 500 for server errors
 * - JSON response: Return data in a format the frontend can use
 */
app.get("/api/threads", async (req, res) => {
  try {
    // Execute SQL query using the sql`` tagged template
    const threads = await sql`
      SELECT id, title, created_at 
      FROM threads 
      ORDER BY created_at DESC
    `;

    // Return the threads as JSON
    // Express automatically sets Content-Type: application/json
    res.json(threads);
  } catch (error) {
    // Log the error for debugging (you should see this in the terminal)
    console.error("Error fetching threads:", error);

    // Return a generic error message to the client
    // Don't expose internal error details for security
    res.status(500).json({
      error: "Failed to fetch threads from database",
    });
  }
});

/**
 * GET /api/threads/:id
 *
 * Fetches a single thread by its ID.
 *
 * SQL Concepts:
 * - WHERE clause: Filter results to match a specific condition
 * - Parameterized queries: Safely include user input in SQL queries
 * - Primary key lookup: Fast retrieval using the id column
 *
 * API Concepts:
 * - Route parameters: Dynamic URL segments (the :id part)
 * - 404 Not Found: Return when requested resource doesn't exist
 * - req.params: Access route parameters from the URL
 *
 * Security:
 * - Tagged template (sql``) prevents SQL injection
 * - Even with user input, the query is safe from malicious SQL
 */
app.get("/api/threads/:id", async (req, res) => {
  try {
    // Extract the thread ID from the URL
    // For /api/threads/123, req.params.id will be "123"
    const threadId = req.params.id;

    // Execute SQL query with WHERE clause
    // The ${threadId} is safely parameterized by the postgres library
    const threads = await sql`
      SELECT id, title, created_at 
      FROM threads 
      WHERE id = ${threadId}
    `;

    // Check if thread was found
    // SQL returns an empty array if no matches
    if (threads.length === 0) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    // Return the first (and only) thread
    res.json(threads[0]);
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({
      error: "Failed to fetch thread from database",
    });
  }
});

// ========== Start the server ========== //
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
