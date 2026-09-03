# Firebase admin deployment setup

Project: `beeportfolio-2f6f0`

## Required Vercel environment variables

Copy the values in `.env.local` to Vercel for Production, Preview, and Development. Also add a long, unique `ADMIN_BASIC_AUTH_USERNAME` and `ADMIN_BASIC_AUTH_PASSWORD`.

## Firestore collections

- `site/profile` — name, role line, contact links, SEO settings
- `projects/{slug}` — title, summary, description, tags, image, videoUrl, links, visibility, order
- `posts/{slug}` — title, excerpt, body, category, coverImage, publishedAt, visibility
- `experience/{id}` — role, company, startDate, endDate, order
- `technologies/{id}` — category, items, order
- `testimonials/{id}` — quote, name, role, company, avatarUrl, visibility, order
- `agentDrafts/{id}` — message, source, createdAt

Use Firebase Storage paths `project-media/{projectSlug}/{fileName}` for muted looping project videos. Store the download URL in `projects/{slug}.videoUrl`; limit accepted uploads to MP4/WebM and validate file size in the admin client.

## Firestore rules

Basic Auth protects the Next.js admin page, but it does not authenticate Firebase SDK requests. Before enabling writes, create Firebase Authentication for your admin identity and replace the placeholder UID below.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() { return request.auth != null && request.auth.uid == "REPLACE_WITH_FIREBASE_ADMIN_UID"; }
    match /{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /agentDrafts/{draft} { allow create: if true; allow read, update, delete: if isAdmin(); }
  }
}
```

## Storage rules

```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /project-media/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == "NgklmrS1z8U521oanqndFgSfDYq2" && request.resource.size < 52428800 && request.resource.contentType.matches('video/(mp4|webm)');
    }
  }
}
```

Never deploy the permissive Firebase test rules.
