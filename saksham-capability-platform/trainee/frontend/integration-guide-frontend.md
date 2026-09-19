# SAKSHAM Trainee AI Hub — Frontend Integration Guide
### Tailored for Rajvardhan's Saksham Platform (`Rajvardhan-Vajpai/Saksham-platform-`)

This module provides two AI capabilities for trainees:
1. **Notes-to-MCQ Practice**: Allows trainees to paste lecture notes/SOPs and generate interactive quizzes with instant answer feedback and scoring.
2. **Faculty & Mentor Match**: Evaluates course competencies against all 300 national certified trainers to find and recommend the top faculty.

Both tools are designed strictly according to your platform's design system (`Poppins` + `Inter`, Navy `#0A2647`, Saffron `#E8590C`, Teal `#0F766E`, Cream `#FAF7F0`).

---

## Method 1: Dedicated Trainee Page (Recommended — 2 Minutes)

We have already created a complete page ready to drop into your repo!

1. **Copy Files into your repo**:
   - Copy `frontend/ai-hub.html` -> into your repo's `frontend/trainee/ai-hub.html`
   - Copy `frontend/trainee-ai-hub.css` -> into your repo's `frontend/assets/css/trainee-ai-hub.css`
   - Copy `frontend/trainee-ai-hub.js` -> into your repo's `frontend/assets/js/trainee-ai-hub.js`
   - Copy `frontend/trainee-ai-hub.html` -> into your repo's `frontend/trainee/trainee-ai-hub.html`

2. **Add Sidebar Link in `assets/js/layout.js`**:
   In `assets/js/layout.js`, add `AI Study Hub` to `NAV_BY_ROLE.trainee`:
   ```javascript
   const NAV_BY_ROLE = {
     trainee: [
       { href: "dashboard.html", icon: "dashboard", label: "Dashboard" },
       { href: "profile.html", icon: "profile", label: "My Profile" },
       { href: "courses.html", icon: "courses", label: "Courses" },
       { href: "assessment.html", icon: "assess", label: "Assessments" },
       { href: "ai-hub.html", icon: "competency", label: "AI Study Hub" }  // <--- ADD THIS
     ],
     // ...
   };
   ```

3. **Done!** Clicking "AI Study Hub" in the sidebar opens the full AI learning desk.

---

## Method 2: Embed into Existing `trainee/dashboard.html`

If you want the AI tools embedded directly on the main dashboard:

1. In `trainee/dashboard.html`, link the CSS in `<head>`:
   ```html
   <link rel="stylesheet" href="../../css/trainee-ai-hub.css">
   ```

2. Paste the contents of `trainee-ai-hub.html` where you want it inside `.app-content` (for example, above or below `.grid-4` KPIs).

3. Include the JS script before `</body>`:
   ```html
   <script>
     window.SAKSHAM_AI_API_URL = 'http://localhost:8080';
   </script>
   <script src="../../js/trainee-ai-hub.js"></script>
   ```

---

## Configuration

If your Python AI microservice is deployed on a custom port or domain, simply set:
```javascript
window.SAKSHAM_AI_API_URL = 'http://your-backend-domain:8080';
```
If the backend is temporarily offline, the component automatically switches to client-side fallback validation so the frontend never crashes.
