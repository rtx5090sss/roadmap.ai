# RoadmapEngine Developer Agent Rules

These workspace instructions govern automated coding, parallel sub-agents, and quality verification.

## 1. Quality & Verification Standards
- **Always verify builds**: Never complete a feature without ensuring `npm run build` passes.
- **Type safety**: Run `npx tsc --noEmit` to verify all TypeScript interfaces. No `any` without justification.
- **Zero regressions**: Verify database schema changes with `npm run seed` and test API route responses.

## 2. Parallel Sub-Agent Quality Gates
- Code edits trigger the **Parallel Quality Gate** in `.agents/scripts/parallel-check.mjs`.
- The runner concurrently executes:
  1. ESLint (`npx next lint`)
  2. TypeScript Compiler Check (`npx tsc --noEmit`)
  3. Security & Vulnerability Audit (`npm audit`)
- If any check fails, immediately inspect `.agents/reports/last-check.json` and fix the flagged issues.

## 3. Architecture Guidelines
- **Frontend**: Vanilla CSS design system with CSS custom properties in `src/app/globals.css`. Do NOT introduce random utility classes or conflicting CSS frameworks.
- **Node Graph**: Use `@xyflow/react` for the interactive roadmap canvas with custom `MilestoneNode` components.
- **Database**: Drizzle ORM with `@libsql/client` supporting local SQLite (`file:local.db`) and cloud Turso.
- **Authentication**: NextAuth.js (Auth.js v5) with credentials provider and role-based access (`admin` vs `learner`).
