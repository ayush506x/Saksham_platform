/* ==========================================================================
   SAKSHAM (सक्षम) - Trainer Module
   Competency Profile, Assessment Creator, Participation Monitoring, Library
   ========================================================================== */

class SakshamTrainerModule {
  constructor() {
    this.store = window.sakshamStore;
  }

  renderDashboard() {
    const user = this.store.getCurrentUser();
    const coursesTaught = this.store.data.courses.filter(c => c.leadTrainerId === user.id);
    const courseIds = coursesTaught.map(c => c.id);
    const enrollments = this.store.data.enrollments.filter(e => courseIds.includes(e.courseId));
    
    const atRiskTrainees = enrollments.filter(e => e.progressPercent < 50 || (e.score !== null && e.score < 60));
    const qual = user.qualifications || {};

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>प्रशिक्षक कंसोल / Master Trainer Capacity & Assessment Desk</h1>
          <p>Logged in as: <strong>${user.name}</strong> (${user.designation}) &bull; ${user.cadre}</p>
        </div>
        <div class="page-actions-group">
          <button class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.navigateTo('trainer-profile')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Edit Qualification Portfolio
          </button>
          <button class="gov-btn gov-btn-primary" onclick="window.sakshamTrainer.openCreateAssessmentModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create Timed Assessment
          </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info-group">
            <div class="kpi-title">Lead Instructional Batches</div>
            <div class="kpi-value">${coursesTaught.length}</div>
            <div class="kpi-subtext">Assigned by Capacity Building Commission</div>
          </div>
          <div class="kpi-icon-badge">🎓</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info-group">
            <div class="kpi-title">Officers Under Training</div>
            <div class="kpi-value">${enrollments.length + 180}</div>
            <div class="kpi-subtext">Across Ministries of Finance, MeitY, DoPT</div>
          </div>
          <div class="kpi-icon-badge">👥</div>
        </div>

        <div class="kpi-card green-top">
          <div class="kpi-info-group">
            <div class="kpi-title">Trainee Rating Index</div>
            <div class="kpi-value">★ ${qual.rating || 4.88}</div>
            <div class="kpi-subtext">Based on post-training feedback loop</div>
          </div>
          <div class="kpi-icon-badge">⭐</div>
        </div>

        <div class="kpi-card saffron-top">
          <div class="kpi-info-group">
            <div class="kpi-title">Competency Fit Score</div>
            <div class="kpi-value">96.4%</div>
            <div class="kpi-subtext">Public Procurement & GFR Domain</div>
          </div>
          <div class="kpi-icon-badge">📊</div>
        </div>
      </div>

      <!-- Early Warning Alert Box -->
      ${atRiskTrainees.length > 0 ? `
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid var(--gov-warning); border-radius: var(--gov-radius-md); padding: 16px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.5rem;">⚠️</span>
            <div>
              <strong style="color: var(--gov-warning); font-size: 0.95rem;">Early-Warning Signal: ${atRiskTrainees.length} Officer(s) Require Pedagogical Intervention</strong>
              <div style="font-size: 0.8rem; color: var(--gov-text-secondary); margin-top: 2px;">
                Trainees have flagged delays in statutory modules or scored below 60% in mock evaluations.
              </div>
            </div>
          </div>
          <button class="gov-btn gov-btn-warning gov-btn-sm" onclick="window.sakshamApp.navigateTo('trainer-monitoring')">
            Inspect At-Risk Trainees
          </button>
        </div>
      ` : ''}

      <!-- Assigned Courses Table -->
      <div class="gov-table-container">
        <div class="table-toolbar">
          <h3 style="color: var(--gov-navy); font-size: 1rem; font-weight: 700;">
            प्रभारित प्रशिक्षण पाठ्यक्रम / Assigned Training Courses
          </h3>
          <span class="gov-tag">${coursesTaught.length} Active Courses</span>
        </div>
        <table class="gov-table">
          <thead>
            <tr>
              <th>Course Code & Program</th>
              <th>Sponsoring Ministry</th>
              <th>Enrolled Personnel</th>
              <th>Average Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${coursesTaught.map(crs => `
              <tr>
                <td>
                  <strong>${crs.code}: ${crs.title}</strong>
                  <div style="font-size: 0.76rem; color: var(--gov-text-muted);">${crs.category} &bull; ${crs.credits} Credits</div>
                </td>
                <td>${crs.department}</td>
                <td><strong>${crs.enrolledCount}</strong> Officers</td>
                <td><span class="gov-badge gov-badge-success">★ ${crs.avgRating} / 5.0</span></td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="window.sakshamApp.navigateTo('trainer-library')">
                      Repository (${(crs.resources || []).length})
                    </button>
                    <button class="gov-btn gov-btn-primary gov-btn-sm" onclick="window.sakshamTrainer.openCreateAssessmentModal('${crs.id}')">
                      Add Assessment
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderProfileManager() {
    const user = this.store.getCurrentUser();
    const qual = user.qualifications || {};

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>प्रशिक्षक योग्यता एवं सक्षमता प्रोफ़ाइल / Trainer Accreditation Portfolio</h1>
          <p>This structured qualification data serves as the ground truth for the AI Competency Mapping Engine.</p>
        </div>
        <div class="page-actions-group">
          <button class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.navigateTo('trainer-dashboard')">
            &larr; Back to Dashboard
          </button>
        </div>
      </div>

      <div class="gov-card" style="max-width: 900px; margin-bottom: 30px;">
        <div class="gov-card-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Accreditation Details & Competency Domain Feeds
          </h3>
          <span class="gov-badge gov-badge-success">CBC ACCREDITED</span>
        </div>
        <div class="gov-card-body">
          <form onsubmit="window.sakshamTrainer.saveProfile(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="gov-form-group">
                <label class="gov-form-label">Full Name & Honorific</label>
                <input type="text" class="gov-form-control" name="name" value="${user.name}" required />
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Current Academic / Cadre Designation</label>
                <input type="text" class="gov-form-control" name="designation" value="${user.designation}" required />
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Parent Institute / Training Academy</label>
                <input type="text" class="gov-form-control" name="cadre" value="${user.cadre}" required />
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Supervising Ministry</label>
                <input type="text" class="gov-form-control" name="department" value="${user.department}" required />
              </div>
              <div class="gov-form-group" style="grid-column: span 2;">
                <label class="gov-form-label">Terminal Degree & Doctoral Qualifications</label>
                <input type="text" class="gov-form-control" name="highestDegree" value="${qual.highestDegree || ''}" required />
                <div class="gov-form-hint">Used for 35% weightage calculation in the Competency Mapping Engine</div>
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Years of Executive / Civil Service Training Experience</label>
                <input type="number" class="gov-form-control" name="yearsExperience" value="${qual.yearsExperience || 10}" min="1" max="45" required />
              </div>
              <div class="gov-form-group">
                <label class="gov-form-label">Total Officers/Batches Instructed</label>
                <input type="number" class="gov-form-control" name="batchesTrained" value="${qual.batchesTrained || 20}" min="1" required />
              </div>
            </div>

            <div class="gov-form-group">
              <label class="gov-form-label">Statutory Certifications & Accreditations (Comma separated)</label>
              <input type="text" class="gov-form-control" name="certifications" value="${(qual.certifications || []).join(', ')}" />
              <div class="gov-form-hint">E.g., Certified Public Procurement Specialist (CPPS), GFR Lead Master Trainer, NIFM Senior Fellow</div>
            </div>

            <div class="gov-form-group">
              <label class="gov-form-label">Domain Competency Tags (Comma separated)</label>
              <input type="text" class="gov-form-control" name="competencyDomains" value="${(qual.competencyDomains || []).join(', ')}" />
              <div class="gov-form-hint">E.g., Public Procurement, GFR 2017, GeM Portal, Budgeting & Appropriations</div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.navigateTo('trainer-dashboard')">Cancel</button>
              <button type="submit" class="gov-btn gov-btn-success">Update Accreditation Profile</button>
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
    user.designation = form.designation.value;
    user.cadre = form.cadre.value;
    user.department = form.department.value;

    user.qualifications = user.qualifications || {};
    user.qualifications.highestDegree = form.highestDegree.value;
    user.qualifications.yearsExperience = Number(form.yearsExperience.value);
    user.qualifications.batchesTrained = Number(form.batchesTrained.value);
    user.qualifications.certifications = form.certifications.value.split(',').map(s => s.trim()).filter(Boolean);
    user.qualifications.competencyDomains = form.competencyDomains.value.split(',').map(s => s.trim()).filter(Boolean);

    this.store.save();
    alert('Trainer accreditation credentials successfully updated. Competency fit scores recalculated.');
    window.sakshamApp.navigateTo('trainer-dashboard');
  }

  renderMonitoringDesk() {
    const user = this.store.getCurrentUser();
    const coursesTaught = this.store.data.courses.filter(c => c.leadTrainerId === user.id);
    const courseIds = coursesTaught.map(c => c.id);
    const enrollments = this.store.data.enrollments.filter(e => courseIds.includes(e.courseId));

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>प्रशिक्षार्थी प्रदर्शन एवं प्रारंभिक चेतावनी डैशबोर्ड / Trainee Early-Warning Desk</h1>
          <p>Real-time participation tracking and automated risk identification across active batches</p>
        </div>
        <div class="page-actions-group">
          <button class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.navigateTo('trainer-dashboard')">
            &larr; Dashboard
          </button>
        </div>
      </div>

      <div class="gov-table-container">
        <div class="table-toolbar">
          <h3 style="color: var(--gov-navy); font-size: 1rem; font-weight: 700;">
            Enrolled Trainees Performance Roster
          </h3>
          <span class="gov-tag">${enrollments.length} Active Officers</span>
        </div>
        <table class="gov-table">
          <thead>
            <tr>
              <th>Civil Servant / Trainee</th>
              <th>Department & Cadre</th>
              <th>Registered Program</th>
              <th>Progress</th>
              <th>Quiz / Exam</th>
              <th>Early-Warning Signal</th>
              <th>Intervention</th>
            </tr>
          </thead>
          <tbody>
            ${enrollments.map(enr => {
              const trainee = this.store.data.users.find(u => u.id === enr.userId);
              const crs = this.store.data.courses.find(c => c.id === enr.courseId);
              if (!trainee || !crs) return '';

              let statusBadge = `<span class="gov-badge gov-badge-success">On Track</span>`;
              if (enr.progressPercent < 50) {
                statusBadge = `<span class="gov-badge gov-badge-danger">Delay: Pace Alert</span>`;
              } else if (!enr.assessmentTaken) {
                statusBadge = `<span class="gov-badge gov-badge-warning">Quiz Pending</span>`;
              }

              return `
                <tr>
                  <td>
                    <strong>${trainee.name}</strong>
                    <div style="font-size: 0.75rem; color: var(--gov-text-muted);">${trainee.designation}</div>
                  </td>
                  <td>${trainee.department}</td>
                  <td>${crs.code}</td>
                  <td style="min-width: 120px;">
                    <div style="font-size: 0.75rem; margin-bottom: 3px;">${enr.progressPercent}%</div>
                    <div class="progress-track">
                      <div class="progress-fill ${enr.progressPercent === 100 ? 'green' : ''}" style="width: ${enr.progressPercent}%;"></div>
                    </div>
                  </td>
                  <td>
                    ${enr.assessmentTaken ? `
                      <span class="gov-badge ${enr.score >= 60 ? 'gov-badge-success' : 'gov-badge-danger'}">${enr.score}%</span>
                    ` : `
                      <span style="color: var(--gov-text-muted); font-size: 0.78rem;">Not Attempted</span>
                    `}
                  </td>
                  <td>${statusBadge}</td>
                  <td>
                    <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="alert('Sent official reminder email to ${trainee.email} via NIC Secretariat Mail.');">
                      Remind
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderLibrary() {
    const user = this.store.getCurrentUser();
    const coursesTaught = this.store.data.courses.filter(c => c.leadTrainerId === user.id);

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>केंद्रीय प्रशिक्षक पुस्तकालय / Central Trainer Resource Library</h1>
          <p>Official repository for recorded lectures, PPT presentations, and gazette manuals</p>
        </div>
        <div class="page-actions-group">
          <button class="gov-btn gov-btn-primary" onclick="window.sakshamTrainer.openUploadResourceModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Upload Study Material
          </button>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${coursesTaught.map(crs => `
          <div class="gov-card">
            <div class="gov-card-header">
              <h3>${crs.code}: ${crs.title}</h3>
              <span class="gov-tag">${(crs.resources || []).length} Items</span>
            </div>
            <div class="gov-card-body">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
                ${(crs.resources || []).map(r => `
                  <div style="border: 1px solid var(--gov-border); border-radius: var(--gov-radius-sm); padding: 14px; background: #fafbfd; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                      <span class="gov-badge ${r.type === 'VIDEO' ? 'gov-badge-danger' : r.type === 'SLIDE' ? 'gov-badge-warning' : 'gov-badge-info'}" style="margin-bottom: 8px;">
                        ${r.type}
                      </span>
                      <h4 style="font-size: 0.9rem; color: var(--gov-navy); margin-bottom: 4px;">${r.title}</h4>
                      <p style="font-size: 0.75rem; color: var(--gov-text-muted);">${r.size || r.duration} &bull; Uploaded by Faculty</p>
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 14px;">
                      <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="alert('Viewing material: ${r.title.replace(/'/g, "\\'")}');">Inspect</button>
                      <button class="gov-btn gov-btn-secondary gov-btn-sm" style="color: var(--gov-danger);" onclick="alert('Resource archived from active batch view.');">Archive</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  openCreateAssessmentModal(courseId) {
    const courses = this.store.data.courses;
    const body = `
      <form onsubmit="window.sakshamTrainer.createAssessment(event)">
        <div class="gov-form-group">
          <label class="gov-form-label">Assessment Title <span class="required">*</span></label>
          <input type="text" class="gov-form-control" name="title" placeholder="E.g., Mid-Term Certification: GeM 4.0 Reverse Auctioning" required />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="gov-form-group">
            <label class="gov-form-label">Associated Course <span class="required">*</span></label>
            <select class="gov-form-control" name="courseId" required>
              ${courses.map(c => `
                <option value="${c.id}" ${courseId === c.id ? 'selected' : ''}>${c.code}: ${c.title}</option>
              `).join('')}
            </select>
          </div>
          <div class="gov-form-group">
            <label class="gov-form-label">Time Duration (Minutes) <span class="required">*</span></label>
            <input type="number" class="gov-form-control" name="duration" value="15" min="5" max="180" required />
          </div>
          <div class="gov-form-group">
            <label class="gov-form-label">Minimum Qualifying Cutoff (%) <span class="required">*</span></label>
            <input type="number" class="gov-form-control" name="cutoff" value="60" min="40" max="100" required />
          </div>
          <div class="gov-form-group">
            <label class="gov-form-label">Submission Deadline Date <span class="required">*</span></label>
            <input type="date" class="gov-form-control" name="deadline" value="2026-10-30" required />
          </div>
        </div>

        <div style="border-top: 1px solid var(--gov-border-subtle); padding-top: 12px; margin-top: 10px;">
          <h4 style="font-size: 0.9rem; color: var(--gov-navy); margin-bottom: 8px;">Question 1 Definition</h4>
          <div class="gov-form-group">
            <label class="gov-form-label">Question Text</label>
            <textarea class="gov-form-control" name="q1_text" rows="2" placeholder="E.g., Under Rule 149, what is the mandatory window for delivery inspection?" required></textarea>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <input type="text" class="gov-form-control" name="q1_a" placeholder="Option A" required />
            <input type="text" class="gov-form-control" name="q1_b" placeholder="Option B" required />
            <input type="text" class="gov-form-control" name="q1_c" placeholder="Option C" required />
            <input type="text" class="gov-form-control" name="q1_d" placeholder="Option D" required />
          </div>
          <div class="gov-form-group" style="margin-top: 8px;">
            <label class="gov-form-label">Correct Option</label>
            <select class="gov-form-control" name="q1_correct">
              <option value="0">Option A</option>
              <option value="1">Option B</option>
              <option value="2">Option C</option>
              <option value="3">Option D</option>
            </select>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
          <button type="button" class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.closeModal()">Cancel</button>
          <button type="submit" class="gov-btn gov-btn-success">Publish Timed Assessment</button>
        </div>
      </form>
    `;

    window.sakshamApp.openModal('Create Timed Assessment with Deadlines', body);
  }

  createAssessment(e) {
    e.preventDefault();
    const f = e.target;

    const newAsm = {
      id: `ASM-${Date.now().toString().slice(-4)}`,
      courseId: f.courseId.value,
      title: f.title.value,
      durationMinutes: Number(f.duration.value),
      totalMarks: 50,
      passingCutoff: Number(f.cutoff.value),
      deadline: f.deadline.value,
      questions: [
        {
          id: 'q_custom_1',
          text: f.q1_text.value,
          options: [f.q1_a.value, f.q1_b.value, f.q1_c.value, f.q1_d.value],
          correctIndex: Number(f.q1_correct.value),
          explanation: 'Standard statutory evaluation guideline.'
        }
      ]
    };

    this.store.addAssessment(newAsm);
    alert('New Timed Questionnaire officially published and synced to enrolled civil servants.');
    window.sakshamApp.closeModal();
    window.sakshamApp.navigateTo('trainer-dashboard');
  }

  openUploadResourceModal() {
    const courses = this.store.data.courses;
    const body = `
      <form onsubmit="window.sakshamTrainer.uploadResource(event)">
        <div class="gov-form-group">
          <label class="gov-form-label">Select Course</label>
          <select class="gov-form-control" name="courseId">
            ${courses.map(c => `<option value="${c.id}">${c.code}: ${c.title}</option>`).join('')}
          </select>
        </div>
        <div class="gov-form-group">
          <label class="gov-form-label">Material Title</label>
          <input type="text" class="gov-form-control" name="title" placeholder="E.g., Compendium on GFR Rule 149 Special Sanctions" required />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="gov-form-group">
            <label class="gov-form-label">Resource Type</label>
            <select class="gov-form-control" name="type">
              <option value="DOC">Official Gazette / PDF Document</option>
              <option value="SLIDE">Lecture Slide Deck (PPT)</option>
              <option value="VIDEO">Recorded Video Lecture</option>
            </select>
          </div>
          <div class="gov-form-group">
            <label class="gov-form-label">Estimated Size / Duration</label>
            <input type="text" class="gov-form-control" name="meta" value="3.4 MB" required />
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
          <button type="button" class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.closeModal()">Cancel</button>
          <button type="submit" class="gov-btn gov-btn-success">Upload to Batch Library</button>
        </div>
      </form>
    `;

    window.sakshamApp.openModal('Upload Secretariat Training Resource', body);
  }

  uploadResource(e) {
    e.preventDefault();
    const f = e.target;
    const crs = this.store.data.courses.find(c => c.id === f.courseId.value);
    if (crs) {
      crs.resources = crs.resources || [];
      crs.resources.push({
        type: f.type.value,
        title: f.title.value,
        size: f.meta.value
      });
      this.store.save();
      alert('Resource uploaded and made accessible to enrolled trainees.');
      window.sakshamApp.closeModal();
      window.sakshamApp.navigateTo('trainer-library');
    }
  }
}

window.sakshamTrainer = new SakshamTrainerModule();
