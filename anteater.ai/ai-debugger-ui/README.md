# Fixflow — AI Software Debugger UI

A small React + Vite frontend and Node/Express API for the AI Debugger & Documenter project.

## What is included

- Issue description, language selector, and code editor-style input
- Results area with tabs for fixed code, explanation/reasoning, and generated docs
- Analyst findings and lint status
- Express endpoint that forwards requests to your existing agent service
- `maxIterations: 3` sent to the agent service to reflect the project's refinement-loop limit

## Requirements

- Node.js 18+ (uses the built-in `fetch`)
- npm
- Your existing agents exposed through an HTTP service

## Run locally

1. Extract the project and open a terminal in this directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set `AGENT_SERVICE_URL` to the base URL of your agent service.
4. Start the frontend and backend:

   ```bash
   npm run dev
   ```

5. Open http://localhost:5173.

The React dev server proxies `/api` requests to Express on port 3001.

## Connect your existing agents

The UI calls `POST /api/debug` on the Express server. The adapter in `server/agentAdapter.js` forwards the request to:

`POST {AGENT_SERVICE_URL}/debug`

Request JSON:

```json
{
  "issue": "Describe the bug",
  "code": "function example() {}",
  "language": "JavaScript",
  "maxIterations": 3
}
```

The agent service should run your existing workflow in this order:

1. Analyst agent: identify bugs/code smells and return findings.
2. Fixer LoopAgent: refine the code and re-run the linter, with a maximum of 3 iterations.
3. Documenter agent: generate Markdown documentation.

Expected response JSON:

```json
{
  "fixedCode": "function example() { /* corrected code */ }",
  "explanation": "What was wrong and why this change fixes it.",
  "documentation": "## example\\n\\nDescription and usage...",
  "lintPassed": true,
  "iterations": 2,
  "issues": [
    {
      "severity": "error",
      "message": "Description of a detected bug",
      "line": 3
    }
  ]
}
```

`fixed_code`, `analysis`, `docs`, `lint_passed`, `attempts`, and `bugs` are also accepted as alternate response field names by the adapter.

If your ADK agents are written in Python, they can remain in Python. Expose the workflow through a small Python HTTP endpoint (for example, FastAPI) and point `AGENT_SERVICE_URL` at it. You do not need to rewrite the agents in JavaScript.

## Important implementation note

The PDF describes the agent sequence and outputs, but it does not specify an HTTP interface or exact JSON schema. This project therefore uses a proposed integration contract. Adjust `server/agentAdapter.js` to match the interface your agent implementation already exposes.

This is a UI/integration scaffold, not a secure production code-execution environment. Do not execute arbitrary submitted code directly on the Express server. Keep linting and any code execution inside your isolated sandbox/container, with appropriate timeouts and resource limits.
