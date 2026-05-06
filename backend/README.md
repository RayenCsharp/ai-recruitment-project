## Backend (Flask)

Flask service for intelligent CV ranking using semantic embeddings. This backend:
- Accepts PDF CV uploads and extracts text
- Ranks candidates against job descriptions using sentence-transformers embeddings
- Provides skill matching and experience analysis

## The Ranking Model

The ranking pipeline is implemented in `backend/app.py` and combines semantic embeddings with skills and experience:

**1. Semantic Similarity (55% weight)**
- Uses `sentence-transformers` with 'all-MiniLM-L6-v2' model
- Encodes both job description and resume to embedding vectors
- Computes cosine similarity for semantic understanding
- Handles synonyms, context, and PDF formatting noise
- Range: 0 to 1 (1 = perfect semantic match)

**2. Skills Match (30% weight)**
- Explicit keyword matching of required skills in resume
- Returns matched and missing skills lists
- Coverage normalized: matched_skills / total_skills
- Range: 0 to 1

**3. Experience Score (15% weight)**
- Parses resume for years of experience ("5 years", "5+ years", "5 yrs")
- Also understands date ranges like "2015 - Present"
- Extracts job requirement years from description
- Normalizes: candidate_years / required_years (capped at 1.0)
- Range: 0 to 1

**Final Score Formula:**
```
final = 0.55 * semantic_similarity + 0.30 * skill_coverage + 0.15 * experience_score
```

Returns a score from 0 to 1.

### Why Embeddings?

Traditional TF-IDF approaches fail on:
- PDF noise and random text fragments
- Synonyms and paraphrasing
- Semantic meaning of job requirements vs. resume content

Sentence-transformers embeddings solve this:
- Understand semantic meaning, not just word frequency
- Robust to formatting artifacts from PDF extraction
- Fast inference on lightweight model (~22MB)
- Better matching between job skills and resume experiences
- Job experience fields can be appended to the description before scoring

## Quick Setup

1. Create and activate a Python virtualenv:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Run the backend:

```powershell
..\.venv\Scripts\python.exe app.py
```

Server runs on `http://localhost:5001`

## API Endpoints

- `POST /upload_cv` — multipart form with field `file` (PDF). Returns `cv_id` and a snippet of extracted text. Use this when a user uploads a CV from the UI.

Example (curl):

```bash
curl -F "file=@/path/to/CandidateCV.pdf" http://localhost:5001/upload_cv
```

- `POST /rank` — rank a candidate for a job description. Provide `job_description` and one of:
	- `cv_id` (string) — id returned by `/upload_cv`
	- `file` (multipart) — a PDF file to upload and rank in the same request
	- `resume_text` (string) — raw resume text

Example using a previously uploaded CV (`cv_id`):

```bash
curl -X POST -F "job_description=@job.txt;type=text/plain" -F "cv_id=THE_CV_ID" http://localhost:5001/rank
```

Example sending a file directly:

```bash
curl -X POST -F "job_description=@job.txt;type=text/plain" -F "file=@/path/to/CandidateCV.pdf" http://localhost:5001/rank
```

Example sending JSON with `resume_text`:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"job_description": "Senior React developer...", "resume_text": "Worked 6 years building React apps..."}' http://localhost:5001/rank
```

## Code Reference

- Core logic: [backend/app.py](backend/app.py)
	- `extract_text_from_pdf()` — PDF -> text
	- `compute_embedding_similarity()` — sentence embeddings + cosine similarity
	- `parse_experience_years()` — heuristic experience extraction
	- `compute_rank()` — combines scores and returns the final breakdown

- Uploaded files are stored in `backend/uploads/` (created automatically by the app).


## Model Components

**pdfminer.six**: PDF text extraction
- Converts PDF files to raw text for processing

**sentence-transformers**: semantic embeddings
- `SentenceTransformer` — encodes job descriptions and resumes
- `util.pytorch_cos_sim` — measures cosine similarity between embeddings

**Regular expressions**: Experience parsing
- Extracts years from patterns like "5 years", "5+ years", "5 yrs"
