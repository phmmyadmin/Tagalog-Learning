---
name: feature-reviewer
description: Audits code diffs, performs refactorings/improvements if needed, verifies builds, and automatically merges the GitHub Pull Request upon clean review.
---

# Feature Reviewer Skill (Phase 4)

This skill performs a rigorous, automated code review, refactors code if necessary, verifies the build, and merges the Pull Request on GitHub.

## 4-Step Review & Merge Pipeline

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
- Merge the Pull Request on GitHub using GitHub MCP `merge_pull_request` or GitHub API:
  - **Merge Method**: `squash` or `merge`
  - **Commit Title**: `feat(scope): <title> (#PR)`
- Switch local workspace back to `main` branch and pull latest merged code:
  ```bash
  git checkout main
  git pull origin main
  ```
- Delete local feature branch:
  ```bash
  git branch -d <feature-branch>
  ```
- Update task status in GitHub Projects board (`@phmmyadmin's tasks`).
