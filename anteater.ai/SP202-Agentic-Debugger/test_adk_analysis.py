import asyncio

from dotenv import load_dotenv
from google.adk.runners import InMemoryRunner
from google.genai import types

from state import create_state, update_linter_result
from linter import run_linter
from adk_bridge import prepare_analysis_request
from adk_agent import create_analyst_agent


async def main():
    load_dotenv()

    state = create_state("test_buggy.py")

    linter_result = run_linter(state["file_name"])
    state = update_linter_result(state, linter_result)

    request = prepare_analysis_request(state)

    agent = create_analyst_agent()
    runner = InMemoryRunner(agent=agent)

    user_id = "sp202_user"
    session_id = "sp202_analysis_session"

    await runner.session_service.create_session(
        app_name=runner.app_name,
        user_id=user_id,
        session_id=session_id,
    )

    message_text = (
        "Analyze the following Python source code and its Pylint results. "
        "Explain the problems clearly. Do not modify the source code.\n\n"
        "FILE:\n"
        + request["file_name"]
        + "\n\nSOURCE CODE:\n"
        + request["code"]
        + "\n\nPYLINT RESULTS:\n"
        + str(request["linter_result"])
    )

    message = types.Content(
        role="user",
        parts=[
            types.Part(text=message_text)
        ],
    )

    print("Starting SP-202 live analysis...")
    print("File:", request["file_name"])
    print("Linter issues:", request["linter_result"]["issue_count"])
    print("Agent:", request["agent_name"])
    print()

    response_text = ""

    async for event in runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=message,
    ):
        if event.content and event.content.parts:
            for part in event.content.parts:
                if part.text:
                    response_text += part.text

    print("Analyst Agent response:")
    print(response_text)


if __name__ == "__main__":
    asyncio.run(main())