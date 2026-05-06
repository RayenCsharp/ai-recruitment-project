# AI Recruitment Project

A role-based recruitment platform built with React + Vite, with a local JSON API.

## Overview

This app supports two roles:

- Candidate
- Company

Main workflow:

1. Company posts and manages jobs.
2. Candidate browses jobs and applies.
3. CV text is ranked against job requirements (demo AI logic).
4. Company reviews ranked applicants and updates statuses.

## Current Features

### Candidate

- Candidate dashboard with application stats and recent activity.
- Applications page with status badges.
- Profile page with account details.
- Job details page with CV upload + CV text area.
- **Apply is blocked unless a CV file is uploaded.**
- Closed jobs cannot be applied to.

### Company

- Company dashboard with 3 stats:
  - Open Jobs
  - Total Applicants
  - Interviews
- Post new jobs.
- My Jobs page with open/closed filtering.
- Edit existing jobs.
- Close and reopen jobs.
- Applicants page:
  - Filter by job
  - AI-ranked list
  - Matched/missing skills
  - Status actions (Accept / Interview / Reject)
  - CV download button

### Public

- Home page
- Jobs listing page with empty-state UI when no jobs are available
- Job details page
- Login / Register pages

## Tech Stack

**Frontend:**
- React 19
- Vite 8
- React Router
- Tailwind CSS
- ESLint

**Backend:**
- Flask 2.2.5 (PDF upload + AI ranking)
- pdfminer.six (PDF text extraction)
- sentence-transformers (semantic embeddings for CV ranking)
- json-server (mock API for users/jobs/applications data)

## Local Development

You need **3 services** running:

### 1. Install dependencies

```bash
npm install
cd backend && ..\.venv\Scripts\python.exe -m pip install -r requirements.txt && cd ..
```

### 2. Start Flask backend (AI + PDF upload)

```powershell
cd backend
..\.venv\Scripts\python.exe app.py
```

Runs at:

- http://localhost:5001
- Endpoints: `POST /upload_cv`, `POST /rank`

### 3. Start json-server API (in a new terminal)

```bash
npm run api
```

Runs at:

- http://localhost:3001
- Stores users, jobs, applications data

### 4. Start frontend (Vite) (in a new terminal)

```bash
npm run dev
```

Runs at:

- http://localhost:5173

### Optional: run frontend + json-server together

```bash
npm run dev:full
```

(Note: This does NOT start Flask; you must run Flask manually.)

## Available Scripts

- `npm run dev` - start Vite frontend
- `npm run api` - start json-server backend on port 3001
- `npm run dev:full` - start frontend + backend together
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Data Model (`db.json`)

### users

- `id`
- `name`
- `email`
- `password`
- `role` (`candidate` or `company`)

### jobs

- `id`
- `title`
- `description`
- `skills` (array)
- `experience`
- `location`
- `company`
- `companyEmail`
- `status` (`Open` or `Closed`)
- `datePosted`

### applications

- `id`
- `jobId`
- `title`
- `company`
- `companyEmail`
- `userEmail`
- `candidateName`
- `cvFile`
- `cvText`
- `aiScore`
- `matchedSkills` (array)
- `missingSkills` (array)
- `status` (`Pending`, `Interview`, `Accepted`, `Rejected`)

## AI Ranking Architecture

### How it works now

**Current approach:** Flask backend only

1. **PDF Upload** → Flask `/upload_cv` endpoint
   - Extracts text using `pdfminer.six`
   - Stores CV in memory with unique `cv_id`
   - Returns extracted text snippet

2. **Ranking** → Flask `/rank` endpoint
   - Input: job description + resume text (or `cv_id`)
   - Sentence-transformers embeddings + cosine similarity
   - Skill normalization and synonym matching
   - Experience parsing from years and date ranges
   - Output: `final_score` (0–1 scale)

3. **Application Storage**
   - Ranking result stored in `db.json` via json-server
   - Company applicants sorted by `aiScore`

### Flask Ranking Details

**File:** `backend/app.py`

**Endpoints:**

- `POST /upload_cv` — multipart form with `file` (PDF). Returns `cv_id` and text snippet.
- `POST /rank` — form fields: `job_description` and one of `cv_id` or `file` or `resume_text`. Returns ranking breakdown.

**Scoring:**
- 55% semantic similarity
- 30% skill coverage
- 15% experience (years parsed heuristically)
- Final score: 0–1 (converted to 0–100 for display)

### Customizing Ranking

Edit `backend/app.py`:
- `compute_rank()` — adjust weight formula
- `parse_experience_years()` — refine experience extraction
- `compute_embedding_similarity()` — tune semantic matching

## Notes

- Flask backend is required for PDF upload and TF-IDF ranking.
- Flask backend is required for PDF upload and embeddings-based ranking.
- json-server stores users, jobs, and applications data (mock API).
- If port 3001 is in use, modify `package.json` json-server script.
- If port 5001 is in use, modify `backend/app.py` port number.
- Uploaded CVs stored in `backend/uploads/` (not persisted across restarts).

## What Was Done

This section summarizes the latest completed work in this project:

### Flask Integration (Latest)
- Created Flask backend (`backend/app.py`) with PDF upload & AI ranking.
- Added `/upload_cv` endpoint: accepts PDF, extracts text using pdfminer, returns `cv_id`.
- Added `/rank` endpoint: accepts job description + resume, returns embeddings score + experience breakdown.
- Wired React frontend (`JobDetails.jsx`) to upload CVs to Flask and call `/rank` for ranking.
- Backend ranking is the only ranking path.
- Scoring: 55% semantic similarity + 30% skill coverage + 15% experience.

### Previous Work
- Improved company dashboard UI and reduced metrics to 3 key stats.
- Removed the separate CV Library route and moved CV download to the Applicants page.
- Fixed applicant status actions (Accept / Interview / Reject) with proper UI feedback.
- Fixed job close/reopen behavior by updating API/service logic.
- Removed confirmation alert flow for closing jobs and replaced with smooth in-page actions.
- Improved candidate pages UI (`Dashboard`, `Applications`, `Profile`) for consistency.
- Enforced CV-required applications: candidates cannot apply unless a CV file is uploaded.
- Updated and aligned project documentation with the current implementation.


