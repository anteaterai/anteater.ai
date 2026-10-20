from state import create_state, update_linter_result
from linter import run_linter


def analyze_file(file_name):
    state = create_state(file_name)

    result = run_linter(state["file_name"])

    state = update_linter_result(state, result)

    return state


file_name = "test_buggy.py"

state = analyze_file(file_name)

print("File:", state["file_name"])
print("Issues found:", state["linter_result"]["issue_count"])
print("Linter status:", state["linter_result"]["status"])
print("System state:", state["status"])
print("Iteration:", state["iteration"])