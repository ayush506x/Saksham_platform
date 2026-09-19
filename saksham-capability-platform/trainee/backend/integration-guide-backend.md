# SAKSHAM AI Microservice — Backend Integration Guide

This directory contains the unified Python AI microservice powering both **Notes-to-MCQ Generation** and **Trainer Competency Recommendation** for the SAKSHAM platform.

---

## 1. Quick Start

### Option A: Run Standalone Python Service (Recommended)
```bash
# 1. Install dependencies (Python 3.10+)
pip install -r requirements.txt

# 2. Configure environment (optional, defaults provided)
cp .env.example .env

# 3. Start server (runs on port 8080 by default)
# On Windows:
run.bat
# Or:
py -3.13 ai_service.py 8080

# On Linux / macOS:
chmod +x run.sh
./run.sh
```

---

## 2. API Endpoints Reference

All endpoints support cross-origin requests (`Access-Control-Allow-Origin: *`).

### Endpoint 1: Health & Diagnostics
- **Method**: `GET /api/ai/health`
- **Response**:
```json
{
  "status": "healthy",
  "service": "SAKSHAM AI Competency & Learning Engine",
  "version": "2.0.0",
  "total_trainers": 300,
  "gemini_configured": true
}
```

---

### Endpoint 2: Notes-to-MCQ Generation
- **Method**: `POST /api/ai/generate-mcq`
- **Request Body**:
```json
{
  "notes": "Tropical cyclones in the North Indian Ocean originate during pre-monsoon (April-June) and post-monsoon (October-December) seasons. The India Meteorological Department issues 4-stage warnings.",
  "num_questions": 3,
  "difficulty": "Medium",
  "api_key": "optional_override_key"
}
```
- **Response**:
```json
{
  "status": "ok",
  "ai_powered": true,
  "model": "Gemini 2.0 Flash",
  "difficulty": "Medium",
  "count": 3,
  "questions": [
    {
      "id": 1,
      "question": "During which seasons do tropical cyclones primarily form in the North Indian Ocean?",
      "options": [
        "A) Pre-monsoon and post-monsoon",
        "B) Peak southwest monsoon only",
        "C) Winter solstice only",
        "D) Late autumn exclusively"
      ],
      "correct_index": 0,
      "correct_answer": "A) Pre-monsoon and post-monsoon",
      "explanation": "Tropical cyclogenesis in the NIO exhibits a bi-modal peak during pre-monsoon (Apr-Jun) and post-monsoon (Oct-Dec)."
    }
  ]
}
```

---

### Endpoint 3: Trainer Competency Recommendation
- **Method**: `POST /api/ai/recommend-trainers`
- **Request Body**:
```json
{
  "subject": "Doppler Weather Radar & Nowcasting",
  "required_skills": ["radar data", "nowcasting"],
  "min_experience_years": 8,
  "top_n": 3
}
```
- **Response**:
```json
{
  "status": "ok",
  "evaluated_trainers": 300,
  "recommended_trainers": [
    {
      "rank": 1,
      "trainer_id": "TRN20260049",
      "name": "Dr. Aman Verma",
      "designation": "Scientist E",
      "department": "Climate Services",
      "station": "Bengaluru",
      "match_score": 83.3,
      "breakdown": {
        "skill_match_K": 70.0,
        "experience_match_E": 100.0,
        "rating_R": 98.0,
        "availability_A": 70.0,
        "teaching_experience_T": 86.0
      },
      "why_match": "Dr. Aman Verma matches with a 83.3/100 score, offering 17 years experience and demonstrated radar data competencies."
    }
  ]
}
```

---

## 3. Integrating with Node.js / Express Backend

If your team runs an Express / Node.js API server (e.g. `sih-imd-backend`), you can reverse-proxy requests or call the Python service internally:

```javascript
// Express route proxy example
const express = require('express');
const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8080';

// Proxy MCQ Generation
router.post('/api/ai/generate-mcq', async (req, res) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/ai/generate-mcq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'AI microservice unavailable', details: err.message });
  }
});

module.exports = router;
```

---

## 4. Production Deployment

### Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["python", "ai_service.py", "8080"]
```
