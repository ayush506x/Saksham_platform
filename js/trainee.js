/* ==========================================================================
   SAKSHAM (सक्षम) - Trainee Module
   Profile Builder, Course Catalog, Resource Player, Timed MCQ Exam, Feedback
   ========================================================================== */

class SakshamTraineeModule {
  constructor() {
    this.store = window.sakshamStore;
    this.currentExamState = null;
    this.examTimerInterval = null;
  }

  renderDashboard() {
    const user = this.store.getCurrentUser();
    const enrollments = this.store.data.enrollments.filter(e => e.userId === user.id);
    const completed = enrollments.filter(e => e.status === 'COMPLETED');
    const inProgress = enrollments.filter(e => e.status === 'IN_PROGRESS');

    const totalHours = completed.reduce((acc, curr) => {
      const crs = this.store.data.courses.find(c => c.id === curr.courseId);
      return acc + (crs ? crs.durationHours : 0);
    }, 0);

    const scores = completed.filter(c => c.score !== null).map(c => c.score);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 'N/A';

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>प्रशिक्षार्थी डैशबोर्ड / Trainee Learning & Competency Desk</h1>
          <p>Welcome, <strong>${user.name}</strong> (${user.designation}) &bull; ${user.department}</p>
        </div>
        <div class="page-actions-group">
          <button class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.navigateTo('trainee-profile')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Update Civil Service Profile
          </button>
          <button class="gov-btn gov-btn-primary" onclick="window.sakshamApp.navigateTo('course-catalog')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            Browse Course Catalog
          </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info-group">
            <div class="kpi-title">Active Enrolled Modules</div>
            <div class="kpi-value">${enrollments.length}</div>
            <div class="kpi-subtext">${inProgress.length} ongoing &bull; ${completed.length} completed</div>
          </div>
          <div class="kpi-icon-badge">📚</div>
        </div>

        <div class="kpi-card green-top">
          <div class="kpi-info-group">
            <div class="kpi-title">Certified Competencies</div>
            <div class="kpi-value">${completed.length}</div>
            <div class="kpi-subtext">Recognized on DoPT iGOT matrix</div>
          </div>
          <div class="kpi-icon-badge">🏅</div>
        </div>

        <div class="kpi-card saffron-top">
          <div class="kpi-info-group">
            <div class="kpi-title">Average Assessment Score</div>
            <div class="kpi-value">${avgScore}${avgScore !== 'N/A' ? '%' : ''}</div>
            <div class="kpi-subtext">Passing threshold: 60%</div>
          </div>
          <div class="kpi-icon-badge">🎯</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info-group">
            <div class="kpi-title">Training Credit Hours</div>
            <div class="kpi-value">${totalHours} <span style="font-size: 1rem; font-weight: normal;">/ 30h</span></div>
            <div class="kpi-subtext">Annual National Mandate Progress</div>
          </div>
          <div class="kpi-icon-badge">⏱️</div>
        </div>
      </div>

      <!-- Enrolled Courses Table -->
      <div class="gov-table-container">
        <div class="table-toolbar">
          <h3 style="color: var(--gov-navy); font-size: 1rem; font-weight: 700;">
            वर्तमान नामांकित पाठ्यक्रम / My Enrolled Training Programs
          </h3>
          <span class="gov-tag">${enrollments.length} Programs Registered</span>
        </div>
        <table class="gov-table">
          <thead>
            <tr>
              <th>Course Code & Title</th>
              <th>Sponsoring Ministry</th>
              <th>Progress</th>
              <th>Assessment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${enrollments.length === 0 ? `
              <tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--gov-text-muted);">No active enrollments. Explore the course catalog to register.</td></tr>
            ` : enrollments.map(enr => {
              const crs = this.store.data.courses.find(c => c.id === enr.courseId);
              if (!crs) return '';
              const asm = this.store.data.assessments.find(a => a.courseId === crs.id);
              return `
                <tr>
                  <td>
                    <strong>${crs.code}: ${crs.title}</strong>
                    <div style="font-size: 0.76rem; color: var(--gov-text-muted);">${crs.category} &bull; ${crs.credits} Credits (${crs.durationHours}h)</div>
                  </td>
                  <td>${crs.department}</td>
                  <td style="min-width: 140px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 3px;">
                      <span>${enr.progressPercent}%</span>
                      <span>${enr.status}</span>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill ${enr.progressPercent === 100 ? 'green' : ''}" style="width: ${enr.progressPercent}%;"></div>
                    </div>
                  </td>
                  <td>
                    ${enr.assessmentTaken ? `
                      <span class="gov-badge gov-badge-success">Passed (${enr.score}%)</span>
                    ` : asm ? `
                      <span class="gov-badge gov-badge-warning">Assessment Due (${asm.durationMinutes} mins)</span>
                    ` : `
                      <span class="gov-badge gov-badge-info">Continuous Evaluation</span>
                    `}
                  </td>
                  <td>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                      <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="window.sakshamTrainee.viewResources('${crs.id}')">
                        Study Materials (${crs.resources ? crs.resources.length : 0})
                      </button>
                      ${!enr.assessmentTaken && asm ? `
                        <button class="gov-btn gov-btn-warning gov-btn-sm" onclick="window.sakshamTrainee.startAssessment('${asm.id}')">
                          Take Exam
                        </button>
                      ` : ''}
                      ${enr.assessmentTaken ? `
                        <button class="gov-btn gov-btn-primary gov-btn-sm" onclick="window.sakshamTrainee.viewCertificate('${crs.id}', ${enr.score})">
                          View Certificate
                        </button>
                      ` : ''}
                      ${!enr.feedbackSubmitted ? `
                        <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="window.sakshamTrainee.openFeedbackModal('${crs.id}')">
                          Rate Course
                        </button>
                      ` : `
                        <span class="gov-tag" style="font-size: 0.7rem;">Rated ★${enr.feedback?.rating || 5}</span>
                      `}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Recommendation Strip -->
      <div style="margin-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="color: var(--gov-navy); font-size: 1.1rem; font-weight: 700;">
            अनुशंसित प्रशिक्षण / Recommended Training for Your Cadre
          </h3>
          <span style="font-size: 0.8rem; color: var(--gov-text-muted);">Curated by Capacity Building Commission (CBC)</span>
        </div>
        <div id="trainee-recommendations-mount">
          ${window.sakshamRecommendation ? window.sakshamRecommendation.renderRecommendations() : ''}
        </div>
      </div>
    `;
  }

  renderProfileBuilder() {
    const user = this.store.getCurrentUser();
    const prof = user.profile || {};

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>प्रशिक्षार्थी क्षमता प्रोफ़ाइल / Civil Servant Competency Profile Builder</h1>
          <p>Structured administrative data feeding CBC Competency Gap Mapping & Intelligent Course Recommendations</p>
        </div>
        <div class="page-actions-group">
          <button class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.navigateTo('trainee-dashboard')">
            &larr; Back to Dashboard
          </button>
        </div>
      </div>

      <div class="gov-card" style="max-width: 900px; margin-bottom: 30px;">
        <div class="gov-card-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Section I: Official Cadre & Administrative Details
          </h3>
          <span class="gov-tag">Official Gov Service Record</span>
        </div>
        <div class="gov-card-body">
          <form id="trainee-profile-form" onsubmit="window.sakshamTrainee.saveProfile(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="gov-form-group">
                <label class="gov-form-label">Full Name <span class="required">*</span></label>
                <input type="text" class="gov-form-control" name="name" value="${user.name}" required />
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Official Email (@gov.in / @nic.in) <span class="required">*</span></label>
                <input type="email" class="gov-form-control" name="email" value="${user.email}" required />
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Employee Identification Code (EIC) <span class="required">*</span></label>
                <input type="text" class="gov-form-control" name="employeeCode" value="${prof.employeeCode || ''}" required />
                <div class="gov-form-hint">E.g., GOI-FIN-2018-0941</div>
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Current Designation <span class="required">*</span></label>
                <input type="text" class="gov-form-control" name="designation" value="${user.designation || ''}" required />
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Parent Cadre / Service Batch <span class="required">*</span></label>
                <input type="text" class="gov-form-control" name="cadre" value="${user.cadre || ''}" required />
                <div class="gov-form-hint">E.g., Central Secretariat Service (CSS, Batch 2018)</div>
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Ministry / Department <span class="required">*</span></label>
                <input type="text" class="gov-form-control" name="department" value="${user.department || ''}" required />
              </div>
            </div>

            <div style="border-top: 1px solid var(--gov-border-subtle); margin: 20px 0 16px; padding-top: 16px;">
              <h4 style="color: var(--gov-navy); margin-bottom: 12px; font-size: 0.95rem;">
                Section II: Educational Credentials & Competency Domains
              </h4>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="gov-form-group">
                <label class="gov-form-label">Highest Educational Qualification <span class="required">*</span></label>
                <input type="text" class="gov-form-control" name="highestDegree" value="${prof.highestDegree || ''}" placeholder="E.g., M.Com (Finance), LL.B, B.Tech" required />
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Years of Public Administration Service</label>
                <input type="number" class="gov-form-control" name="publicServiceYears" value="${prof.publicServiceYears || 5}" min="0" max="40" />
              </div>
            </div>

            <div class="gov-form-group">
              <label class="gov-form-label">Core Functional Competencies (Comma separated)</label>
              <input type="text" class="gov-form-control" name="skills" value="${(prof.skills || []).join(', ')}" />
              <div class="gov-form-hint">E.g., Budget Analysis, File Processing, Tender Scrutiny, Parliamentary Questions</div>
            </div>

            <div class="gov-form-group">
              <label class="gov-form-label">Learning & Capacity Building Focus Areas</label>
              <input type="text" class="gov-form-control" name="learningInterests" value="${(prof.learningInterests || []).join(', ')}" />
              <div class="gov-form-hint">Used by the Recommendation System to align upcoming training batches with your goals</div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.navigateTo('trainee-dashboard')">Cancel</button>
              <button type="submit" class="gov-btn gov-btn-success">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Save Official Competency Record
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  saveProfile(e) {
    e.preventDefault();
    const form = e.target;
    const user = this.store.getCurrentUser();

    user.name = form.name.value;
    user.email = form.email.value;
    user.designation = form.designation.value;
    user.cadre = form.cadre.value;
    user.department = form.department.value;

    user.profile = user.profile || {};
    user.profile.employeeCode = form.employeeCode.value;
    user.profile.highestDegree = form.highestDegree.value;
    user.profile.publicServiceYears = Number(form.publicServiceYears.value);
    user.profile.skills = form.skills.value.split(',').map(s => s.trim()).filter(Boolean);
    user.profile.learningInterests = form.learningInterests.value.split(',').map(s => s.trim()).filter(Boolean);

    this.store.save();
    alert('Civil service profile and competency parameters updated successfully.');
    window.sakshamApp.navigateTo('trainee-dashboard');
  }

  renderCourseCatalog() {
    const user = this.store.getCurrentUser();
    const enrolledIds = this.store.data.enrollments.filter(e => e.userId === user.id).map(e => e.courseId);

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>राष्ट्रीय प्रशिक्षण पाठ्यक्रम सूची / National Training Course Catalog</h1>
          <p>Explore capacity building modules mandated by Central Ministries and the Capacity Building Commission</p>
        </div>
        <div class="page-actions-group">
          <input type="text" id="catalog-search" class="table-search-input" placeholder="Search by topic, code, or keyword..." onkeyup="window.sakshamTrainee.filterCatalog(this.value)" />
        </div>
      </div>

      <div class="courses-grid" id="catalog-grid-mount">
        ${this.store.data.courses.map(crs => {
          const isEnrolled = enrolledIds.includes(crs.id);
          const trainer = this.store.data.users.find(u => u.id === crs.leadTrainerId);
          return `
            <div class="gov-course-card" data-title="${crs.title.toLowerCase()} ${crs.code.toLowerCase()} ${crs.department.toLowerCase()}">
              <div class="course-card-banner">
                <span class="course-dept-tag">${crs.department}</span>
                <span class="course-credit-badge">${crs.credits} Credits &bull; ${crs.durationHours} Hours</span>
              </div>
              <div class="course-card-content">
                <span class="gov-badge gov-badge-navy" style="margin-bottom: 8px; align-self: flex-start;">${crs.code}</span>
                <h3>${crs.title}</h3>
                <p>${crs.summary}</p>
                <div style="font-size: 0.78rem; color: var(--gov-text-muted); margin-bottom: 12px;">
                  Lead Trainer: <strong>${trainer ? trainer.name : 'ISTM Faculty'}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--gov-border-subtle); padding-top: 12px;">
                  <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="window.sakshamTrainee.viewResources('${crs.id}')">
                    View Syllabus
                  </button>
                  ${isEnrolled ? `
                    <span class="gov-badge gov-badge-success">Already Enrolled</span>
                  ` : `
                    <button class="gov-btn gov-btn-primary gov-btn-sm" onclick="window.sakshamTrainee.enroll('${crs.id}')">
                      Enroll Now
                    </button>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  filterCatalog(query) {
    const q = query.toLowerCase();
    const cards = document.querySelectorAll('#catalog-grid-mount .gov-course-card');
    cards.forEach(c => {
      const match = c.getAttribute('data-title').includes(q);
      c.style.display = match ? 'flex' : 'none';
    });
  }

  enroll(courseId) {
    const user = this.store.getCurrentUser();
    this.store.enrollInCourse(user.id, courseId);
    alert('Successfully enrolled under Department Training Sponsorship. You can now access learning resources.');
    window.sakshamApp.navigateTo('trainee-dashboard');
  }

  viewResources(courseId) {
    const crs = this.store.data.courses.find(c => c.id === courseId);
    if (!crs) return;

    const modalBody = `
      <div style="margin-bottom: 16px;">
        <span class="gov-badge gov-badge-navy">${crs.code}</span>
        <h3 style="color: var(--gov-navy); margin: 8px 0 4px;">${crs.title}</h3>
        <p style="font-size: 0.85rem; color: var(--gov-text-secondary);">${crs.summary}</p>
      </div>

      <div style="background: #f8fafc; border: 1px solid var(--gov-border); border-radius: var(--gov-radius-sm); padding: 12px; margin-bottom: 16px;">
        <div style="font-size: 0.8rem; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div><strong>Sponsoring Ministry:</strong> ${crs.department}</div>
          <div><strong>Duration:</strong> ${crs.durationHours} Training Hours</div>
          <div><strong>Evaluation:</strong> Timed MCQ Certification (${crs.credits} Credits)</div>
          <div><strong>Competencies Covered:</strong> ${(crs.competenciesAddressed || []).join(', ')}</div>
        </div>
      </div>

      <h4 style="color: var(--gov-navy); font-size: 0.95rem; margin-bottom: 10px;">
        Learning Materials & Secretariat Resources (${(crs.resources || []).length})
      </h4>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${(crs.resources || []).map((res, i) => `
          <div style="border: 1px solid var(--gov-border); border-radius: var(--gov-radius-sm); padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; background: #ffffff;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="gov-badge ${res.type === 'VIDEO' ? 'gov-badge-danger' : res.type === 'SLIDE' ? 'gov-badge-warning' : 'gov-badge-info'}">
                ${res.type}
              </span>
              <div>
                <strong style="font-size: 0.85rem; color: var(--gov-navy);">${res.title}</strong>
                <div style="font-size: 0.74rem; color: var(--gov-text-muted);">${res.size || res.duration}</div>
              </div>
            </div>
            <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="alert('Viewing Official Material: ${res.title.replace(/'/g, "\\'")}');">
              Access
            </button>
          </div>
        `).join('')}
      </div>
    `;

    window.sakshamApp.openModal('Course Resources & Syllabus Reader', modalBody);
  }

  /* Timed MCQ Assessment Engine */
  startAssessment(assessmentId) {
    const asm = this.store.data.assessments.find(a => a.id === assessmentId);
    if (!asm) return;

    this.currentExamState = {
      assessment: asm,
      currentIndex: 0,
      answers: {},
      flagged: {},
      timeRemainingSec: asm.durationMinutes * 60
    };

    this.renderExamModal();
    this.startExamTimer();
  }

  startExamTimer() {
    if (this.examTimerInterval) clearInterval(this.examTimerInterval);

    this.examTimerInterval = setInterval(() => {
      if (!this.currentExamState) {
        clearInterval(this.examTimerInterval);
        return;
      }
      this.currentExamState.timeRemainingSec--;
      this.updateTimerDisplay();

      if (this.currentExamState.timeRemainingSec <= 0) {
        clearInterval(this.examTimerInterval);
        alert('Examination time expired! Auto-submitting your marksheet.');
        this.submitExam();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const timerElem = document.getElementById('exam-timer-val');
    const timerBox = document.getElementById('exam-timer-box');
    if (!timerElem || !this.currentExamState) return;

    const mins = Math.floor(this.currentExamState.timeRemainingSec / 60);
    const secs = this.currentExamState.timeRemainingSec % 60;
    timerElem.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (this.currentExamState.timeRemainingSec <= 60) {
      timerBox.className = 'exam-timer-box timer-danger';
    } else if (this.currentExamState.timeRemainingSec <= 180) {
      timerBox.className = 'exam-timer-box timer-warning';
    }
  }

  renderExamModal() {
    const asm = this.currentExamState.assessment;
    const curIdx = this.currentExamState.currentIndex;
    const q = asm.questions[curIdx];

    const content = `
      <div class="exam-container">
        <div class="exam-top-bar">
          <div>
            <span class="gov-badge gov-badge-warning" style="margin-right: 8px;">MANDATORY TIMED EXAM</span>
            <strong>${asm.title}</strong>
          </div>
          <div id="exam-timer-box" class="exam-timer-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span id="exam-timer-val">10:00</span>
          </div>
        </div>

        <div class="exam-layout">
          <!-- Question Area -->
          <div class="exam-main-panel">
            <div class="question-counter-row">
              <span>Question <strong>${curIdx + 1}</strong> of ${asm.questions.length}</span>
              <span>Marks: 10 per correct answer &bull; Qualifying: ${asm.passingCutoff}%</span>
            </div>

            <div class="question-text">
              ${curIdx + 1}. ${q.text}
            </div>

            <div class="options-container">
              ${q.options.map((opt, oIdx) => {
                const isSelected = this.currentExamState.answers[q.id] === oIdx;
                const keyLetter = String.fromCharCode(65 + oIdx);
                return `
                  <div class="option-choice-card ${isSelected ? 'selected' : ''}" onclick="window.sakshamTrainee.selectAnswer('${q.id}', ${oIdx})">
                    <span class="option-key-badge">${keyLetter}</span>
                    <span style="font-size: 0.9rem;">${opt}</span>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="exam-nav-footer">
              <div style="display: flex; gap: 8px;">
                <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="window.sakshamTrainee.toggleFlag('${q.id}')">
                  ${this.currentExamState.flagged[q.id] ? 'Unflag Question' : 'Flag for Review'}
                </button>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="gov-btn gov-btn-secondary gov-btn-sm" ${curIdx === 0 ? 'disabled' : ''} onclick="window.sakshamTrainee.navigateQuestion(${curIdx - 1})">
                  &larr; Previous
                </button>
                ${curIdx < asm.questions.length - 1 ? `
                  <button class="gov-btn gov-btn-primary gov-btn-sm" onclick="window.sakshamTrainee.navigateQuestion(${curIdx + 1})">
                    Next &rarr;
                  </button>
                ` : `
                  <button class="gov-btn gov-btn-success gov-btn-sm" onclick="window.sakshamTrainee.confirmSubmitExam()">
                    Submit Assessment
                  </button>
                `}
              </div>
            </div>
          </div>

          <!-- Question Palette -->
          <div class="exam-palette-panel">
            <div class="palette-heading">Question Palette</div>
            <div class="palette-grid">
              ${asm.questions.map((ques, idx) => {
                const isAnswered = this.currentExamState.answers[ques.id] !== undefined;
                const isFlagged = this.currentExamState.flagged[ques.id];
                const isActive = idx === curIdx;
                let cls = 'palette-btn';
                if (isActive) cls += ' active';
                if (isFlagged) cls += ' flagged';
                else if (isAnswered) cls += ' answered';

                return `
                  <button class="${cls}" onclick="window.sakshamTrainee.navigateQuestion(${idx})">
                    ${idx + 1}
                  </button>
                `;
              }).join('')}
            </div>

            <div class="palette-legend">
              <div class="legend-item"><span class="legend-dot" style="background: var(--gov-green);"></span> Answered (${Object.keys(this.currentExamState.answers).length})</div>
              <div class="legend-item"><span class="legend-dot" style="background: #7c3aed;"></span> Flagged for Review (${Object.keys(this.currentExamState.flagged).length})</div>
              <div class="legend-item"><span class="legend-dot" style="background: #ffffff; border: 1px solid #cbd5e1;"></span> Unanswered</div>
            </div>
          </div>
        </div>
      </div>
    `;

    window.sakshamApp.openModal('National Certification Assessment Portal', content, true);
    this.updateTimerDisplay();
  }

  selectAnswer(questionId, optionIndex) {
    if (!this.currentExamState) return;
    this.currentExamState.answers[questionId] = optionIndex;
    this.renderExamModal();
  }

  toggleFlag(questionId) {
    if (!this.currentExamState) return;
    this.currentExamState.flagged[questionId] = !this.currentExamState.flagged[questionId];
    this.renderExamModal();
  }

  navigateQuestion(newIndex) {
    if (!this.currentExamState) return;
    this.currentExamState.currentIndex = newIndex;
    this.renderExamModal();
  }

  confirmSubmitExam() {
    const answeredCount = Object.keys(this.currentExamState.answers).length;
    const totalCount = this.currentExamState.assessment.questions.length;
    if (confirm(`You have answered ${answeredCount} of ${totalCount} questions. Are you sure you want to officially submit your marksheet?`)) {
      this.submitExam();
    }
  }

  submitExam() {
    if (this.examTimerInterval) clearInterval(this.examTimerInterval);

    const user = this.store.getCurrentUser();
    const asm = this.currentExamState.assessment;
    let correct = 0;

    asm.questions.forEach(q => {
      if (this.currentExamState.answers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    const scorePercent = Math.round((correct / asm.questions.length) * 100);
    this.store.recordAssessmentScore(user.id, asm.courseId, scorePercent);

    this.currentExamState = null;
    window.sakshamApp.closeModal();

    this.showResultSummary(asm, correct, scorePercent);
  }

  showResultSummary(asm, correct, scorePercent) {
    const passed = scorePercent >= asm.passingCutoff;
    const crs = this.store.data.courses.find(c => c.id === asm.courseId);

    const body = `
      <div style="text-align: center; padding: 20px 10px;">
        <div style="font-size: 3.5rem; margin-bottom: 8px;">
          ${passed ? '🎖️' : '📋'}
        </div>
        <h2 style="color: ${passed ? 'var(--gov-green)' : 'var(--gov-danger)'}; margin-bottom: 4px;">
          ${passed ? 'अभिनंदन! योग्यता परीक्षा उत्तीर्ण / Certified Competency Passed' : 'समीक्षा आवश्यक / Minimum Cutoff Not Met'}
        </h2>
        <p style="font-size: 0.9rem; color: var(--gov-text-secondary); margin-bottom: 20px;">
          ${asm.title}
        </p>

        <div style="background: #f8fafc; border: 1px solid var(--gov-border); border-radius: var(--gov-radius-md); padding: 20px; max-width: 440px; margin: 0 auto 24px;">
          <div style="display: flex; justify-content: space-around; margin-bottom: 14px;">
            <div>
              <div style="font-size: 0.75rem; color: var(--gov-text-muted);">SCORE PERCENTAGE</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--gov-navy);">${scorePercent}%</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--gov-text-muted);">RESULT STATUS</div>
              <div style="font-size: 1.2rem; font-weight: 800; color: ${passed ? 'var(--gov-green)' : 'var(--gov-danger)'};">
                ${passed ? 'QUALIFIED' : 'FAILED'}
              </div>
            </div>
          </div>
          <div style="font-size: 0.8rem; color: var(--gov-text-muted); border-top: 1px solid var(--gov-border-subtle); padding-top: 10px;">
            Correct Answers: <strong>${correct} / ${asm.questions.length}</strong> &bull; Cutoff Required: <strong>${asm.passingCutoff}%</strong>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 12px;">
          <button class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.closeModal(); window.sakshamApp.navigateTo('trainee-dashboard');">
            Return to Learning Desk
          </button>
          ${passed ? `
            <button class="gov-btn gov-btn-success" onclick="window.sakshamTrainee.viewCertificate('${crs.id}', ${scorePercent})">
              Download Official Certificate
            </button>
          ` : `
            <button class="gov-btn gov-btn-warning" onclick="window.sakshamTrainee.startAssessment('${asm.id}')">
              Retake Assessment
            </button>
          `}
        </div>
      </div>
    `;

    window.sakshamApp.openModal('National Certification Assessment Result', body);
  }

  viewCertificate(courseId, score) {
    const user = this.store.getCurrentUser();
    const crs = this.store.data.courses.find(c => c.id === courseId) || { title: 'General Financial Rules (GFR 2017)' };
    const certId = `SAK-GOI-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const certHtml = `
      <div class="cert-sheet">
        <div class="cert-header">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--gov-text-muted); letter-spacing: 1px;">
            भारत सरकार &bull; GOVERNMENT OF INDIA
          </div>
          <div style="font-size: 0.9rem; font-weight: 800; color: var(--gov-navy); margin-top: 4px;">
            CAPACITY BUILDING COMMISSION &bull; क्षमता निर्माण आयोग
          </div>
          <h2 class="cert-title">Certificate of Competency</h2>
          <div style="font-size: 0.78rem; color: var(--gov-text-muted);">
            Certificate ID: <strong>${certId}</strong> &bull; Issued under Mission Karmayogi Framework
          </div>
        </div>

        <p style="font-size: 0.95rem; color: var(--gov-text-secondary); margin-top: 16px;">
          This is to certify that
        </p>
        <div class="cert-recipient">
          ${user.name}
        </div>
        <p style="font-size: 0.85rem; color: var(--gov-text-muted); margin-bottom: 16px;">
          ${user.designation}, ${user.department}<br/>
          (Cadre: ${user.cadre})
        </p>
        <p style="font-size: 0.92rem; color: var(--gov-text-secondary); line-height: 1.6; max-width: 600px; margin: 0 auto;">
          has successfully qualified the statutory timed evaluation in <strong>${crs.title}</strong> with an aggregate score of <strong>${score}%</strong>, demonstrating accredited functional and behavioral capacity as prescribed by the Capacity Building Commission.
        </p>

        <div class="cert-footer-signatures">
          <div>
            <strong>Dr. Priya Venkatesh</strong><br/>
            Lead Master Instructor<br/>
            ISTM / DoPT
          </div>
          <div>
            <strong>Sh. R.K. Sharma</strong><br/>
            Joint Secretary & Nodal Officer<br/>
            Capacity Building Commission
          </div>
        </div>
      </div>
      <div style="text-align: right; margin-top: 14px;">
        <button class="gov-btn gov-btn-secondary" onclick="window.print();">Print / Save as PDF</button>
      </div>
    `;

    window.sakshamApp.openModal('National Certification of Competency', certHtml, true);
  }

  openFeedbackModal(courseId) {
    const crs = this.store.data.courses.find(c => c.id === courseId);
    if (!crs) return;

    const modalBody = `
      <form onsubmit="window.sakshamTrainee.submitFeedback(event, '${courseId}')">
        <h4 style="color: var(--gov-navy); margin-bottom: 6px;">${crs.title}</h4>
        <p style="font-size: 0.82rem; color: var(--gov-text-muted); margin-bottom: 16px;">
          Your qualitative rating feeds directly into the Trainer Competency Index and Admin Monitoring Desk.
        </p>

        <div class="gov-form-group">
          <label class="gov-form-label">Overall Training Utility & Pedagogical Rating <span class="required">*</span></label>
          <select class="gov-form-control" name="rating" required>
            <option value="5">★★★★★ 5 - Exceptional (Directly relevant to secretariat duties)</option>
            <option value="4" selected>★★★★☆ 4 - Highly Effective (Clarified regulatory ambiguities)</option>
            <option value="3">★★★☆☆ 3 - Satisfactory (Standard curriculum coverage)</option>
            <option value="2">★★☆☆☆ 2 - Needs Improvement (Lacked practical case studies)</option>
            <option value="1">★☆☆☆☆ 1 - Unsatisfactory</option>
          </select>
        </div>

        <div class="gov-form-group">
          <label class="gov-form-label">Official Feedback & Qualitative Suggestions</label>
          <textarea class="gov-form-control" name="comment" rows="4" placeholder="Detail how this course impacted your day-to-day administrative decision making..."></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.closeModal()">Cancel</button>
          <button type="submit" class="gov-btn gov-btn-success">Submit Official Feedback</button>
        </div>
      </form>
    `;

    window.sakshamApp.openModal('Course & Instructor Feedback Loop', modalBody);
  }

  submitFeedback(e, courseId) {
    e.preventDefault();
    const form = e.target;
    const user = this.store.getCurrentUser();
    this.store.submitCourseFeedback(user.id, courseId, form.rating.value, form.comment.value);
    alert('Thank you. Your feedback has been recorded and transmitted to the Capacity Building Commission.');
    window.sakshamApp.closeModal();
    window.sakshamApp.navigateTo('trainee-dashboard');
  }
}

window.sakshamTrainee = new SakshamTraineeModule();
