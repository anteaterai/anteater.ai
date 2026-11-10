import { useState } from "react";
import {
  Bug, Braces, Check, CheckCircle2, ChevronDown, CircleAlert,
  Code2, Copy, FileText, LoaderCircle, Play, RotateCcw, Sparkles,
  Terminal, WandSparkles
} from "lucide-react";

const starterCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const starterIssue = "This function throws an error when calculating the total. Can you find and fix the bug?";

const demoResult = {
  fixedCode: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
  explanation: "The loop condition used i <= items.length. Arrays are zero-indexed, so the final valid index is items.length - 1. The extra iteration accessed items[items.length], which is undefined, and caused an error when reading .price.",
  documentation: "### calculateTotal(items)\\n\\nCalculates the combined price of all items in an array.\\n\\n**Parameters**\\n- `items` — An array of objects containing a numeric `price` property.\\n\\n**Returns**\\n- The sum of all item prices.",
  lintPassed: true,
  iterations: 1,
  issues: [{ severity: "error", message: "Loop boundary allows an out-of-range array access.", line: 3 }]
};

export default function App() {
  const [language, setLanguage] = useState("JavaScript");
  const [issue, setIssue] = useState(starterIssue);
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("fixed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleDebug() {
    if (!issue.trim() || !code.trim()) {
      setError("Add both an issue description and a code snippet to continue.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setActiveTab("fixed");
    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue, code, language })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError(err.message || "Unable to reach the debugger API.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!result?.fixedCode) return;
    await navigator.clipboard.writeText(result.fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const output = result && (
    activeTab === "fixed" ? result.fixedCode :
    activeTab === "explanation" ? result.explanation :
    result.documentation
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-icon"><Bug size={19}/></span> ANTEATER <span className="brand-dot">.AI</span></a>
        <div className="topbar-right"><span className="status-dot"/> AI WORKFLOW <span className="topbar-divider"/> <span className="version">PROJECT DEMO</span></div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="eyebrow"><Sparkles size={14}/> YOUR AI-POWERED DEBUGGING ASSISTANT</div>
          <h1>Less debugging.<br/><span>More building.</span></h1>
          <p>Describe the problem, share your code, and let your AI agents find<br className="desktop-break"/> the bug, refine the fix, and document the solution.</p>
        </section>

        <div className="workspace">
          <section className="panel input-panel">
            <div className="panel-heading">
              <div><span className="step">01</span><div><h2>Describe your issue</h2><p>Give the agents some context to work with.</p></div></div>
              <span className="panel-icon"><Bug size={18}/></span>
            </div>

            <label className="field-label" htmlFor="issue">WHAT'S GOING WRONG?</label>
            <textarea id="issue" className="issue-input" value={issue} onChange={e => setIssue(e.target.value)} placeholder="e.g. My function returns undefined when..." rows={3}/>

            <div className="code-heading">
              <label className="field-label" htmlFor="code">YOUR CODE</label>
              <div className="language-select"><Code2 size={14}/><select value={language} onChange={e => setLanguage(e.target.value)} aria-label="Programming language"><option>JavaScript</option><option>TypeScript</option><option>Python</option><option>Java</option><option>C#</option><option>C++</option></select><ChevronDown size={13}/></div>
            </div>
            <div className="editor">
              <div className="editor-bar"><div className="window-dots"><i/><i/><i/></div><span>main.{language === "Python" ? "py" : language === "Java" ? "java" : language === "C#" ? "cs" : language === "TypeScript" ? "ts" : language === "C++" ? "cpp" : "js"}</span><Braces size={14}/></div>
              <textarea id="code" spellCheck="false" value={code} onChange={e => setCode(e.target.value)} aria-label="Code input" />
            </div>

            {error && <div className="error-message"><CircleAlert size={15}/>{error}</div>}
            <button className="debug-button" onClick={handleDebug} disabled={loading}>
              {loading ? <><LoaderCircle className="spin" size={17}/> Running agents...</> : <><WandSparkles size={17}/> Debug my code <span>→</span></>}
            </button>
            <div className="privacy-note"><Terminal size={13}/> Your code is sent to your configured agent service for analysis.</div>
          </section>

          <section className="panel output-panel">
            <div className="panel-heading">
              <div><span className="step">02</span><div><h2>Debugging results</h2><p>Your cleaned-up implementation and report.</p></div></div>
              <span className="panel-icon output-icon"><Sparkles size={18}/></span>
            </div>

            {!result && !loading && (
              <div className="empty-state">
                <div className="empty-illustration"><Code2 size={34}/><span><Sparkles size={15}/></span></div>
                <h3>Ready when you are</h3>
                <p>Your results will show up here once the agents finish their work.</p>
                <div className="workflow-mini">
                  <div><span className="mini-icon purple"><Bug size={15}/></span><span><b>Analyst</b><small>Finds potential bugs</small></span><span className="mini-number">01</span></div>
                  <div><span className="mini-icon orange"><WandSparkles size={15}/></span><span><b>Fixer</b><small>Refines and validates code</small></span><span className="mini-number">02</span></div>
                  <div><span className="mini-icon green"><FileText size={15}/></span><span><b>Documenter</b><small>Writes helpful documentation</small></span><span className="mini-number">03</span></div>
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-state"><div className="loader-orbit"><LoaderCircle size={30}/></div><h3>Agents are on the case</h3><p>Analyzing, refining, and validating your code...</p><div className="loading-steps"><span className="active"><i/> Analyst</span><span><i/> Fixer loop</span><span><i/> Documenter</span></div></div>
            )}

            {result && !loading && (
              <div className="results">
                <div className={`result-status ${result.lintPassed ? "success" : "warning"}`}>
                  {result.lintPassed ? <CheckCircle2 size={16}/> : <CircleAlert size={16}/>}
                  <span>{result.lintPassed ? "Lint checks passed" : "Lint checks need attention"}</span>
                  {result.iterations != null && <small>{result.iterations} {result.iterations === 1 ? "attempt" : "attempts"}</small>}
                </div>
                <div className="result-tabs">
                  <button className={activeTab === "fixed" ? "selected" : ""} onClick={() => setActiveTab("fixed")}><Code2 size={14}/> Fixed code</button>
                  <button className={activeTab === "explanation" ? "selected" : ""} onClick={() => setActiveTab("explanation")}><Bug size={14}/> Explanation</button>
                  <button className={activeTab === "docs" ? "selected" : ""} onClick={() => setActiveTab("docs")}><FileText size={14}/> Docs</button>
                </div>
                <div className="result-toolbar"><span>{activeTab === "fixed" ? "FIXED IMPLEMENTATION" : activeTab === "explanation" ? "ANALYSIS & REASONING" : "GENERATED DOCUMENTATION"}</span>{activeTab === "fixed" && <button onClick={copyCode}><Copy size={13}/>{copied ? "Copied!" : "Copy code"}</button>}</div>
                <pre className={`result-content ${activeTab !== "fixed" ? "prose-output" : ""}`}><code>{output || "No output was returned for this section."}</code></pre>
                {result.issues?.length > 0 && <div className="issues"><h4><CircleAlert size={14}/> Findings from the Analyst</h4>{result.issues.map((item, i) => <div className="issue-row" key={i}><span className="issue-severity">{item.severity || "INFO"}</span><span>{item.message || String(item)}</span>{item.line && <small>Line {item.line}</small>}</div>)}</div>}
                <button className="reset-button" onClick={() => {setResult(null);setError("");}}><RotateCcw size={14}/> Start a new debugging session</button>
              </div>
            )}
          </section>
        </div>
        <footer><span>ANTEATER.AI <b>·</b> AI SOFTWARE DEBUGGER</span><span>Analyst <i/> Fixer <i/> Documenter</span></footer>
      </main>
    </div>
  );
}