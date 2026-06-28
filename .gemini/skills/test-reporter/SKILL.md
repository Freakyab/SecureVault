---
name: test-reporter
description: Automates the creation of test execution results in the docs/test directory. Use when a test scenario has been executed and the result needs to be documented and mapped to an existing scenario.
---

# Test Reporter Skill

This skill ensures that test executions are documented consistently and mapped correctly to the predefined test scenarios.

## Workflow

1. **Identify the Scenario**:
   - The user will provide a scenario ID (e.g., `TC-SETUP-01`) or a description.
   - If only a description is provided, search `docs/test/scenarios/` to find the matching scenario file.

2. **Gather Execution Data**:
   - Result: (PASS, FAIL, or BLOCKED).
   - Device and OS information.
   - Any specific notes or evidence.
   - If result is FAIL, ensure a corresponding bug report is created using the `bug-reporter` skill.

3. **Determine the Test ID**:
   - Search `docs/test/` (and subdirectories) to find the highest existing `TEST-XXX` number.
   - Increment the number by 1.

4. **Apply the Template**:
   - Read the template from `docs/templates/TEST_TEMPLATE.md`.
   - Map the **Scenario ID** and **Scenario Title** from the scenario file found in step 1.
   - Fill in the remaining placeholders with the execution data.

5. **Create the Result File**:
   - Save the file as `docs/test/TEST-XXX-[slugified-scenario-title].md`.
   - The filename should include the scenario ID for easy reference (e.g., `TEST-001-TC-SETUP-01-fresh-install.md`).

## Reference
- Test Template: `docs/templates/TEST_TEMPLATE.md`
- Scenario Library: `docs/test/scenarios/`
- Bug Reporter: `bug-reporter` skill
