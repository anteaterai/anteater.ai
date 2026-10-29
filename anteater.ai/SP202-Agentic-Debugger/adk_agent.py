from google.adk.agents import Agent


def create_analyst_agent():
    analyst_agent = Agent(
        name="analyst_agent",
        model="gemini-3.8-flash",
        description="Analyzes source code problems found by the SP-202 debugger.",
        instruction=(
            "You are the Analyst Agent for the SP-202 Agentic Software "
            "Debugger. Analyze source code problems and explain the issues "
            "clearly. Do not modify the source code."
        ),
    )

    return analyst_agent