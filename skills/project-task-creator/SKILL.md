---
name: project-task-creator
description: Automatically creates tasks in GitHub Projects V2 (@phmmyadmin's tasks - Project #1) using GraphQL API from a planned feature task list.
---

# Project Task Creator Skill (Phase 2)

This skill converts atomic tasks defined in Phase 1 into tracked items in the user's GitHub Project board (`@phmmyadmin's tasks`).

## GitHub Project Details
- **Owner**: `phmmyadmin`
- **Project Number**: `1`
- **Project Title**: `@phmmyadmin's tasks`
- **Project V2 GraphQL ID**: `PVT_kwHOAkgXus4BfhjX`

## Workflow

### 1. Read Task Breakdown
Read the approved atomic tasks list generated in Phase 1 (`feature-planner`).

### 2. Create Tasks via GitHub GraphQL API
Execute a Python script or GraphQL query using the PAT to insert each task into Project V2:

```python
import json
import urllib.request

token = os.environ.get("GITHUB_PERSONAL_ACCESS_TOKEN", "")
project_id = "PVT_kwHOAkgXus4BfhjX"
url = "https://api.github.com/graphql"

tasks = [
    "Task 1: Add new state variable",
    "Task 2: Build UI component",
]

for title in tasks:
  query = """
    mutation($projectId: ID!, $title: String!) {
      addProjectV2DraftIssue(input: {projectId: $projectId, title: $title}) {
        projectItem {
          id
          content {
            ... on DraftIssue {
              title
            }
          }
        }
      }
    }
    """
  data = json.dumps(
      {"query": query, "variables": {"projectId": project_id, "title": title}}
  ).encode("utf-8")
  req = urllib.request.Request(
      url,
      data=data,
      headers={
          "Authorization": f"bearer {token}",
          "Content-Type": "application/json",
          "User-Agent": "Antigravity",
      },
  )
  with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode("utf-8"))
    print(res)
```

### 3. Record Task IDs
Keep a mapping of:
- Task Title -> GitHub Project Item ID (`PVTI_...`)
- Save this state to reference during execution (Phase 3).

### 4. Transition to Execution (Phase 3)
Confirm created tasks with the user and move to `feature-executor` (Phase 3).
