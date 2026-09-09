# plan_02 — Install npm Packages

**Goal:** Install all third-party packages required by the Firebase backend, Cloudinary media upload, admin UI, and blog editor. No source code changes — only `package.json` and `package-lock.json` are modified.

**Prerequisite:** plan_01 complete.

---

## Step 1 — Install runtime packages

Run this command from the project root:

```bash
npm install firebase-admin @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-text-align @tiptap/extension-link sanitize-html cloudinary
```

**What each package does:**

| Package | Purpose |
|---|---|
| `firebase-admin` | Firebase Admin SDK for server-side Firestore and Admin access |
| `@tiptap/react` | React bindings for the Tiptap editor |
| `@tiptap/pm` | ProseMirror peer dependency required by Tiptap |
| `@tiptap/starter-kit` | Bundles: Headings (H1-H6), Bold, Italic, BulletList, OrderedList, CodeBlock, Blockquote, HardBreak, HorizontalRule, History |
| `@tiptap/extension-underline` | Underline formatting |
| `@tiptap/extension-text-align` | Left / Center / Right / Justify alignment |
| `@tiptap/extension-link` | Hyperlink insertion |
| `sanitize-html` | Server-side HTML sanitization for blog body rendering |
| `cloudinary` | Server-side media & resume PDF upload handler |

---

## Step 2 — Install dev-only type packages

```bash
npm install --save-dev @types/sanitize-html
```

---

## Step 3 — Verify installation

Check that the packages appear in `package.json`:

```bash
npm ls @tiptap/react @tiptap/starter-kit sanitize-html cloudinary
```

Expected output: each package listed with a version number and no unmet peer dependency errors.

---

## Verification

Run the verification sequence:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

All three must pass.

---

## Done checklist

- [ ] `npm install` command ran without errors
- [ ] `npm install --save-dev @types/sanitize-html` ran without errors
- [ ] Packages appear in `package.json` dependencies
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
