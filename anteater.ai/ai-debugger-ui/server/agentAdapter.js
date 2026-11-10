/**
 * Adapter between Express and your already-built agent workflow.
 *
 * Expected agent-service contract:
 *   POST {AGENT_SERVICE_URL}/debug
 *   Body: { issue, code, language, maxIterations: 3 }
 *
 * The service should orchestrate Analyst -> Fixer LoopAgent -> Documenter
 * and return the response shape documented in README.md.
 *
 * If your agents are exposed through a different API, change this file only.
 */
export async function runDebuggerAgents({ issue, code, language }) {
  const baseUrl = process.env.AGENT_SERVICE_URL;

  if (!baseUrl) {
    throw new Error("AGENT_SERVICE_URL is not configured. Copy .env.example to .env and set your agent service URL.");
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/debug`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issue, code, language, maxIterations: 3 })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Agent service returned ${response.status}: ${details || response.statusText}`);
  }

  const result = await response.json();

  // Keep the frontend contract predictable, even if optional agent fields are absent.
  return {
    fixedCode: result.fixedCode ?? result.fixed_code ?? "",
    explanation: result.explanation ?? result.analysis ?? "",
    documentation: result.documentation ?? result.docs ?? "",
    lintPassed: Boolean(result.lintPassed ?? result.lint_passed),
    iterations: result.iterations ?? result.attempts ?? null,
    issues: result.issues ?? result.bugs ?? []
  };
}