import asyncio

from dotenv import load_dotenv
from google.adk.runners import InMemoryRunner
from google.genai import types

from adk_agent import create_analyst_agent


async def main():
    load_dotenv()

    agent = create_analyst_agent()
    runner = InMemoryRunner(agent=agent)

    user_id = "sp202_user"
    session_id = "sp202_test_session"

    await runner.session_service.create_session(
        app_name=runner.app_name,
        user_id=user_id,
        session_id=session_id,
    )

    message = types.Content(
        role="user",
        parts=[
            types.Part(
                text=(
                    "Analyze this Python code and explain the problem. "
                    "Do not modify the code.\n\n"
                    "def divide(a, b):\n"
                    "    return a / b\n\n"
                    "print(divide(10, 0))"
                )
            )
        ],
    )

    print("Sending test request to Analyst Agent...")

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

    print()
    print("Analyst Agent response:")
    print(response_text)


if __name__ == "__main__":
    asyncio.run(main())