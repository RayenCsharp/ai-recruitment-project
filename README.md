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

- React 19
- Vite 8
- React Router
- Tailwind CSS
- json-server (mock backend)
- ESLint

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start backend API (json-server)

```bash
npm run api
```

Runs at:

- http://localhost:3001

### 3. Start frontend (Vite)

In a separate terminal:

```bash
npm run dev
```

Runs at:

- http://localhost:5173

### Optional: run both together

```bash
npm run dev:full
```

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

## AI Ranking (Current) and Flask Migration Impact

### What the current AI does

The current AI ranking is a frontend utility in `src/utils/aiRanking.js`.

How it works:

1. Normalizes text (lowercase, remove punctuation, collapse spaces).
2. Removes simple stop words.
3. Compares CV text tokens with:
  - Required skills (`job.skills`)
  - Job description tokens (`job.description`)
4. Computes:
  - `matchedSkills`
  - `missingSkills`
  - `aiScore` using weighted formula:
    - 70% skills match
    - 30% description token overlap
5. Saves score details into each application when candidate applies.

Current flow:

- Ranking is executed in `src/pages/public/JobDetails.jsx` during apply.
- Results are stored via `src/services/applications.js` into `db.json`.
- Company applicants list sorts by `aiScore`.

### If you switch AI to Flask, what it affects

If ranking moves to Flask, frontend utility ranking should be replaced by an API call.

Main affected areas:

1. `src/pages/public/JobDetails.jsx`
  - Replace direct call to `rankCvAgainstJob` with request to Flask endpoint (for example `POST /rank`).
2. `src/services/`
  - Add/extend service function to call Flask ranking API.
3. `src/utils/aiRanking.js`
  - Becomes optional (can be deleted or kept as fallback).
4. API configuration
  - Add Flask base URL and environment config.
5. Error handling/UI
  - Add network failure handling for ranking request.
6. Data contract
  - Keep response shape aligned: `aiScore`, `matchedSkills`, `missingSkills`.

Backend-side implications with Flask:

- New Flask service routes (for example `/rank`).
- Validation and sanitization of incoming CV/job payloads.
- CORS setup so Vite frontend can call Flask.
- Optional model/versioning if you introduce a real ML model later.

Important note about existing data:

- Previous applications in `db.json` keep old stored `aiScore` values.
- To apply new Flask logic historically, you need a backfill/recompute script.

## Notes

- AI ranking is currently a frontend demo utility.
- This project uses a mock API (`json-server`) for local development.
- If port 3001 is already in use, stop the existing process or run the API on another port.

## What Was Done

This section summarizes the latest completed work in this project:

- Improved company dashboard UI and reduced metrics to 3 key stats.
- Removed the separate CV Library route and moved CV download to the Applicants page.
- Fixed applicant status actions (Accept / Interview / Reject) with proper UI feedback.
- Fixed job close/reopen behavior by updating API/service logic.
- Removed confirmation alert flow for closing jobs and replaced with smooth in-page actions.
- Improved candidate pages UI (`Dashboard`, `Applications`, `Profile`) for consistency.
- Enforced CV-required applications: candidates cannot apply unless a CV file is uploaded.
- Updated and aligned project documentation with the current implementation.
