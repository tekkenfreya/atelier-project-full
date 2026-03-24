# Kyrill Skincare — Development Guidelines

> **Purpose:** Standard development rules and best practices
> **Last Updated:** 2026-03-18

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
- File separation by responsibility:
  - `types.ts` — all interfaces and type aliases for the engine (`Product`, `ScoredProduct`, `Recommendation`, `Concern`, `SkinType`)
  - `ingredient-map.ts` — static mapping of ingredient names to concerns and excludability
  - `filters.ts` — skin type normalization, exclusion extraction, and product filtering
  - `scoring.ts` — quiz-answer-to-concern mapping, priority ranking, and product scoring
  - `recommend.ts` — orchestrator that fetches products, filters, scores, and returns a `Recommendation`
- Types are exported from `types.ts` — the single source of truth for the engine
- The orchestrator (`recommend.ts`) is the only file that touches Supabase; filters and scoring are pure functions

### Shared Supabase Project
- The e-commerce app (`app/`) and the ERP (`recip3/`) share the same Supabase project (`kdjcbxjagaltvynvshkj`)
- `app/src/lib/supabase.ts` creates a client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- The matching engine reads from the same `products`, `ingredients`, and `product_ingredients` tables managed by the ERP
- Schema changes in the ERP affect the e-commerce app — coordinate across both codebases

---

## Animation & Interaction Patterns

### GSAP Usage
- Store active tweens in a `useRef` and call `.kill()` before starting a new tween on the same element
- Tween refs must be cleaned up — never let a tween outlive its component or transition cycle
- Use `gsap.to` / `gsap.fromTo` directly; do not wrap in custom abstractions unless reuse is proven

### Native Drag-and-Drop
- Use native HTML drag events (`onDragStart`, `onDragOver`, `onDrop`) — no external drag libraries
- Always provide keyboard fallback (ArrowUp/ArrowDown with `e.preventDefault()`) for accessibility

### Multi-Step Form Navigation
- Section transition screens display only on forward navigation — back navigation skips them and goes directly to the previous question
- Components that render with a default value (e.g., DragRank defaulting to options order) must call `onChange` on mount to sync parent state

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

## Recip3 / Cosmetic Inventory Hub (ERP)

### Overview
Internal ERP system for cosmetic formulation management, migrated from Lovable to self-hosted infrastructure. Originally built with Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Supabase.

### Infrastructure
- **Source repo:** `atelier-rusalka/atelier-rusalka` (GitHub, private)
- **Database:** Supabase project `kdjcbxjagaltvynvshkj` (own account, not Lovable-managed)
- **Deployment:** Vercel (pending full setup)
- **Local code:** `recip3/` subdirectory in this workspace

### Supabase Migration Lessons

#### Auth Users — Never Raw INSERT
- Do **not** manually INSERT into `auth.users` and `auth.identities` via raw SQL — Supabase Auth has many hidden fields and internal state that must be set correctly
- "database error querying schema" on login = broken auth user records
- Always create users through the **Supabase Dashboard** (Authentication → Users → Add User) or the **Admin API**
- Passwords are bcrypt-hashed one-way — they cannot be transferred between Supabase projects. Use temp passwords + password reset flow when migrating

#### Schema Must Match Exactly
- The typed Supabase client (`src/integrations/supabase/types.ts`) expects **exact foreign key constraint names** (e.g., `ingredients_supplier_id_fkey`, not `fk_ingredients_supplier`)
- Custom **enums** (e.g., `app_role`) and **functions** (e.g., `has_role()`, `update_updated_at_column()`) must be created in the new database — they are not part of table data exports
- RLS policies in the original use `has_role(auth.uid(), 'admin'::app_role)` — not generic "Allow authenticated" policies
- After schema changes, always run `NOTIFY pgrst, 'reload schema';` to refresh PostgREST cache

#### Data Export Approach
- Export schema: `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public'`
- Export data: UNION ALL query with `to_jsonb(t)` for all tables in a single CSV
- Also export: functions (`pg_get_functiondef`), foreign keys (`pg_constraint`), enums (`pg_type`/`pg_enum`), RLS policies (`pg_policies`)
- Auth users are in `auth.users`, not in `public` schema — they require separate handling

#### SDK Key Compatibility
- `@supabase/supabase-js ^2.x` requires the **legacy JWT anon key** (starts with `eyJ...`)
- New Supabase "publishable keys" (starts with `sb_publishable__`) are not compatible with v2 SDK
- Use the legacy key from Supabase Dashboard → Settings → API → Legacy API keys

### ERP Database Tables
`products` (24), `ingredients` (95), `product_ingredients` (232), `product_method_steps` (109), `suppliers` (7), `manufacturers` (0), `orders` (14), `order_items` (63), `user_roles` (4), `startup_project_cards` (15), `report_subscriptions` (1), `saved_exports` (1), `scheduled_exports` (2), `export_history` (30), `cloud_storage_integrations` (2)

### ERP User Roles
- `kyrillkaz@outlook.com` — admin
- `andreea.marica.lma@gmail.com` — editor
- `martin.cholakov@dijksterhuisltd.com` — editor
- `martin.cholakov@dijksterhuisltd.co` — editor

---

*Rules are finalized. Update this file only when a new convention is established and approved.*
