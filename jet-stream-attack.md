---

description: Full build-review-document cycle. Exia builds, Setsuna reviews, Seiai documents. Use for any new feature or client deliverable.

---



Execute a full build-review-document cycle for: $ARGUMENTS



\## Step 1 — Exia builds

Use the exia subagent to implement the requested feature.

\- Read CLAUDE.md first

\- Load relevant skills

\- Write production-ready code

\- Report back with all files changed and a summary



\## Step 2 — Setsuna reviews

Use the setsuna subagent to review Exia's output.

\- Check all changed files against CLAUDE.md conventions

\- Flag any issues: architecture → correctness → performance → style

\- Return a list of issues with exact file, line, and fix



\## Step 3 — Exia fixes

Use the exia subagent to apply Setsuna's fixes.

\- Apply every flagged issue

\- No new changes outside the fix scope



\## Step 4 — Seiai documents

Use the seiai subagent to update or generate CLAUDE.md.

\- Reflect any new patterns introduced in this feature

\- Update Common Gotchas if anything tricky was discovered



Do not proceed to next step until current agent reports complete.

