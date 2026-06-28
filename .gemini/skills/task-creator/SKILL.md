# Task Creator Skill

This skill automates the creation of new task documents in the `docs/tasks/` directory using a standardized template.

## Goal
Ensure all tasks are documented consistently, making it easy to track progress, priority, and acceptance criteria across the project.

## Workflow
1. **Identify Task Details:** Gather the task name, description, priority, and acceptance criteria from the user or the current context.
2. **Reference Template:** Read the template from `docs/templates/task-template.md`.
3. **Generate ID:** Determine the next task ID (e.g., TASK-001) by checking existing files in `docs/tasks/`.
4. **Create File:** Create a new markdown file in `docs/tasks/` using the naming convention `TASK-XXX-[task-name].md`.
5. **Populate Content:** Fill the template with the gathered details.
6. **Update Roadmap/Log:** If applicable, add the new task to `docs/roadmap/progress-log.md` or `Mds/TASKS.md` to maintain global visibility.

## Guidelines
- **Naming:** Use kebab-case for filenames (e.g., `TASK-005-implement-auth-flow.md`).
- **Consistency:** Never deviate from the `task-template.md` structure.
- **Atomicity:** Create one task per file. Large tasks should be broken down into smaller sub-tasks.
- **Validation:** After creating the task, verify the file exists and is correctly formatted.

## Resource Mapping
- **Template:** `docs/templates/task-template.md`
- **Output Directory:** `docs/tasks/`
- **Global Task List:** `Mds/TASKS.md`
