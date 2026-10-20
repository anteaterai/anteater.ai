import subprocess

file_name = "test_buggy.py"

result = subprocess.run(
    ["pylint", file_name],
    capture_output=True,
    text=True
)

print(result.stdout)