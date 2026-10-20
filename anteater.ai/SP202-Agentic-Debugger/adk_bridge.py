from adk_agent import create_analyst_agent


def prepare_analysis_request(state):
    agent = create_analyst_agent()

    request = {
        "agent_name": agent.name,
        "model": agent.model,
        "file_name": state["file_name"],
        "code": state["current_code"],
        "linter_result": state["linter_result"],
    }

    return request
