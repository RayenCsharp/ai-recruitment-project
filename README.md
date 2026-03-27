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
