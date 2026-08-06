---
name: tagalog-classifier
description: Reads all Tagalog lesson Markdown files from md_sources/ (any Lesson_XX.md present in the folder), extracts, synthesizes, and classifies the content into a structured knowledge base in English, divided into Theory (Grammar & Syntax Rules), Vocabulary (Lexicon & Vocabulary), and Activities (Exercises & Quizzes) formatted for easy web app generation.
---

# Tagalog Knowledge Classifier Skill

This skill processes all Tagalog lesson source files located in `md_sources/` and consolidates them into a standardized, machine-readable, and human-friendly document (`tagalog_knowledge_base.md`) completely in English and Tagalog.

## Objectives
1. **Extract & Categorize**:
   - **Theory**: Grammatical rules, sentence structures, articles, pronouns, ligatures, possessives, and exceptions explained in English.
   - **Vocabulary**: Consolidated vocabulary dictionary with Tagalog terms, English translations, grammatical roles, and lesson references.
   - **Activities**: Interactive-ready exercise bank with original prompts, exercise types, fill-in blanks, and step-by-step solutions in English.
2. **Web Generator Compatibility**:
   - Provide a dual structure: embedded structured JSON schema inside code blocks + organized GitHub Markdown with clean IDs for instant parsing by web generator scripts (Vite/Next.js/React).

## Workflow Instructions
1. Scan `md_sources/` for **all** `.md` files present (e.g. `Lesson_01.md`, `Lesson_02.md`, etc.).
2. Read and parse each lesson's sections dynamically without assuming an upper limit on lesson numbers.
3. Consolidate and deduplicate vocabulary across all processed lessons with accurate English translations.
4. Normalize grammar rules with clear English explanations, formulas, and contrasting examples.
5. Format exercises into structured items with unique IDs, prompt text in English/Tagalog, options/blanks, and solution keys.
6. Write the output to `tagalog_knowledge_base.md` ensuring all explanatory text is strictly in English.
