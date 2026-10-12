# SP-202 Analyst

The Analyst is part of the SP-202 Agentic Software Debugger and
Documenter project.

## How to Open the Analyst

1.  Download or clone the project from GitHub.

2.  Open the project folder in Visual Studio Code.

3.  Open the following folder:

    `anteater.ai/SP202-Agentic-Debugger`

4.  Open `analyst.py` to view the Analyst code.

## How to Run the Analyst

The Analyst uses linter results stored in the project state, so
`analyst.py` is not intended to be run directly by itself.

Open a terminal in the `SP202-Agentic-Debugger` folder.

If the virtual environment is available, activate it on Windows:

    .venv\Scripts\activate

Then run the Analyst test:

    python test_analyst.py

The program will process the test code, read the linter results, and
pass those results to the Analyst.

## Expected Result

The terminal should show that the analysis process started and
completed.

For code containing issues, the Analyst should report the number of
issues analyzed and update the state to:

    ANALYSIS_COMPLETE

If no issues are found, the state should become:

    ANALYSIS_CLEAN

## Main File

    analyst.py

Main function:

    analyze_issues(state)

This function receives the current program state, analyzes the available
linter issues, stores the results, and returns the updated state.

## Requirements

-   Python 3
-   Project files from SP202-Agentic-Debugger
-   Required Python packages installed for the project

## Important

Do not run:

    python analyst.py

by itself because `analyst.py` defines the Analyst function but does not
contain a standalone program entry point.

Use:

    python test_analyst.py

to test the Analyst.
