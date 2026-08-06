---
name: feature-executor
description: Implements tasks on isolated Git feature branches, moves GitHub Project task status to "In Progress", commits changes, pushes to origin, and opens Pull Requests.
---

# Feature Executor Skill (Phase 3)

This skill handles the actual coding, Git branch orchestration, commit hygiene, PR creation, and project status progression.

## GitHub Project Status Tracking
- **Project ID**: `PVT_kwHOAkgXus4BfhjX`
- **Status Field ID**: `PVTSSF_lAHOAkgXus4BfhjXzhZz28U`
- **Option IDs**:
  - `Todo`: `f75ad846`
  - `In Progress`: `47fc9ee4`
  - `Done`: `98236657`

## Workflow

### 1. Move Task Status to "In Progress" in GitHub Project
Execute GraphQL mutation to set item status to `In Progress` (`47fc9ee4`):

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
    "optionId": "47fc9ee4",  # In Progress
}
```

### 2. Branch Management
- Check current git status: `git status`.
- Ensure workspace is clean and on `main` branch.
- Pull latest changes: `git pull origin main`.
- Create a new feature branch:
  ```bash
  git checkout -b feature/<feature-name>
  ```

### 3. Code Implementation & Verification
- Modify code according to specification.
- Adhere strictly to project styling (Warm Light Mode palette, cards, clean typography, zero broken imports).
- Verify changes by running build:
  ```bash
  npm run build
  ```
  Ensure 0 build errors before proceeding.

### 4. Git Commits & Push
- Stage specific changed files: `git add <files>`.
- Commit with conventional commit format:
  ```bash
  git commit -m "feat(scope): detailed description of work done"
  ```
- Push feature branch to GitHub remote:
  ```bash
  git push origin feature/<feature-name>
  ```

### 5. Create Pull Request
Create a PR against `main` using GitHub MCP (`create_pull_request`).
