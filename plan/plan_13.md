# plan_13 — Legacy Cleanup & Final Verification

**Goal:** Remove all deprecated static data files and ensure the entire app relies strictly on the Firestore backend.

**Prerequisite:** plan_12 complete.

---

## Step 1 — Delete Legacy Data File

Delete `src/lib/content.ts`.

```bash
rm src/lib/content.ts
```

If you missed any imports to `content.ts` in previous plans, TypeScript will catch them in Step 3. You must replace all those imports with the server-side Firestore read functions (e.g. `getProjects()`, `getTechnologies()`) from `src/lib/firestore.ts`.

## Step 2 — Verify Unused Code

Look for any unused interfaces or hardcoded data in `src/app/page.tsx`, `src/components`, etc., and clean them up. Every single piece of data should now flow from `page.tsx` as server components passing down props.

## Step 3 — Final Build Verification

Run the strict sequence:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

If the build succeeds, the backend migration is 100% complete and failproof. The codebase now has a fully working Admin Dashboard to manage everything.

---

## Definition of Done
- No references to `content.ts` remain in the codebase.
- The Admin dashboard successfully mutates data in Firestore.
- The frontend correctly reflects changes made in the Admin dashboard.
- Build/Lint/TypeScript checks pass flawlessly.
