def analyze_issues(state):
    print("Starting analysis process.")

    linter_result = state["linter_result"]

    if linter_result is None:
        print("No linter result available.")
        state["analysis_results"] = []
        state["status"] = "ANALYSIS_FAILED"
        return state

    issues = linter_result["issues"]

    analysis_results = []

    for issue in issues:
        analysis = {
            "line": issue["line"],
            "type": issue["type"],
            "message": issue["message"]
        }

        analysis_results.append(analysis)

    state["analysis_results"] = analysis_results

    if len(analysis_results) == 0:
        state["status"] = "ANALYSIS_CLEAN"
    else:
        state["status"] = "ANALYSIS_COMPLETE"

    print("Analysis process completed.")
    print("Issues analyzed:", len(analysis_results))

    return state