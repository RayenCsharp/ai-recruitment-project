import os
import re
import uuid
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pdfminer.high_level import extract_text
from sentence_transformers import SentenceTransformer, util

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

# Load embedding model once on startup
model = SentenceTransformer('all-MiniLM-L6-v2')

# Simple in-memory store for uploaded CVs (id -> metadata)
CV_STORE = {}

SKILL_ALIASES = {
    'rest apis': ['rest api', 'restful api', 'restful apis', 'api', 'apis', 'rest services', 'rest service'],
    'node.js': ['node js', 'nodejs'],
    'react.js': ['react js', 'reactjs'],
    'node': ['nodejs', 'node.js'],
    'javascript': ['js'],
    'typescript': ['ts'],
    'postgresql': ['postgres'],
    'mysql': ['my sql'],
    'c#': ['c sharp'],
    'machine learning': ['ml'],
    'artificial intelligence': ['ai'],
}


def normalize_skill_text(skill: str) -> str:
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9+#.\s-]', ' ', (skill or '').lower())).strip()


def extract_text_from_pdf(path: str) -> str:
    try:
        return extract_text(path) or ''
    except Exception:
        return ''


def clean_text(text: str) -> str:
    """Remove noise, headers, footers, and formatting artifacts from extracted text."""
    if not text:
        return ''

    text = text.replace('\x0c', '\n')
    text = re.sub(r'\-\n', '', text)
    text = text.replace('\r', '\n')

    filtered_lines = []
    seen_lines = set()
    for raw_line in text.split('\n'):
        line = raw_line.strip()
        if not line:
            continue
        if re.fullmatch(r'\d+', line):
            continue
        if len(line) <= 2:
            continue
        if re.fullmatch(r'[^A-Za-z]+', line):
            continue

        lowered = line.lower()
        if lowered in seen_lines:
            continue
        seen_lines.add(lowered)
        filtered_lines.append(line)

    text = ' '.join(filtered_lines)
    # Remove URLs
    text = re.sub(r'https?://\S+', '', text)
    # Remove email-like patterns that aren't actual content
    text = re.sub(r'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}', '', text, flags=re.I)
    # Remove phone numbers
    text = re.sub(r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}', '', text)
    # Remove excessive special characters and noise
    text = re.sub(r'[^\w\s\-.,;:]', ' ', text)
    # Remove multiple spaces/newlines
    text = re.sub(r'\s+', ' ', text)

    return text.strip()



def parse_experience_years(text: str) -> int:
    """Extract years of experience from text."""
    matches = re.findall(r"(\d{1,2})\s*\+?\s*(?:years|yrs|year|y\.o\.)\b", text, flags=re.I)
    if matches:
        nums = [int(m) for m in matches]
        return max(nums)

    year_ranges = re.findall(r'(20\d{2})\s*[-–—]\s*(present|current|now|20\d{2})', text, flags=re.I)
    if year_ranges:
        current_year = 2026
        spans = []
        for start_year, end_year in year_ranges:
            start = int(start_year)
            end = current_year if end_year.lower() in {'present', 'current', 'now'} else int(end_year)
            if end >= start:
                spans.append(end - start)
        if spans:
            return max(spans)

    m = re.search(r"experience\D{0,10}(\d{1,2})", text, flags=re.I)
    if m:
        return int(m.group(1))
    return 0


def parse_required_experience(job_desc: str) -> int:
    """Extract required years of experience from job description."""
    patterns = [
        r'(?:minimum|min|at least|require(?:d)?|needs?)\D{0,10}(\d{1,2})\s*\+?\s*(?:years|yrs|year)',
        r'(\d{1,2})\s*\+?\s*(?:years|yrs|year)\s*(?:of)?\s*experience',
    ]
    vals = []
    for p in patterns:
        vals.extend([int(x) for x in re.findall(p, job_desc or '', flags=re.I)])
    return max(vals) if vals else 0


def compute_embedding_similarity(job_desc: str, resume_text: str) -> float:
    """Compute semantic similarity using sentence embeddings."""
    try:
        # Clean texts to reduce noise
        job_clean = clean_text(job_desc)
        resume_clean = clean_text(resume_text)
        
        if not job_clean or not resume_clean:
            return 0.0
        
        # Encode both texts
        job_embedding = model.encode(job_clean, convert_to_tensor=True)
        resume_embedding = model.encode(resume_clean, convert_to_tensor=True)
        
        # Compute cosine similarity (returns 0-1)
        similarity = float(util.pytorch_cos_sim(job_embedding, resume_embedding)[0][0])
        return max(0.0, min(similarity, 1.0))
    except Exception:
        return 0.0


def compute_skill_overlap(job_skills, resume_text: str):
    """Compute matched and missing skills."""
    if not isinstance(job_skills, list):
        return [], [], 0.0
    
    resume_clean = clean_text(resume_text)
    resume_lower = resume_clean.lower()
    
    matched = []
    missing = []
    
    for raw_skill in job_skills:
        skill = normalize_skill_text(str(raw_skill or ''))
        if not skill:
            continue

        skill_variants = [skill] + SKILL_ALIASES.get(skill, [])
        
        # Check if skill or close variants appear in resume
        if any(variant and variant in resume_lower for variant in skill_variants):
            matched.append(raw_skill)
        else:
            missing.append(raw_skill)
    
    coverage = (len(matched) / len(job_skills)) if job_skills else 0.0
    return matched, missing, coverage


