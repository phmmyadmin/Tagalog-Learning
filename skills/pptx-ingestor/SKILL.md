---
name: pptx-ingestor
description: Automates full ingestion of new PPTX lesson files into Tagalog Master from any directory (e.g., ~/Downloads, Desktop, or pptx_sources/). Copies/moves PPTX to pptx_sources/, converts PPTX to Markdown, structures theory topics with formatted JSON tables (table / pairs schemas), integrates into tagalog_knowledge_base.md, runs build pipeline (parse_knowledge + extract_slides), commits, pushes branch, opens PR, auto-merges, and updates GitHub Project status.
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

### Stage 2: Knowledge Base Integration & Structured Table Generation
1. **Theory Structuring Rule**:
   - Whenever structuring grammar theory entries (e.g., Pronouns, Articles, Possessives, Conjugations, Demonstratives, Enclitics, Question Words, Comparatives), **MANDATORILY include a `"table"` or `"pairs"` JSON array** in the topic object within `tagalog_knowledge_base.md`.
   - **Table Schema Example**:
     ```json
     "table": [
       {"pronoun": "ako", "meaning": "I", "type": "1st Person Singular", "contraction": "Ako'y"},
       {"pronoun": "ikaw / ka", "meaning": "You (singular)", "type": "2nd Person Singular", "usage": "'ikaw' at start, 'ka' post-predicate"}
     ]
     ```
   - **Possessive Pairs Schema Example**:
     ```json
     "rules": [
       {
         "type": "Pre-Noun vs Post-Noun Possessive Pronouns",
         "pairs": [
           {"pre": "akin", "post": "ko", "meaning": "my / mine"},
           {"pre": "iyo", "post": "mo", "meaning": "your / yours"}
         ]
       }
     ]
     ```
   - This ensures `TheoryCard.jsx` automatically renders clean, responsive HTML tables with interactive TTS pronunciation buttons (`🔊`).

2. **Mandatory Vocabulary Completeness Directive**:
   - **CRITICAL**: Every ingested lesson MUST produce a comprehensive list of vocabulary terms in **SECTION 2: CONSOLIDATED VOCABULARY DICTIONARY** in `tagalog_knowledge_base.md`.
   - **What counts as vocabulary?**
     - Core nouns, adjectives, and verbs introduced in the slides.
     - Question words (e.g., *sino, ano, alin, saan, nasaan, kailan, bakit, paano, gaano, ilan, magkano, kanino*).
     - Plural interrogative forms (e.g., *sinu-sino, anu-ano, saan-saan, kani-kanino*).
     - Enclitic particles and question markers (e.g., *ba, na, pa, din/rin, daw/raw, nga, naman, lamang/lang, man, sana, kasi, kaya, muna, tuloy, pala, po/opo*).
     - Pseudo-verbs & modals (e.g., *gusto, ayaw, ibig, puwede, maaari, dapat*).
     - Comparative, intensive, and superlative prefixes/markers (e.g., *kasing-, magkasing-, kasin-, kasim-, sing-, pareho, katulad, gaya, mas, kaysa, kesa, napaka-, pinaka-, labis, higit, lalo*).
   - **NEVER leave a lesson with 0 vocabulary items**. Every lesson must have at least **10+ vocabulary terms**.

3. **Mandatory Lesson Mastery Quiz Generation**:
   - For every newly ingested lesson (e.g. `<Lesson_XX>`), **MANDATORILY create a dedicated quiz JSON file** at `src/data/quizzes/lesson_<xx>_quiz.json`.
   - **Quiz JSON Schema**:
     ```json
     {
       "quiz_metadata": {
         "id": "LESSON_<XX>_QUIZ",
         "lesson": "Lesson_<XX>",
         "title": "Lesson <XX> Mastery Exam",
         "topic": "<Brief Topic Description>",
         "total_questions": 8,
         "created_at": "2026-08-21T20:00:00Z"
       },
       "questions": [
         {
           "id": "L<XX>-Q01",
           "type": "multiple_choice",
           "topic": "Grammar Topic",
           "lesson": "Lesson_<XX>",
           "prompt": "Question prompt",
           "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
           "correct_answer": "Opt A",
           "explanation": "Pedagogical explanation"
         }
       ]
     }
     ```
   - Register the new quiz in `src/data/quizzes/index.js` under `lessonQuizzes` array.

4. **Mandatory 4-Pillar Validation Gate**:
   - Before building and committing, verify programmatically or visually that all 4 pillars exist for the lesson:
     - 📖 **Theory**: $\ge 1$ structured topic (with `"table"` or `"pairs"`).
     - 🎴 **Vocabulary**: $\ge 10$ terms in Section 2 dictionary.
     - ✍️ **Activities**: $\ge 4$ exercises in Section 3 exercise bank.
     - 🎓 **Mastery Exam**: Exactly 8 multiple choice questions in `src/data/quizzes/lesson_<xx>_quiz.json`.
   - If any pillar is missing or incomplete, halt and fulfill the requirement before proceeding.

5. Create a tracking issue in GitHub Project V2 `@phmmyadmin's tasks` (`PVT_kwHOAkgXus4BfhjX`):
   - Title: `[Ingestion] Ingestar nueva lección <Lesson_XX> desde PPTX`
6. Update task status to `In Progress` (`47fc9ee4`).

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
   git commit -m "feat(ingest): ingest new lesson <Lesson_XX> from PPTX with structured theory tables and full vocabulary"
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
