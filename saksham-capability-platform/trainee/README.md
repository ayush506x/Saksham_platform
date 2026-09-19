# SAKSHAM (सक्षम) — Trainee AI Hub & Integration Tools
### Digital India & Smart India Hackathon (SIH 2026) Innovation Suite

This repository package contains the production-ready **Trainee AI Suite** customized specifically for the **Saksham National Training & Competency Platform** ([`Rajvardhan-Vajpai/Saksham-platform-`](https://github.com/Rajvardhan-Vajpai/Saksham-platform-)).

It unites two AI capabilities into a single GIGW 3.0-compliant interface for trainees:
1. **अभ्यास मित्र (AI Notes-to-MCQ Quiz Generator)**: Powered by Gemini AI. Allows trainees to paste lecture notes, SOPs, or study material to generate interactive, self-assessing MCQs with instant feedback, scoring, and explanations.
2. **प्रशिक्षक परामर्श (AI Faculty & Mentor Recommender)**: Powered by a 5-factor competency scoring engine evaluating across the **300 certified meteorological/railway trainer database**.

---

## 📁 Package Directory Structure

```text
saksham-ai-tools/
├── README.md                           # Main documentation & architecture guide
├── demo.html                           # Standalone live preview (open in any browser)
│
├── frontend/                           # Drop-in files for FRONTEND developer
│   ├── trainee-ai-hub.html             # Pre-built Trainee AI Hub HTML component
│   ├── trainee-ai-hub.css              # GIGW-compliant CSS with Saksham Gov Theme tokens
│   ├── trainee-ai-hub.js               # Interactive quiz & recommendation controller
│   └── integration-guide-frontend.md   # Step-by-step instructions for frontend team
│
└── backend/                            # Microservice for BACKEND developer
    ├── ai_service.py                   # Unified Python REST API server (CORS enabled)
    ├── engine.py                       # 5-factor competency ranking algorithm
    ├── data/
    │   └── trainers.json               # 300-trainer structured database
    ├── requirements.txt                # Lightweight dependencies
    ├── .env.example                    # Environment template with Gemini API Key
    ├── run.bat                         # One-click Windows startup
    ├── run.sh                          # One-click Linux/macOS startup
    └── integration-guide-backend.md    # Integration instructions for backend team
```

---

## 🚀 How to Run the Demo Immediately

1. Start the backend AI service:
   - On Windows: Double-click `backend/run.bat` (or run `py -3.13 backend/ai_service.py 8080`)
   - On Linux/macOS: Run `bash backend/run.sh`
2. Open `demo.html` in your web browser (Chrome, Edge, Brave, Firefox).
3. Test both tabs:
   - **Tab 1**: Select a syllabus preset or paste notes, click **"Generate AI Assessment"**, and take the interactive quiz!
   - **Tab 2**: Click a competency preset (e.g. Cyclone Warning, Doppler Radar), click **"Match Faculty"**, view scores and click **"Dossier"** to inspect complete trainer credentials.

---

## 🔗 Handoff Instructions for Your Team

### For the Frontend Team:
- Read [`frontend/integration-guide-frontend.md`](frontend/integration-guide-frontend.md).
- Copy `trainee-ai-hub.html`, `trainee-ai-hub.css`, and `trainee-ai-hub.js` into your Saksham platform repo.
- Embed the HTML component in `trainee/dashboard.html` or dynamically mount it in `js/trainee.js`.

### For the Backend Team:
- Read [`backend/integration-guide-backend.md`](backend/integration-guide-backend.md).
- Run `backend/ai_service.py` as a standalone microservice on port 8080 or reverse-proxy through Node.js / Express (`sih-imd-backend`).
- All endpoints support CORS (`Access-Control-Allow-Origin: *`) out-of-the-box.
