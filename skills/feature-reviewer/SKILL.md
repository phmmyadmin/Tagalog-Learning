---
name: feature-reviewer
description: Audits code diffs, performs refactorings/improvements if needed, verifies builds, merges the GitHub Pull Request, and moves GitHub Project task status to "Done".
---

# Feature Reviewer Skill (Phase 4)

This skill performs a rigorous, automated code review, refactors code if necessary, verifies the build, merges the Pull Request on GitHub, and marks the project task as "Done".

## 5-Step Review & Merge Pipeline

### 1. Code Diff & Logic Inspection
- Inspect all changed files in the branch/PR using `git diff main...HEAD` or GitHub MCP tools (`pull_request_read`).
- Check for:
  - Code cleanliness, readability, and adherence to project style.
  - Potential runtime errors, memory leaks, unhandled null/undefined edge cases.
  - Accessibility standards (WCAG 2.1 AA: focus-visible, labels, aria attributes).
  - Unused imports, console logs, or redundant code.

### 2. Auto-Refactor & Enhance Code (If Needed)
- If any code quality issues, missing edge cases, or performance improvements are detected:
  1. Make the necessary code edits directly.
  2. Re-test build locally (`npm run build`).
  3. Commit the review improvements:
     ```bash
     git commit -am "refactor(review): improve code quality, edge cases, and accessibility"
     git push origin <feature-branch>
     ```

### 3. Build & Integrity Verification
- Run production build check:
  ```bash
  npm run build
  ```
- Ensure 0 errors, 0 warnings, and clean output bundle.

### 4. Automated PR Merge & Cleanup
- Merge the Pull Request on GitHub using GitHub MCP `merge_pull_request`:
  - **Merge Method**: `squash` or `merge`
- Switch local workspace back to `main` branch and pull latest merged code:
  ```bash
  git checkout main
  git pull origin main
  ```
- Delete local feature branch:
  ```bash
  git branch -d <feature-branch>
  ```

### 5. Move Task Status to "Done" in GitHub Project
Execute GraphQL mutation to set item status to `Done` (`98236657`):

```python
import json
import os
import urllib.request

token = os.environ.get("GITHUB_PERSONAL_ACCESS_TOKEN")
url = "https://api.github.com/graphql"

query = """
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: $projectId,
    itemId: $itemId,
    fieldId: $fieldId,
    value: { singleSelectOptionId: $optionId }
  }) {
    projectV2Item { id }
  }
}
"""

variables = {
    "projectId": "PVT_kwHOAkgXus4BfhjX",
    "itemId": "<item_id>",
    "fieldId": "PVTSSF_lAHOAkgXus4BfhjXzhZz28U",
    "optionId": "98236657",  # Done
}
```
