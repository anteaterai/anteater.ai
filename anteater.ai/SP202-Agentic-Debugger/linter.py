import subprocess
import json


def run_linter(file_name):
    result = subprocess.run(
        ["pylint", file_name, "--output-format=json"],
        capture_output=True,
        text=True
    )

    errors = json.loads(result.stdout)

    linter_result = {
    "file": file_name,
    "issue_count": len(errors),
    "status": "PASS" if len(errors) == 0 else "FAIL",
    "issues": errors
    }

    return linter_result


if __name__ == "__main__":
    file_name = input("Enter Python file to analyze: ")

    results = run_linter(file_name)

    print("File:", results["file"])
    print("Issues found:", results["issue_count"])
    print("Status:", results["status"])

    for error in results["issues"]:
        print()
        print("Line:", error["line"])
        print("Type:", error["type"])
        print("Message:", error["message"])