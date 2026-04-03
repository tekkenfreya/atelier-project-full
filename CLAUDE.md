# Kyrill Skincare — Development Guidelines

> **Purpose:** Standard development rules and best practices
> **Last Updated:** 2026-03-27

---

## Project Overview

Custom skincare e-commerce brand offering 3 core products (Moisturizer, Cleanser, Serum) with personalized ingredient selection via a consultation quiz. Features include a shopping cart, Stripe checkout, and a subscription model (bi-monthly & annual plans at 20% discount for 6 products).

---

## Critical Rules

### 1. No AI Attribution — Absolute
- Never mention AI, Claude, or any AI assistant in commit messages, code comments, or documentation
- No `Co-Authored-By` lines referencing any AI tool in any commit
- No AI tool names in PR titles, PR descriptions, branch names, or code comments
- Git history must read as human-authored at every line — no exceptions

### 2. Always Read Docs First
Before making any change, check in order:
- `CLAUDE.md` — this file, for rules and patterns
- Any task-specific documentation referenced in the current session

### 3. Zero Hallucination — Variables, Names, and Imports
- **Never** use a variable, type, function, or component name that has not been confirmed to exist in the codebase by reading the actual file
- **Never** call an API route that has not been verified to have a `route.ts` file
- **Never** import from a path without confirming the file exists
- **Never** reference a Tailwind class that is not defined in `globals.css` or a standard utility
- When in doubt: read the file first, then write the code

### 4. Plan Before Executing
- State the full implementation plan before writing any code or modifying any file
- Get explicit approval before proceeding
- If scope changes mid-implementation, stop and re-plan

### 5. Production-Grade Clean Code
- No hacks, no shortcuts, no commented-out code, no dead code
- No bloating — do not add dependencies, abstractions, or utilities unless directly required
- No over-engineering — solve only what is asked, nothing more
- No `any` types — use exact types or define a precise local interface
- No console.log left in production code — only `console.error` in API routes for server-side error tracking
- Every function does one thing

### 5b. Layout & UI Basics
- **Always center content** — full-screen pages and standalone screens (quiz steps, loading states, auth forms) must be vertically and horizontally centered using `min-height: 100vh` with flexbox `align-items: center; justify-content: center`
- **Never leave content floating top-left** — if a component renders on its own screen, it must be centered in the viewport
- **Use the existing design tokens** — follow the `--bg-primary`, `--bg-cream`, `--text-primary`, `--accent`, `--border` variables. Never hardcode colors
- **Feature-prefixed CSS** — every new page/component gets its own prefix (`.quiz-*`, `.cart-*`, `.account-*`, `.report-*`). No generic class names
- **Responsive by default** — all layouts must work on mobile (320px) through desktop (1440px)

### 6. Check Codebase Before Writing
- Read the relevant file before editing it
- Check if a component already exists before creating a new one
- Check if a type already exists before defining a new one

### 7. AI Temperature — Precision First
- Consultation quiz AI calls with structured output: `temperature: 0` (deterministic)
- Creative content or personalized suggestions: `temperature: 0.7` maximum
- Never exceed `temperature: 0.7` anywhere in the codebase

---

## Project Structure Conventions

### Feature Component Organization
- Feature-scoped components live in subdirectories under `src/components/` (e.g., `src/components/quiz/`)
- Input variants for a feature go in a nested `inputs/` subdirectory (e.g., `src/components/quiz/inputs/SingleSelect.tsx`)
- Each input component exports a single default function with a consistent props interface

### Static Data Files
- Static data and its associated types live together in `src/data/` (e.g., `src/data/quizQuestions.ts`)
- Shared types are exported from the data file — not a separate types file — to maintain a single source of truth
- Never duplicate type definitions across files; import from the canonical source

### CSS Class Prefix Convention
- Feature-scoped CSS classes use a `.<feature>-*` prefix pattern in `globals.css` (e.g., `.quiz-container`, `.quiz-topbar`)
- All feature styles are CSS-first — no inline styles for layout or theming

### Matching Engine Module (`src/lib/matching-engine/`)
- Pure logic module — no React, no UI, no side effects except Supabase reads
- `types.ts` (source of truth), `filters.ts`, `scoring.ts`, `recommend.ts` (orchestrator, only file touching Supabase)

### Shared Supabase Project
- `app/` and `recip3/` share the same Supabase project — schema changes affect both

---

## Animation & Interaction Patterns

Full GSAP, Lenis, and page transition rules: @.claude/rules/animation-patterns.md

---

## Client-Side Persistence

### sessionStorage
- Multi-step form answers persist to `sessionStorage` before navigating to the completion screen
- Key format: descriptive string (e.g., `"quizAnswers"`)
- Value format: `JSON.stringify` of the answers record

---

## Common Gotchas

### Quiz Option String Matching
- Quiz option strings in `src/data/quizQuestions.ts` must **exactly** match the keys in `scoring.ts` (`QUIZ_CONCERN_MAP`, `PRIORITY_CONCERN_MAP`) and `filters.ts` (`extractExclusions`)
- A single character difference (capitalization, punctuation, whitespace) silently breaks scoring — the concern maps return `undefined` and the product scores zero
- When adding or renaming quiz options, grep all mapping files in `lib/matching-engine/` to update every reference

### skin_type Inconsistency in Database
- The `products.skin_type` column contains inconsistent values (e.g., `"Oily Skin"` vs `"Oily"`)
- Partially addressed: the ERP now uses a dropdown (`Oily Skin`, `Dry Skin`, etc.) for new entries, but old data may still have inconsistent values
- Always use `normalizeSkinType()` from `lib/matching-engine/filters.ts` when comparing skin types — never do raw string equality
- `normalizeSkinType()` lowercases and strips the trailing `" skin"` suffix before matching

### Recommendation Engine Is Deterministic
- The matching engine uses decision-tree filtering + weighted scoring — not an LLM call
- No randomness, no temperature setting — same quiz answers always produce the same recommendation
- The pipeline: extract skin type and exclusions, filter products by skin type + exclusions, score remaining candidates by concern overlap with priority multipliers, return highest-scored product

---

## Reference Files

### Rules (loaded on demand)
- @.claude/rules/animation-patterns.md — GSAP, Lenis, page transitions, CSS animation patterns

### Auto Memory (project knowledge)
- User profile & client relationship → `~/.claude-personal/.../memory/user_kyrill_client.md`
- ERP infrastructure, repos, databases, migration lessons → `~/.claude-personal/.../memory/project_erp_migration.md`
- Matching engine architecture → `~/.claude-personal/.../memory/project_matching_engine.md`
- Supabase auth migration rules → `~/.claude-personal/.../memory/feedback_supabase_auth.md`
- Supabase schema export rules → `~/.claude-personal/.../memory/feedback_supabase_schema_export.md`

---

*Rules are finalized. Update this file only when a new convention is established and approved.*
