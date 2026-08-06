---
name: feature-planner
description: Interactively plans a new feature by interviewing the user with target questions until all requirements are clear, then generates a structured feature specification and atomic task breakdown.
---

# Feature Planner Skill (Phase 1)

This skill guides the AI agent through an interactive planning session with the user before any code is written.

## Objectives
1. **Clarify Requirements**: Ask questions to understand the exact problem, user experience, constraints, and acceptance criteria.
2. **Architecture & Scope Alignment**: Evaluate visual design, technology stack impacts (Vite, React, CSS), and data models.
3. **Structured Plan Output**: Produce a clean, actionable feature specification and break it into atomic, sequential tasks.

## Workflow

### 1. Interactive Requirements Discovery
- Ask focused, non-repetitive questions to uncover missing details.
- Use `ask_question` for multiple-choice decisions or ask directly in text.
- Focus on:
  - What exact problem does this feature solve?
  - What UI/UX components are required?
  - How does it fit into existing state/components (`src/views`, `src/components`, `src/data`)?
  - What are the acceptance criteria for completion?

### 2. Drafting the Feature Plan
Once alignment is reached, generate a structured plan with:
- **Feature Overview & Goal**: Short summary of the feature.
- **Technical Architecture**: Components to create/edit, data flow, styles.
- **Atomic Tasks Breakdown**: A numbered list of granular tasks suitable for GitHub Projects. Each task must have:
  - **Title**: Short, descriptive summary (e.g., `[UI] Add filter buttons to Vocabulary view`)
  - **Description**: Precise description of what needs to be done.
  - **Acceptance Criteria**: How to verify success.

### 3. Transition to Task Creation (Phase 2)
- Present the final plan to the user for confirmation.
- Once approved, proceed directly to `project-task-creator` (Phase 2) to register tasks in GitHub Projects.
