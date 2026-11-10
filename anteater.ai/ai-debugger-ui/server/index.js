import "dotenv/config";
import express from "express";
import cors from "cors";
import { runDebuggerAgents } from "./agentAdapter.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.post("/api/debug", async (req, res) => {
  const { issue, code, language } = req.body ?? {};

  if (!issue?.trim() || !code?.trim() || !language?.trim()) {
    return res.status(400).json({
      error: "Please provide an issue description, code snippet, and language."
    });
  }

  try {
    const result = await runDebuggerAgents({ issue, code, language });
    return res.json(result);
  } catch (error) {
    console.error("Agent workflow failed:", error);
    return res.status(502).json({
      error: error.message || "The debugging workflow could not be completed."
    });
  }
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API server listening on http://localhost:${port}`));