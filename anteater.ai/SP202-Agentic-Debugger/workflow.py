from state import (
    create_state,
    update_linter_result,
    increase_iteration,
    can_continue,
    save_working_code
)

from linter import run_linter
from analyst import analyze_issues
from fixer import refine_code


file_name = input("Enter Python file to analyze: ")

state = create_state(file_name)

print("Starting SP-202 workflow")
print("Original file:", state["file_name"])
print("Working file:", state["working_file"])
print("Status:", state["status"])
print()

save_working_code(state)

validation_attempt = 1

while True:
    print("Validation attempt:", validation_attempt)

    linter_result = run_linter(state["working_file"])
    state = update_linter_result(state, linter_result)

    print("Linter issues:", state["linter_result"]["issue_count"])
    print("Linter status:", state["linter_result"]["status"])
    print("System state:", state["status"])

    if state["status"] == "LINTER_PASS":
        print("Working code passed linting.")
        break

    print("Code requires analysis.")

    state = analyze_issues(state)

    print("Analysis status:", state["status"])
    print("Issues analyzed:", len(state["analysis_results"]))

    if state["status"] == "ANALYSIS_FAILED":
        print("Analysis failed.")
        break

    print("Code requires refinement.")

    if not can_continue(state):
        print("Maximum iterations reached.")
        break

    state = refine_code(state)

    print("Refinement status:", state["status"])

    state = save_working_code(state)

    print("Working code saved.")

    state = increase_iteration(state)

    print("Refinement cycle completed.")
    print("Iteration:", state["iteration"])
    print()

    validation_attempt = validation_attempt + 1


print()
print("Workflow finished")
print("Original file:", state["file_name"])
print("Working file:", state["working_file"])
print("Final status:", state["status"])
print("Iterations:", state["iteration"])