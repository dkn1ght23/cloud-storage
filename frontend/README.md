# CloudVault — Frontend

CloudVault is a minimal cloud storage web app built as a cloud computing project.  
The frontend is a **Next.js (App Router) + TypeScript + shadcn/ui** application that lets users:

- Upload files
- View a list of stored files
- Download files
- Delete files

All actions are performed via a REST API backed by AWS S3.

---

## 1. Tech Stack

- **Framework:** Next.js (App Router) + React
- **Language:** TypeScript
- **UI Library:** shadcn/ui + Tailwind CSS
- **HTTP Client:** Fetch API / Axios (depending on your implementation)
- **Icons:** Lucide / React icons
- **State:** Local React state (no heavy state management library)

---

## 2. Project Structure (High Level)

> Adjust names if they differ in your repo.

```bash
cloudvault-frontend/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx              # Home page (project intro + CTA)
│  └─ files/
│     └─ page.tsx           # Main File Manager UI
├─ components/
│  ├─ ui/                   # shadcn/ui components
│  ├─ file-table.tsx        # Table/list view of files
│  ├─ upload-dialog.tsx     # Upload modal / dropzone
│  └─ navbar.tsx
├─ lib/
│  ├─ api.ts                # API helpers (fetching files, upload, delete)
│  └─ types.ts              # Shared TS types (e.g., StoredFile)
├─ public/
│  └─ ...                   # Logos, meta images
├─ styles/
│  └─ globals.css
├─ .env.local               # Frontend env vars (not committed)
├─ package.json
└─ tsconfig.json


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
