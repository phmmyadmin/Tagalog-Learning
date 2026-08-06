---
name: feature-executor
description: Implements tasks on isolated Git feature branches, updates GitHub Project task status, commits changes with proper messages, pushes to origin, and opens Pull Requests.
---

# Feature Executor Skill (Phase 3)

This skill handles the actual coding, Git branch orchestration, commit hygiene, PR creation, and project status progression.

## Workflow

### 1. Branch Management
- Check current git status: `git status`.
- Ensure workspace is clean and on `main` branch.
- Pull latest changes: `git pull origin main`.
- Create a new feature branch:
  ```bash
  git checkout -b feature/<feature-name>-<task-id>
  ```

### 2. Move Task Status in GitHub Project
Update the item's field/status in GitHub Project to "In Progress" or update draft issue content to note active status.

### 3. Code Implementation & Verification
- Modify code according to specification.
- Adhere strictly to project styling (Vanilla CSS / index.css design system, dark mode, responsive).
- Never guess code logic; view actual files first.
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
  git push -u origin feature/<feature-name>-<task-id>
  ```

### 5. Create Pull Request & Link Task
Create a PR against `main` using GitHub MCP (`create_pull_request`) or GitHub API:
- **Title**: `feat: <Feature Title>`
- **Body**: Detailed summary of implementation, acceptance criteria check, and task link.

### 6. Update GitHub Project Task
Update item status in GitHub Projects board to "In Review" or "Done".
