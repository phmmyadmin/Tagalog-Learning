---
name: feature-reviewer
description: Audits code changes on feature branches and PRs, verifies build & lint, checks design standards, and submits comprehensive code reviews.
---

# Feature Reviewer Skill (Phase 4)

This skill performs automated review and quality assurance on feature branches and PRs created during Phase 3.

## Review Checkpoints

### 1. Diff Inspection
- Run `git diff main...HEAD` or inspect PR files using `pull_request_read` / GitHub MCP tools.
- Verify every file modified is relevant to the feature scope.
- Check for unused imports, leftover debug statements (`console.log`), or temporary code.

### 2. Build & Runtime Audit
- Execute production build check:
  ```bash
  npm run build
  ```
- Check for zero syntax errors, missing asset paths, or broken component imports.

### 3. Aesthetics & Design System Audit
- Verify colors match palette (HSL, modern dark gradients).
- Ensure typography uses Inter/Outfit or project standards.
- Check responsiveness and visual excellence guidelines.

### 4. API & Data Contract Audit
- Ensure props, parameters, and signatures match invocation sites.
- Verify state mutations follow immutable patterns in React.

### 5. Review Summary & PR Comment
- Produce a structured markdown code review report covering:
  - ✅ **Passed Checks**: Build, lint, component structure.
  - 🔍 **Observations & Optimizations**: Performance, minor tweaks.
  - 🎯 **Verdict**: Ready for merge / Requires changes.
- Add comment or submit review on GitHub PR via MCP `pull_request_review_write` or API.
