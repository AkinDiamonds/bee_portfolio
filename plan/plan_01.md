# plan_01 — Firebase Console & Cloudinary Setup & Environment Variables

**Goal:** Configure Firebase project for Admin SDK access (service account + Firestore rules), set up free Cloudinary media storage (for project demo images/videos and resume), and add the required env vars to `.env.local`.

**No code changes.** This plan is entirely manual setup steps in the Firebase Console, Cloudinary Dashboard, and your `.env.local` file.

**Prerequisite:** None. Do this first.

---

## Step 1 — Generate a Firebase service account key

1. Open https://console.firebase.google.com and select project **beeportfolio-2f6f0**.
2. Click the gear icon (top-left) → **Project settings**.
3. Click the **Service accounts** tab.
4. Under "Firebase Admin SDK", click **Generate new private key**.
5. Click **Generate key** in the confirmation dialog.
6. A JSON file downloads to your computer. Open it in a text editor.
7. The file looks like this (example — your values will differ):

```json
{
  "type": "service_account",
  "project_id": "beeportfolio-2f6f0",
  "private_key_id": "abc123",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@beeportfolio-2f6f0.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  ...
}
```

8. Make this entire JSON fit on a **single line** for the env variable:
   Run this in PowerShell to collapse it:

```powershell
(Get-Content "C:\Users\HP\Downloads\beeportfolio-2f6f0-firebase-adminsdk-*.json" -Raw) -replace "`r`n", "" -replace "`n", "" | Set-Clipboard
```

   (Replace the filename glob with the actual filename of the downloaded file.)
   This copies the single-line JSON string to your clipboard.

---

## Step 2 — Set up Cloudinary (100% Free Tier — No Credit Card Required)

Cloudinary handles project demo videos, demo images, and resume storage without requiring a Firebase Blaze / paid subscription.

1. Go to https://cloudinary.com and sign up for a free account (or log in if you have one).
2. Go to your **Cloudinary Dashboard / Console** (https://console.cloudinary.com).
3. Under **Product Environment Credentials**, copy:
   - **Cloud name**
   - **API Key**
   - **API Secret**

---

## Step 3 — Add env vars to `.env.local`

Open `c:\Dev\projects\personal\bee_portfolio\.env.local` and add these lines at the end:

```env
FIREBASE_ADMIN_SERVICE_ACCOUNT=<paste the single-line JSON here>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

Do not commit `.env.local`. It is in `.gitignore`.

---

## Step 4 — Set Firestore security rules

1. In the Firebase Console sidebar, click **Firestore Database**.
2. Click the **Rules** tab.
3. Replace the entire rules content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

**Explanation:** Public reads are allowed (the portfolio website is public). Direct client-side writes are blocked for all clients because all writes go through the Firebase Admin SDK in Next.js API routes, which bypasses client rules securely.

4. Click **Publish**.

---

## Step 5 — Restart the dev server

Stop the running `npm run dev` process (Ctrl+C in the terminal), then restart it:

```bash
npm run dev
```

This ensures Next.js loads the new environment variables from `.env.local`.

---

## Verification

Run the verification sequence to confirm the environment is clean:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

All three must pass with zero errors.

---

## Done checklist

- [ ] Firebase Service account JSON downloaded
- [ ] `FIREBASE_ADMIN_SERVICE_ACCOUNT` added to `.env.local` as a single-line JSON string
- [ ] Cloudinary free account created
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` added to `.env.local`
- [ ] Firestore rules set to public-read / no-write
- [ ] Dev server restarted
- [ ] Verification commands pass
