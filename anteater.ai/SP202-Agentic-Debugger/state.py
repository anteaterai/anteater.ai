def create_state(file_name):
    with open(file_name, "r") as file:
        code = file.read()

    state = {
        "file_name": file_name,
        "working_file": "working_code.py",
        "original_code": code,
        "current_code": code,
        "linter_result": None,
        "analysis_results": [],
        "iteration": 0,
        "status": "START"
    }

    return state


def update_linter_result(state, linter_result):
    state["linter_result"] = linter_result

    if linter_result["status"] == "PASS":
        state["status"] = "LINTER_PASS"
    else:
        state["status"] = "LINTER_FAIL"

    return state


def increase_iteration(state):
    state["iteration"] = state["iteration"] + 1
    return state


def can_continue(state, max_iterations=3):
    if state["iteration"] < max_iterations:
        return True

    state["status"] = "MAX_ITERATIONS_REACHED"
    return False


def save_working_code(state):
    with open(state["working_file"], "w") as file:
        file.write(state["current_code"])

    return state