def compute_experience_score(job_desc: str, resume_text: str):
    """Score experience: compare required vs candidate years."""
    required_years = parse_required_experience(job_desc)
    candidate_years = parse_experience_years(resume_text)
    
    if required_years > 0:
        ratio = candidate_years / required_years if required_years else 0
        score = max(0.0, min(ratio, 1.0))
    else:
        # If requirement not explicit, reward experience up to cap (15 years)
        score = min(candidate_years, 15) / 15.0
    
    return required_years, candidate_years, score


def secure_filename(name: str) -> str:
    # Very small, safe filename sanitizer
    return re.sub(r'[^a-zA-Z0-9._-]', '_', name)


def compute_rank(job_desc: str, resume_text: str, job_skills=None) -> dict:
    """Compute ranking score using embeddings + skills + experience."""
    
    # Semantic similarity (main signal)
    semantic_score = compute_embedding_similarity(job_desc, resume_text)
    
    # Skills match
    matched_skills, missing_skills, skill_coverage = compute_skill_overlap(job_skills or [], resume_text)
    
    # Experience match
    required_years, candidate_years, exp_score = compute_experience_score(job_desc, resume_text)
    
    # Final score: keep semantic as the main signal, but give skills more room.
    final = (0.55 * semantic_score) + (0.30 * skill_coverage) + (0.15 * exp_score)
    
    return {
        'final_score': round(final, 4),
        'semantic_score': round(semantic_score, 4),
        'skill_coverage': round(skill_coverage, 4),
        'required_experience_years': required_years,
        'experience_years': candidate_years,
        'experience_score': round(exp_score, 4),
        'matched_skills': matched_skills,
        'missing_skills': missing_skills,
    }



@app.route('/upload_cv', methods=['POST'])
def upload_cv():
    if 'file' not in request.files:
        return jsonify({'error': 'no file part'}), 400
    f = request.files['file']
    if f.filename == '':
        return jsonify({'error': 'no selected file'}), 400
    uid = uuid.uuid4().hex
    filename = f'{uid}_{secure_filename(f.filename)}'
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    f.save(path)
    text = extract_text_from_pdf(path)
    CV_STORE[uid] = {'filename': filename, 'path': path, 'text': text}
    return jsonify({'cv_id': uid, 'text_snippet': clean_text(text)[:2000]}), 201


@app.route('/rank', methods=['POST'])
def rank():
    body = request.get_json(silent=True) or {}
    
    job_desc = request.form.get('job_description') or body.get('job_description')
    if not job_desc:
        return jsonify({'error': 'job_description required'}), 400

    job_experience = request.form.get('job_experience') or body.get('job_experience')
    if job_experience:
        job_desc = f"{job_desc}\nExperience requirement: {job_experience}"
    
    raw_skills = request.form.get('job_skills')
    job_skills = body.get('job_skills')
    if raw_skills and not job_skills:
        cleaned = raw_skills.strip()
        if cleaned.startswith('[') and cleaned.endswith(']'):
            cleaned = cleaned[1:-1]
        job_skills = [s.strip().strip('"\'') for s in cleaned.split(',') if s.strip()]
    
    resume_text = ''
    if 'cv_id' in request.form:
        cv_id = request.form.get('cv_id')
        record = CV_STORE.get(cv_id)
        if not record:
            return jsonify({'error': 'cv_id not found'}), 404
        resume_text = record.get('text', '')
    elif 'file' in request.files:
        f = request.files['file']
        uid = uuid.uuid4().hex
        filename = f'{uid}_{secure_filename(f.filename)}'
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        f.save(path)
        resume_text = extract_text_from_pdf(path)
    else:
        resume_text = request.form.get('resume_text') or body.get('resume_text')
    
    if not resume_text:
        return jsonify({'error': 'no resume provided'}), 400
    
    result = compute_rank(job_desc, resume_text, job_skills=job_skills)
    result['resume_snippet'] = clean_text(resume_text)[:1200]
    return jsonify(result)


@app.route('/download_cv/<cv_id>', methods=['GET'])
def download_cv(cv_id: str):
    """Download the original PDF file for a CV."""
    if cv_id not in CV_STORE:
        return jsonify({'error': 'CV not found'}), 404
    
    cv_data = CV_STORE[cv_id]
    cv_path = cv_data['path']
    original_filename = cv_data['filename'].split('_', 1)[1] if '_' in cv_data['filename'] else cv_data['filename']
    
    if not os.path.exists(cv_path):
        return jsonify({'error': 'File not found on server'}), 404
    
    try:
        return send_file(cv_path, as_attachment=True, download_name=original_filename, mimetype='application/pdf')
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
