/* ==========================================================================
   SAKSHAM (सक्षम) - Public Portal & Authentication Modules
   Provides Public Homepage, Dedicated Login Desk, About CBC, Public Courses & Circulars
   ========================================================================== */

class SakshamHomePage {
  constructor() {
    this.store = window.sakshamStore;
    this.auth = window.sakshamAuth;
  }

  /* 1. Public Karmayogi Landing Page */
  render() {
    const courses = this.store.data.courses;
    const ann = this.store.data.announcements;

    return `
      <!-- Hero Section -->
      <div class="karmayogi-hero">
        <div class="hero-content-col">
          <div class="gov-tag" style="margin-bottom: 12px; display: inline-flex; align-items: center; gap: 6px;">
            <span style="color: var(--gov-saffron-dark);">🇮🇳</span>
            <span>CAPACITY BUILDING COMMISSION &bull; GOVERNMENT OF INDIA</span>
          </div>
          <h1 class="hero-headline">
            सक्षम &bull; राष्ट्रीय कार्यबल सक्षमता एवं क्षमता मानचित्रण पोर्टल
          </h1>
          <h2 class="hero-subheadline">
            National Workforce Capability & Competency Mapping Platform (Mission Karmayogi)
          </h2>
          <p class="hero-motto">
            <em>"From Rule-Based to Role-Based Governance"</em> — An institutional capacity governance platform aligning 2.5 million Indian public servants with structured competency mapping, statutory certification, and transparent capability gap tracking.
          </p>

          <!-- National Counter Stats -->
          <div class="hero-stats-grid">
            <div class="hero-stat-card">
              <div class="hero-stat-num">42+</div>
              <div class="hero-stat-label">Central Ministries Onboarded</div>
            </div>
            <div class="hero-stat-card">
              <div class="hero-stat-num">5,800+</div>
              <div class="hero-stat-label">Civil Servants Certified</div>
            </div>
            <div class="hero-stat-card">
              <div class="hero-stat-num">88.4%</div>
              <div class="hero-stat-label">Assessment Pass Rate</div>
            </div>
            <div class="hero-stat-card">
              <div class="hero-stat-num">24</div>
              <div class="hero-stat-label">Vetted Master Instructors</div>
            </div>
          </div>
        </div>

        <!-- Call to Action & Gateway Card -->
        <div class="hero-login-col">
          <div class="gov-card login-card-wrap">
            <div class="gov-card-header" style="background: var(--gov-navy); color: #ffffff;">
              <h3 style="color: #ffffff; font-size: 1.05rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                कार्मिक एवं प्रशिक्षक पोर्टल / Single Sign-On
              </h3>
              <span class="gov-badge gov-badge-warning" style="font-size: 0.68rem;">GIGW 3.0 SECURE</span>
            </div>
            <div class="gov-card-body" style="padding: 24px;">
              <p style="font-size: 0.86rem; color: var(--gov-text-secondary); line-height: 1.6; margin-bottom: 20px;">
                Access your personalized Capacity Building Desk, statutory timed MCQ assessments, institutional competency mapping, and training records.
              </p>

              <div style="display: flex; flex-direction: column; gap: 12px;">
                <button class="gov-btn gov-btn-primary" style="width: 100%; padding: 12px; font-size: 0.95rem;" onclick="window.sakshamApp.navigateTo('login')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                  Sign In to Portal / पोर्टल में प्रवेश करें &rarr;
                </button>

                <button class="gov-btn gov-btn-secondary" style="width: 100%; padding: 10px; font-size: 0.88rem;" onclick="window.sakshamHome.openRegisterModal()">
                  New Officer / Faculty Registration &rarr;
                </button>
              </div>

              <div style="margin-top: 20px; border-top: 1px solid var(--gov-border-subtle); padding-top: 14px; font-size: 0.76rem; color: var(--gov-text-muted); display: flex; align-items: center; gap: 8px;">
                <span style="color: var(--gov-green); font-size: 1.1rem;">🔒</span>
                <span>Authentication protected under Capacity Building Commission Security Directives 2026.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Karmayogi Competency Pillars -->
      <div style="margin: 36px 0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h3 style="color: var(--gov-navy); font-size: 1.35rem; font-weight: 800;">
            मिशन कर्मयोगी सक्षमता स्तंभ / The Three Competency Pillars
          </h3>
          <p style="font-size: 0.85rem; color: var(--gov-text-secondary); max-width: 700px; margin: 0 auto;">
            Structured civil service capability architecture aligning individual learning with institutional national priorities.
          </p>
        </div>

        <div class="pillars-grid">
          <div class="pillar-card">
            <div class="pillar-icon">🎯</div>
            <h4>Domain Competencies</h4>
            <p>Specialized subject knowledge mandated for specific ministries, including General Financial Rules (GFR 2017), GeM 4.0, and Critical Information Infrastructure Protection.</p>
            <span class="gov-tag" style="margin-top: 10px;">Subject & Cadre Specific</span>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon">⚙️</div>
            <h4>Functional Competencies</h4>
            <p>Cross-departmental operational proficiencies required across all secretariats: e-Office 7.0 digital docketing, DSC signing, cabinet note drafting, and audit compliance.</p>
            <span class="gov-tag" style="margin-top: 10px;">Universal Administrative Skills</span>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon">🏛️</div>
            <h4>Behavioral Competencies</h4>
            <p>Ethical leadership, citizen-centric service delivery, conflict mediation, and institutional responsiveness guiding public servants in administrative decision making.</p>
            <span class="gov-tag" style="margin-top: 10px;">Ethics & Public Value</span>
          </div>
        </div>
      </div>

      <!-- Featured Training Courses Showcase -->
      <div style="margin: 36px 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
          <div>
            <h3 style="color: var(--gov-navy); font-size: 1.25rem; font-weight: 800;">
              प्रमुख राष्ट्रीय प्रशिक्षण पाठ्यक्रम / Featured Capacity Programs
            </h3>
            <p style="font-size: 0.82rem; color: var(--gov-text-muted);">
              Mandatory credit modules accredited by the Capacity Building Commission
            </p>
          </div>
          <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="window.sakshamApp.navigateTo('public-courses')">
            View All Courses &rarr;
          </button>
        </div>

        <div class="courses-grid">
          ${courses.map(crs => {
            const trainer = this.store.data.users.find(u => u.id === crs.leadTrainerId);
            return `
              <div class="gov-course-card">
                <div class="course-card-banner">
                  <span class="course-dept-tag">${crs.department}</span>
                  <span class="course-credit-badge">${crs.credits} Credits &bull; ${crs.durationHours}h</span>
                </div>
                <div class="course-card-content">
                  <span class="gov-badge gov-badge-navy" style="margin-bottom: 8px; align-self: flex-start;">${crs.code}</span>
                  <h3>${crs.title}</h3>
                  <p>${crs.summary}</p>
                  <div style="font-size: 0.78rem; color: var(--gov-text-muted); margin-bottom: 12px;">
                    Lead Instructor: <strong>${trainer ? trainer.name : 'ISTM Faculty'}</strong>
                  </div>
                  <div style="border-top: 1px solid var(--gov-border-subtle); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span class="gov-tag">${crs.level}</span>
                    <button class="gov-btn gov-btn-primary gov-btn-sm" onclick="window.sakshamHome.viewPublicSyllabus('${crs.id}')">
                      Inspect Syllabus
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Gazette Bulletin & Notifications -->
      <div style="margin: 36px 0;">
        <div class="gov-table-container">
          <div class="table-toolbar">
            <h3 style="color: var(--gov-navy); font-size: 1rem; font-weight: 700;">
              नवीनतम राजपत्र परिपत्र एवं अधिसूचनाएँ / Gazette Circulars & Office Memorandums
            </h3>
            <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="window.sakshamApp.navigateTo('circulars')">
              Full Circulars Archive &rarr;
            </button>
          </div>
          <table class="gov-table">
            <thead>
              <tr>
                <th>Circular Reference</th>
                <th>Issuing Authority</th>
                <th>Title / Subject</th>
                <th>Date of Issue</th>
                <th>Gazette Status</th>
              </tr>
            </thead>
            <tbody>
              ${ann.map(a => `
                <tr>
                  <td><strong>${a.circularNo}</strong></td>
                  <td>${a.dept}</td>
                  <td>${a.title}</td>
                  <td>${a.date}</td>
                  <td>
                    ${a.urgent ? '<span class="gov-badge gov-badge-danger">URGENT COMPLIANCE</span>' : '<span class="gov-badge gov-badge-info">CIRCULATED</span>'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* 2. Dedicated Government Single Sign-On (SSO) Screen */
  renderLogin() {
    return `
      <div class="gov-login-container">
        <div class="gov-login-card">
          <div class="gov-login-header">
            <img src="assets/emblem.svg" alt="State Emblem" style="width: 44px; height: 54px; margin-bottom: 6px;" />
            <div style="font-size: 0.74rem; font-weight: 700; color: var(--gov-text-muted); text-transform: uppercase;">
              भारत सरकार &bull; GOVERNMENT OF INDIA
            </div>
            <h2>कार्मिक एवं प्रशिक्षक पोर्टल प्रवेश</h2>
            <p>Capacity Building Commission &bull; Single Sign-On Access Desk</p>
          </div>

          <div class="gov-login-body">
            <div id="login-alert-box" style="display: none; padding: 10px 14px; font-size: 0.82rem; border-radius: 4px; margin-bottom: 16px;"></div>

            <form id="dedicated-login-form" onsubmit="window.sakshamHome.handleLogin(event)">
              <div class="gov-form-group">
                <label class="gov-form-label">Official Email ID (@gov.in / @nic.in) <span class="required">*</span></label>
                <input type="email" id="login-email" class="gov-form-control" placeholder="name@gov.in" required />
              </div>

              <div class="gov-form-group">
                <label class="gov-form-label">Password <span class="required">*</span></label>
                <input type="password" id="login-password" class="gov-form-control" placeholder="••••••••" required />
              </div>

              <div style="background: #f8fafc; border: 1px solid var(--gov-border-subtle); padding: 10px 14px; border-radius: 4px; margin-bottom: 16px; font-size: 0.8rem; display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" id="gov-captcha-check" checked required />
                <label for="gov-captcha-check" style="cursor: pointer; color: var(--gov-text-primary);">
                  I certify that I am accessing this portal through authorized Government of India credentials.
                </label>
              </div>

              <button type="submit" class="gov-btn gov-btn-primary" style="width: 100%; padding: 11px; font-size: 0.95rem;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                Sign In / पोर्टल में लॉगिन करें &rarr;
              </button>
            </form>

            <!-- Subtle Quick Test Account Preset Selector -->
            <div class="subtle-demo-selector-box">
              <label for="demo-account-select">
                ⚡ Quick Account Preset (For Testing & Inspection):
              </label>
              <select id="demo-account-select" class="gov-form-control" style="font-size: 0.82rem;" onchange="window.sakshamHome.applyPreset(this.value)">
                <option value="">-- Choose Pre-Configured Account --</option>
                <option value="admin-1">Administrator: Sh. R.K. Sharma (admin@cbc.gov.in)</option>
                <option value="trainer-1">Master Trainer: Dr. Priya Venkatesh (priya.trainer@istm.gov.in)</option>
                <option value="trainer-2">Master Trainer: Col. Rajeshwar Rao (rajesh.trainer@cert-in.gov.in)</option>
                <option value="trainee-1">Trainee: Amit Verma, Under Secretary - Finance (amit.trainee@doe.gov.in)</option>
                <option value="trainee-2">Trainee: Sneha Kulkarni, Scientist D - MeitY (sneha.trainee@meity.gov.in)</option>
                <option value="trainee-3">Trainee: Rohit Meena, Executive Engineer - MoRTH (rohit.trainee@morth.gov.in)</option>
                <option value="trainee-4">Trainee: Ananya Sen, Section Officer - DoPT (ananya.trainee@dopt.gov.in)</option>
                <option value="trainer-pending">Applicant: Dr. Vikram Malhotra (Pending Approval Gate)</option>
              </select>
            </div>

            <div style="margin-top: 18px; text-align: center; font-size: 0.82rem; color: var(--gov-text-muted);">
              Need an official account? <a href="#register" onclick="window.sakshamHome.openRegisterModal(); return false;" style="color: var(--gov-saffron-dark); font-weight: 700;">New Officer Registration &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* 3. Public About & Capacity Building Commission Mandate Page */
  renderAbout() {
    return `
      <div class="about-hero-banner">
        <div style="font-size: 0.78rem; font-weight: 700; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px;">
          National Capacity Building Framework
        </div>
        <h1>क्षमता निर्माण आयोग / Capacity Building Commission (CBC)</h1>
        <p style="font-size: 0.95rem; opacity: 0.92; line-height: 1.6; max-width: 800px;">
          Constituted by the Government of India to drive standardized institutional capability enhancement, civil service modernization, and competency governance under Mission Karmayogi.
        </p>
      </div>

      <div class="about-card-section">
        <h3 style="color: var(--gov-navy); font-size: 1.2rem; font-weight: 800; margin-bottom: 8px;">
          Mandate & Statutory Objectives
        </h3>
        <p style="font-size: 0.88rem; color: var(--gov-text-secondary); line-height: 1.6;">
          Under the provisions of the National Training Policy and the Civil Services Capacity Building Mandate, the Commission exercises supervisory governance over training academies, faculty accreditation, and ministry-level capacity metrics:
        </p>

        <div class="mandate-points-list">
          <div class="mandate-point-item">
            <div class="mandate-point-icon">1</div>
            <div>
              <strong style="color: var(--gov-navy);">Transition from Rule-based to Role-based Governance:</strong>
              Aligning job profiles with specific Behavioral, Functional, and Domain competencies rather than generic administrative tenures.
            </div>
          </div>

          <div class="mandate-point-item">
            <div class="mandate-point-icon">2</div>
            <div>
              <strong style="color: var(--gov-navy);">Competency Mapping & Trainer Accreditation:</strong>
              Evaluating training faculty credentials against statutory subject prerequisites to ensure high-quality, standardized instruction across Central Ministries.
            </div>
          </div>

          <div class="mandate-point-item">
            <div class="mandate-point-icon">3</div>
            <div>
              <strong style="color: var(--gov-navy);">Institutional Capability Gap Monitoring:</strong>
              Evaluating organizational workforce capabilities across Ministries (Expenditure, MeitY, Road Transport, Personnel) to identify systemic training deficits.
            </div>
          </div>

          <div class="mandate-point-item">
            <div class="mandate-point-icon">4</div>
            <div>
              <strong style="color: var(--gov-navy);">Annual Capacity Building Plans (ACBPs):</strong>
              Ensuring all Group A, B, and C officers fulfill a minimum of 30 hours of continuous professional training annually.
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <button class="gov-btn gov-btn-primary" onclick="window.sakshamApp.navigateTo('login')">
          Access Portal & View Competency Profile &rarr;
        </button>
      </div>
    `;
  }

  /* 4. Public Course Catalog Page */
  renderPublicCourses() {
    const courses = this.store.data.courses;

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>राष्ट्रीय प्रशिक्षण पाठ्यक्रम निर्देशिका / National Training Catalog</h1>
          <p>Official capacity development modules accredited under the Capacity Building Commission Framework</p>
        </div>
        <div class="page-actions-group">
          <button class="gov-btn gov-btn-primary" onclick="window.sakshamApp.navigateTo('login')">
            Sign In to Enroll & Take Exams
          </button>
        </div>
      </div>

      <div class="courses-grid">
        ${courses.map(crs => {
          const trainer = this.store.data.users.find(u => u.id === crs.leadTrainerId);
          return `
            <div class="gov-course-card">
              <div class="course-card-banner">
                <span class="course-dept-tag">${crs.department}</span>
                <span class="course-credit-badge">${crs.credits} Credits &bull; ${crs.durationHours}h</span>
              </div>
              <div class="course-card-content">
                <span class="gov-badge gov-badge-navy" style="margin-bottom: 8px; align-self: flex-start;">${crs.code}</span>
                <h3>${crs.title}</h3>
                <p>${crs.summary}</p>
                <div style="font-size: 0.78rem; color: var(--gov-text-muted); margin-bottom: 12px;">
                  Accredited Faculty: <strong>${trainer ? trainer.name : 'ISTM Faculty'}</strong>
                </div>
                <div style="border-top: 1px solid var(--gov-border-subtle); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                  <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="window.sakshamHome.viewPublicSyllabus('${crs.id}')">
                    View Syllabus
                  </button>
                  <button class="gov-btn gov-btn-primary gov-btn-sm" onclick="window.sakshamApp.navigateTo('login')">
                    Enroll (Sign In Required)
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /* 5. Public Circulars Archive Page */
  renderCirculars() {
    const ann = this.store.data.announcements;

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>राजपत्र परिपत्र एवं अधिसूचनाएँ / Official Gazette Circulars Archive</h1>
          <p>Statutory notifications and office memorandums issued by the Capacity Building Commission & DoPT</p>
        </div>
        <div class="page-actions-group">
          <button class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.navigateTo('home')">
            &larr; Back to Home
          </button>
        </div>
      </div>

      <div class="gov-table-container">
        <table class="gov-table">
          <thead>
            <tr>
              <th>Circular Reference</th>
              <th>Issuing Authority</th>
              <th>Title / Subject</th>
              <th>Date of Notification</th>
              <th>Compliance Classification</th>
              <th>Document</th>
            </tr>
          </thead>
          <tbody>
            ${ann.map(a => `
              <tr>
                <td><strong>${a.circularNo}</strong></td>
                <td>${a.dept}</td>
                <td>${a.title}</td>
                <td>${a.date}</td>
                <td>
                  ${a.urgent ? '<span class="gov-badge gov-badge-danger">URGENT MANDATE</span>' : '<span class="gov-badge gov-badge-info">GENERAL CIRCULAR</span>'}
                </td>
                <td>
                  <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="alert('Viewing Official Notification Document: ${a.circularNo}');">
                    Download PDF
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* Helper Methods */
  applyPreset(userId) {
    if (!userId) return;
    const user = this.store.data.users.find(u => u.id === userId);
    if (!user) return;

    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    if (emailInput && passInput) {
      emailInput.value = user.email;
      passInput.value = user.password || 'Pass@2026';
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const alertBox = document.getElementById('login-alert-box');

    const result = this.auth.login(email, password);
    if (!result.success) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.style.background = '#fee2e2';
        alertBox.style.color = '#991b1b';
        alertBox.textContent = result.message;
      }
    }
  }

  viewPublicSyllabus(courseId) {
    const crs = this.store.data.courses.find(c => c.id === courseId);
    if (!crs) return;

    const body = `
      <div style="margin-bottom: 16px;">
        <span class="gov-badge gov-badge-navy">${crs.code}</span>
        <h3 style="color: var(--gov-navy); margin: 8px 0 4px;">${crs.title}</h3>
        <p style="font-size: 0.85rem; color: var(--gov-text-secondary);">${crs.summary}</p>
      </div>

      <div style="background: #f8fafc; border: 1px solid var(--gov-border); border-radius: var(--gov-radius-sm); padding: 14px; margin-bottom: 16px;">
        <div style="font-size: 0.82rem; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div><strong>Sponsoring Ministry:</strong> ${crs.department}</div>
          <div><strong>Duration:</strong> ${crs.durationHours} Training Hours</div>
          <div><strong>Credits:</strong> ${crs.credits} Credit Points</div>
          <div><strong>Competencies Covered:</strong> ${(crs.competenciesAddressed || []).join(', ')}</div>
        </div>
      </div>

      <h4 style="color: var(--gov-navy); font-size: 0.95rem; margin-bottom: 10px;">
        Syllabus Outline & Resources (${(crs.resources || []).length})
      </h4>

      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
        ${(crs.resources || []).map(r => `
          <div style="border: 1px solid var(--gov-border); border-radius: var(--gov-radius-sm); padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; background: #ffffff;">
            <div>
              <span class="gov-badge ${r.type === 'VIDEO' ? 'gov-badge-danger' : r.type === 'SLIDE' ? 'gov-badge-warning' : 'gov-badge-info'}">
                ${r.type}
              </span>
              <strong style="font-size: 0.85rem; color: var(--gov-navy); margin-left: 8px;">${r.title}</strong>
            </div>
            <span style="font-size: 0.74rem; color: var(--gov-text-muted);">${r.size || r.duration}</span>
          </div>
        `).join('')}
      </div>

      <div style="text-align: right;">
        <button class="gov-btn gov-btn-primary" onclick="window.sakshamApp.closeModal(); window.sakshamApp.navigateTo('login');">
          Sign In to Enroll in this Course &rarr;
        </button>
      </div>
    `;

    window.sakshamApp.openModal('Curriculum & Statutory Syllabus Overview', body);
  }

  openRegisterModal() {
    const body = `
      <form onsubmit="window.sakshamHome.handleRegister(event)">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="gov-form-group">
            <label class="gov-form-label">Full Name & Honorific <span class="required">*</span></label>
            <input type="text" class="gov-form-control" name="name" placeholder="E.g., Dr. Ramesh Gupta" required />
          </div>
          <div class="gov-form-group">
            <label class="gov-form-label">Official Email Address <span class="required">*</span></label>
            <input type="email" class="gov-form-control" name="email" placeholder="E.g., ramesh.g@gov.in" required />
          </div>
          <div class="gov-form-group">
            <label class="gov-form-label">Portal Account Role <span class="required">*</span></label>
            <select class="gov-form-control" name="role" id="reg-role-select" required onchange="window.sakshamHome.toggleRoleFields(this.value)">
              <option value="TRAINEE">Civil Servant / Officer (Trainee)</option>
              <option value="TRAINER">Master Trainer / Faculty (Approval Gate Required)</option>
            </select>
          </div>
          <div class="gov-form-group">
            <label class="gov-form-label">Password <span class="required">*</span></label>
            <input type="password" class="gov-form-control" name="password" value="Pass@2026" required />
          </div>
          <div class="gov-form-group">
            <label class="gov-form-label">Designation <span class="required">*</span></label>
            <input type="text" class="gov-form-control" name="designation" placeholder="E.g., Section Officer / Associate Prof" required />
          </div>
          <div class="gov-form-group">
            <label class="gov-form-label">Cadre / Parent Institute <span class="required">*</span></label>
            <input type="text" class="gov-form-control" name="cadre" placeholder="E.g., CSS / IIPA / State Academy" required />
          </div>
          <div class="gov-form-group" style="grid-column: span 2;">
            <label class="gov-form-label">Ministry / Department</label>
            <input type="text" class="gov-form-control" name="department" placeholder="E.g., Ministry of Personnel" required />
          </div>
          <div class="gov-form-group" style="grid-column: span 2;">
            <label class="gov-form-label">Highest Qualification & Terminal Degree</label>
            <input type="text" class="gov-form-control" name="highestDegree" placeholder="E.g., Ph.D. in Public Policy / M.Com" required />
          </div>
        </div>

        <div id="trainer-notice-box" style="display: none; background: #fffbeb; border: 1px solid #fde68a; padding: 10px; border-radius: 4px; font-size: 0.78rem; color: #92400e; margin-top: 10px;">
          ⚠️ <strong>Approval Gate Notice:</strong> Trainer registrations will be placed in status <code>PENDING_APPROVAL</code> for administrative vetting by the Capacity Building Commission before batch management privileges are enabled.
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px;">
          <button type="button" class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.closeModal()">Cancel</button>
          <button type="submit" class="gov-btn gov-btn-success">Complete Registration</button>
        </div>
      </form>
    `;

    window.sakshamApp.openModal('Civil Service & Instructor Registration Desk', body);
  }

  toggleRoleFields(role) {
    const box = document.getElementById('trainer-notice-box');
    if (box) {
      box.style.display = role === 'TRAINER' ? 'block' : 'none';
    }
  }

  handleRegister(e) {
    e.preventDefault();
    const f = e.target;

    const newUser = this.store.registerUser({
      name: f.name.value,
      email: f.email.value,
      password: f.password.value,
      role: f.role.value,
      designation: f.designation.value,
      cadre: f.cadre.value,
      department: f.department.value,
      highestDegree: f.highestDegree.value
    });

    window.sakshamApp.closeModal();

    if (newUser.role === 'TRAINER') {
      alert(`Registration received under Application Ref: ${newUser.applicationRef}. Account placed in administrative approval queue for CBC clearance.`);
    } else {
      alert(`Registration successful! Logged in as ${newUser.name}.`);
    }

    this.auth.quickLogin(newUser.id);
  }
}

window.sakshamHome = new SakshamHomePage();
