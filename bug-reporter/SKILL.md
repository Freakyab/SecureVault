---
name: bug-reporter
description: Automates the creation of standardized bug reports in the docs/bug directory. Use when a bug is identified and needs to be documented following the project's established bug template.
---

# Bug Reporter Skill

This skill ensures that all bugs are documented consistently using the project's standard template.

## Workflow

1. **Analyze the Bug**: Gather all necessary information:
   - A descriptive title.
   - Priority (P0-P3).
   - Area of the app affected.
   - Steps to reproduce the issue.
   - Expected vs Actual behavior.
   - Likely cause (with code snippets if possible).
   - Related files.

2. **Determine the Bug ID**:
   - Search `docs/bug/` to find the highest existing BUG-XXX number.
   - Increment the number by 1 (e.g., if the last bug is BUG-037, the next is BUG-038).

3. **Apply the Template**:
   - Read the template from `docs/templates/BUG_TEMPLATE.md`.
   - Fill in the placeholders with the gathered information.

4. **Create the File**:
   - Save the completed report as `docs/bug/BUG-XXX-[slugified-title].md`.
   - Use a kebab-case slug for the title (e.g., "No close button" -> "no-close-button").

## Reference
- Bug Template: `docs/templates/BUG_TEMPLATE.md`
- Bug Directory: `docs/bug/`
