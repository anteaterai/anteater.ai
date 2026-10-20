from state import create_state, update_linter_result
from linter import run_linter
from analyst import analyze_issues


state = create_state("test_buggy.py")

linter_result = run_linter(state["file_name"])

state = update_linter_result(state, linter_result)

print("Before analysis")
print("System state:", state["status"])
print("Linter issues:", state["linter_result"]["issue_count"])
print()

state = analyze_issues(state)

print()
print("After analysis")
print("System state:", state["status"])
print("Analysis count:", len(state["analysis_results"]))
print()

for issue in state["analysis_results"]:
    print("Line:", issue["line"])
    print("Type:", issue["type"])
    print("Message:", issue["message"])
    print()