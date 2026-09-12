---
name: code-review
description: >-
  Performs a comprehensive code review of recent changes. Use when checking quality
  or before committing changes. Runs ESLint, TypeScript checks, and analyzes patterns.
---

# Parallel Code Review Sub-Agent

When invoked:
1. Run `node .agents/scripts/parallel-check.mjs`.
2. Review report in `.agents/reports/last-check.json`.
3. Check for memory leaks, unoptimized re-renders, and unused imports.
4. Output structured markdown review with severity: `[CRITICAL]`, `[WARNING]`, `[SUGGESTION]`.
