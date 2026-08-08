---
name: pptx-ingestor
description: Automates full ingestion of new PPTX lesson files into Tagalog Master from any directory (e.g., ~/Downloads, Desktop, or pptx_sources/). Copies/moves PPTX to pptx_sources/, converts PPTX to Markdown, integrates into tagalog_knowledge_base.md, runs build pipeline (parse_knowledge + extract_slides), commits, pushes branch, opens PR, auto-merges, and updates GitHub Project status.
---

# 🚀 PPTX Lesson Ingestion Skill

Trigger this skill whenever the user asks to ingest a new PPTX lesson, whether inside the workspace or from an external location like `~/Downloads`, `~/Desktop`, or a specific file path (e.g., "Ingesta la lección que tengo en Downloads", "Ingesta Lesson_06.pptx de Descargas", or "Procesa el nuevo PPTX").

## Ingestion Workflow (4-Stage Protocol)

### Stage 1: File Retrieval & Extraction
1. **Locate Source PPTX**:
   - If the file is in an external directory (e.g., `~/Downloads/Lesson_06.pptx` or `~/Desktop/`), locate it using file search tools.
   - Copy the file into the project repository folder `pptx_sources/`:
     ```bash
     cp "/path/to/external/Lesson_XX.pptx" pptx_sources/Lesson_XX.pptx
     ```
2. **Convert PPTX to Markdown**:
   ```bash
   python3 convert_pptx_to_md.py pptx_sources/<Lesson_XX>.pptx md_sources/<Lesson_XX>.md
   ```
3. Read `md_sources/<Lesson_XX>.md` to inspect extracted theory rules, vocabulary terms, and activity exercises.

### Stage 2: Knowledge Base Integration & Task Tracking
1. Integrate the extracted theory rules, vocabulary items, and exercises into `tagalog_knowledge_base.md`.
2. Create a tracking issue in GitHub Project V2 `@phmmyadmin's tasks` (`PVT_kwHOAkgXus4BfhjX`):
   - Title: `[Ingestion] Ingestar nueva lección <Lesson_XX> desde PPTX`
3. Update task status to `In Progress` (`47fc9ee4`).

### Stage 3: Branch, Pipeline Execution & PR Creation
1. Checkout a clean feature branch: `git checkout -b feature/ingest-<lesson_xx_lowercase>`
2. Execute the extraction & build pipeline:
   ```bash
   npm run build
   ```
   - `scripts/parse_knowledge.js` generates `src/data/tagalogData.json`.
   - `scripts/extract_slides.js` extracts slide media to `public/slides/<Lesson_XX>/` and updates `src/data/slideMap.json`.
3. Commit all changes:
   ```bash
   git add pptx_sources/ md_sources/ tagalog_knowledge_base.md src/data/ public/slides/
   git commit -m "feat(ingest): ingest new lesson <Lesson_XX> from PPTX"
   ```
4. Push branch to origin:
   ```bash
   git push origin feature/ingest-<lesson_xx_lowercase>
   ```
5. Open Pull Request on GitHub using GitHub MCP tool `create_pull_request`.

### Stage 4: Review, Auto-Merge & Task Completion
1. Merge Pull Request on GitHub using GitHub MCP tool `merge_pull_request` (`merge_method: "squash"`).
2. Sync local `main` branch and clean up feature branch:
   ```bash
   git checkout main && git pull origin main && git branch -D feature/ingest-<lesson_xx_lowercase>
   ```
3. Update GitHub Project task status to `Done` (`98236657`).
