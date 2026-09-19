# SAKSHAM (सक्षम) — National Workforce Capability & Competency Mapping Platform
**Smart India Hackathon (SIH 2026) Official Project Submission**  
*Aligned with the Capacity Building Commission (CBC) & Mission Karmayogi Framework*

---

## 1. Executive Summary

Most hackathon platforms build generic "course + quiz + certificate" portals (clones of Coursera or Moodle). **SAKSHAM** fundamentally shifts the paradigm from content delivery to **institutional workforce capability governance**:

1. **Competency Mapping (Not Just LMS)**: Evaluates certified master trainers against statutory subject prerequisites using a multi-factor regression algorithm to identify the optimal faculty fit.
2. **Institutional Capacity Building as the Goal**: Admin dashboards track capability gaps at an organizational and Ministry level (Department of Expenditure, MeitY, MoRTH, DoPT) rather than treating civil servants as isolated test-takers.
3. **Approval-Gated Bureaucratic Role Workflows**: Replicates actual government vetting (e.g. ISTM/CBC accreditation), requiring administrative clearance of doctoral degrees and cadre NOCs before instructors can publish courses or assessments.
4. **Resilient Zero-Fail Architecture**: Built as a pure, zero-dependency modern web application with persistent local state (`localStorage`) and instant role-switching for judges, eliminating runtime crashes and cloud auth lockouts during live evaluation.
5. **Interactive Government Assistant ("Saksham Saathi")**: Virtual training assistant grounded in GFR 2017, iGOT Karmayogi rules, and statutory certification procedures.

---

## 2. Platform Architecture

```
saksham-capability-platform/
├── index.html              # Government portal layout (GIGW 3.0 compliant)
├── assets/
│   └── emblem.svg          # State Emblem of India (Ashoka Lion Capital)
├── css/
│   ├── gov-theme.css       # Official Gov of India palette, tricolor, accessible typography
│   ├── layout.css          # Top accessibility strip, header, SIH judge switcher, sidebar, footer
│   └── components.css      # KPI metric cards, official tables, timed exam UI, radar charts, modals
└── js/
    ├── store.js            # Reactive central state store with realistic Gov of India datasets
    ├── auth.js             # Clerk-ready auth simulation & approval gate clearance engine
    ├── trainee.js          # Trainee profile builder, catalog search, timed MCQ exam & certificates
    ├── trainer.js          # Trainer qualifications, questionnaire creator, early-warning monitor, library
    ├── admin.js            # Verification desk, user directory, capacity dashboards, gazette publishing
    ├── competency.js       # Core Hero Feature: Multi-factor Trainer-to-Subject Competency Mapping
    ├── recommendation.js   # Cadre & gap-based course recommendations with administrative rationale
    ├── chatbot.js          # "Saksham Saathi" (सक्षम साथी) interactive virtual desk assistant
    └── app.js              # Application coordinator, routing, modals & judge presentation brief
```

---

## 3. How to Run Locally

Because SAKSHAM is built with standard web standards and zero external build tools, it runs immediately in any modern browser without installing packages:

### Option A: Via Python Local Server (Recommended)
Open PowerShell or Command Prompt in the project folder and run:
```powershell
py -m http.server 8080 --directory "C:\Users\mishr\.gemini\antigravity-ide\scratch\saksham-capability-platform"
```
Then open your browser to:
```
http://localhost:8080
```

### Option B: Direct File Launch
Simply double click `index.html` or open it directly in Google Chrome, Microsoft Edge, or Firefox.

---

## 4. Key Workflows to Present to SIH Judges

### Workflow 1: Instant Role Switcher & SIH Pitch Brief
- Use the dark-blue **SIH 2026 Evaluation Bar** at the top.
- Click **"SIH Pitch & Judge Brief"** to pull up the one-pager pitch breakdown highlighting the core differences between Saksham and generic LMS platforms.
- Click any persona to instantly switch between:
  - **Trainee (Amit Verma)**: Under Secretary, Ministry of Finance.
  - **Trainer (Dr. Priya V.)**: Senior Faculty, ISTM / DoPT.
  - **Admin (Sh. R.K. Sharma)**: Joint Secretary, Capacity Building Commission.
  - **Applicant (Pending Clearance)**: Demonstrates the administrative approval gate.

### Workflow 2: Administrative Approval Gate
1. Switch role to **"Applicant (Pending Clearance)"**.
2. Notice the official government clearance screen: *Application Under Administrative Verification (Ref: SAKSHAM/2026/TR-8841)*.
3. Switch role to **"Admin (Sh. R.K. Sharma)"** and open **"Verification Desk"**.
4. Review Dr. Vikram Malhotra's credentials and click **"Approve & Accredit"**.
5. Switch back to that user; their dashboard immediately unlocks!

### Workflow 3: Competency Mapping Engine (Core Innovation)
1. Navigate to **"Competency Mapping"** in the sidebar.
2. Select a target statutory domain: e.g., *"Public Procurement & General Financial Rules (GFR 2017)"*.
3. Observe how the engine ranks trainers (Dr. Priya Venkatesh scores **96% Fit**).
4. Inspect the 4-factor radar breakdown:
   - Domain Qualification Relevance (95%)
   - Public Service Field Experience (90%)
   - Trainee Pedagogical Satisfaction (98%)
   - Secretariat Batch Throughput (100%)
5. Click **"Assign as Lead Instructor"** to trigger official administrative designation.
6. Scroll down to inspect the **Institutional Workforce Capability Gap Matrix** across Ministries.

### Workflow 4: Trainee Timed MCQ Exam & Official Certificate
1. Switch to **"Trainee (Amit Verma)"**.
2. Click **"Take Exam"** next to *General Financial Rules (GFR 2017)*.
3. Observe the official exam interface with the live countdown clock and question palette.
4. Answer questions (or flag for review), then click **"Submit Assessment"**.
5. Review the instant scorecard and click **"Download Official Certificate"** to view the verifiable *Certificate of Competency* issued under the Mission Karmayogi framework.

### Workflow 5: Cadre-Specific Course Recommendations
1. On the Trainee Desk, inspect **"Recommended Training for Your Cadre"**.
2. Notice the explicit administrative reasons:
   - *"Statutory Mandate for Under Secretary Cadre"*
   - *"Directly bridges Ministry Skill Gap: GeM Reverse Auctioning"*
3. Click **"One-Click Enroll"** to register with Department Training Sponsorship.

### Workflow 6: "Saksham Saathi" Virtual Assistant
1. Click the floating **"सक्षम साथी / Saksham Saathi"** button at the bottom-right.
2. Click any of the prompt chips (e.g., *"How does Competency Mapping work?"* or *"What is the Approval Gate for Trainers?"*).
3. The chatbot returns official, grounded policy explanations.

---

## 5. Guidelines for Indian Government Websites (GIGW) Compliance
- Tricolor top border strip.
- Accessibility toolbar: A- / A / A+ text sizing, high contrast mode toggle, screen reader skip links.
- Bilingual labels (हिन्दी / English) for authentic administrative credibility.
- Clean typography and authoritative layout avoiding flashy, generic AI template aesthetics.
