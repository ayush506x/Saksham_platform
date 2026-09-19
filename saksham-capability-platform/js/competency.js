/* ==========================================================================
   SAKSHAM (सक्षम) - Competency Mapping Engine (Core SIH Differentiator)
   Transforms Saksham from a simple LMS into a National Workforce Capability System
   Algorithms: Multi-Factor Trainer-to-Subject Fit & Institutional Gap Analysis
   ========================================================================== */

class SakshamCompetencyEngine {
  constructor() {
    this.store = window.sakshamStore;
    this.selectedSubjectId = 'SUBJ-FIN';
  }

  calculateTrainerFit(trainer, subject) {
    const q = trainer.qualifications || {};
    const weights = subject.importanceWeights || { qualification: 0.35, experience: 0.25, rating: 0.20, pedagogy: 0.20 };

    // 1. Domain Qualification Relevance (Degree + Certifications match)
    let qualScore = 60;
    const certs = (q.certifications || []).map(c => c.toLowerCase());
    const domains = (q.competencyDomains || []).map(d => d.toLowerCase());
    const degree = (q.highestDegree || '').toLowerCase();

    if (subject.id === 'SUBJ-FIN') {
      if (degree.includes('finance') || degree.includes('economics')) qualScore += 20;
      if (certs.some(c => c.includes('cpps') || c.includes('gfr') || c.includes('procurement'))) qualScore += 20;
    } else if (subject.id === 'SUBJ-CYB') {
      if (degree.includes('cyber') || degree.includes('computer')) qualScore += 20;
      if (certs.some(c => c.includes('cert-in') || c.includes('cissp') || c.includes('cism'))) qualScore += 20;
    } else if (subject.id === 'SUBJ-EOF') {
      if (degree.includes('computer') || degree.includes('public administration')) qualScore += 20;
      if (certs.some(c => c.includes('e-office') || c.includes('digital'))) qualScore += 20;
    }
    qualScore = Math.min(100, qualScore);

    // 2. Field & Cadre Experience (Years of Service vs Minimum)
    const yrs = q.yearsExperience || 5;
    const reqYrs = subject.minExperienceYears || 8;
    const expScore = Math.min(100, Math.round((yrs / reqYrs) * 90));

    // 3. Historical Trainee Rating (Scale 5.0 to 100)
    const rating = q.rating || 4.5;
    const ratingScore = Math.round((rating / 5.0) * 100);

    // 4. Pedagogical Track Record (Batches Trained)
    const batches = q.batchesTrained || 10;
    const pedaScore = Math.min(100, Math.round((batches / 40) * 100));

    // Weighted Aggregate Fit Score
    const overallFit = Math.round(
      (qualScore * weights.qualification) +
      (expScore * weights.experience) +
      (ratingScore * weights.rating) +
      (pedaScore * weights.pedagogy)
    );

    return {
      overallFit,
      breakdown: {
        qualScore,
        expScore,
        ratingScore,
        pedaScore
      },
      trainer,
      subject
    };
  }

  renderView() {
    const subjects = this.store.data.subjectsForMapping;
    const currentSubject = subjects.find(s => s.id === this.selectedSubjectId) || subjects[0];
    const approvedTrainers = this.store.data.users.filter(u => u.role === 'TRAINER' && u.status === 'APPROVED');

    // Run matching algorithm across all accredited trainers
    const matchResults = approvedTrainers
      .map(trainer => this.calculateTrainerFit(trainer, currentSubject))
      .sort((a, b) => b.overallFit - a.overallFit);

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>सक्षमता मानचित्रण एवं प्रशिक्षक मिलान / Competency Mapping & Trainer Matching Engine</h1>
          <p>
            <strong>Core SIH Innovation:</strong> Algorithmically matching trainer qualifications against statutory subject requirements to maximize institutional training efficacy.
          </p>
        </div>
        <div class="page-actions-group">
          <span class="gov-badge gov-badge-navy">Capacity Building Commission (CBC) Mandate</span>
        </div>
      </div>

      <!-- Subject Selector & Requirement Criteria Box -->
      <div class="competency-selector-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
          <div>
            <label class="gov-form-label" style="margin-bottom: 4px;">Target Subject / Statutory Training Domain:</label>
            <select class="gov-form-control" style="font-weight: 700; color: var(--gov-navy); min-width: 380px;" onchange="window.sakshamCompetency.selectSubject(this.value)">
              ${subjects.map(s => `
                <option value="${s.id}" ${s.id === currentSubject.id ? 'selected' : ''}>${s.title}</option>
              `).join('')}
            </select>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; color: var(--gov-text-muted);">Sponsoring Nodal Agency</div>
            <strong style="color: var(--gov-navy); font-size: 0.9rem;">${currentSubject.departmentMandate}</strong>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid var(--gov-border-subtle); border-radius: var(--gov-radius-sm); padding: 12px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; font-size: 0.82rem;">
          <div><strong>Prerequisite Degree:</strong> ${currentSubject.requiredDegree}</div>
          <div><strong>Min Field Experience:</strong> ${currentSubject.minExperienceYears} Years</div>
          <div><strong>Accreditation Norms:</strong> ${currentSubject.requiredCertifications.join(', ')}</div>
          <div><strong>Weightage Matrix:</strong> Qual (35%), Exp (25%), Rating (20%), Pedagogy (20%)</div>
        </div>
      </div>

      <!-- Match Results Grid -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 style="color: var(--gov-navy); font-size: 1.1rem; font-weight: 700;">
          प्रशिक्षक उपयुक्तता श्रेणीकरण / Ranked Trainer Competency Fit
        </h3>
        <span style="font-size: 0.8rem; color: var(--gov-text-muted);">Scored via multi-factor regression algorithm</span>
      </div>

      <div class="match-results-grid">
        ${matchResults.map((res, index) => {
          const t = res.trainer;
          const isBest = index === 0;
          const q = t.qualifications || {};
          const b = res.breakdown;

          return `
            <div class="trainer-match-card ${isBest ? 'best-match' : ''}">
              ${isBest ? `<div class="best-match-ribbon">⭐ Highest Recommended Fit</div>` : ''}

              <div class="match-score-header">
                <div class="trainer-meta">
                  <h4>${t.name}</h4>
                  <p>${t.designation} &bull; ${t.cadre}</p>
                </div>
                <div class="match-circle-score" style="border-color: ${isBest ? 'var(--gov-green)' : 'var(--gov-navy)'};">
                  ${res.overallFit}%
                  <span>FIT SCORE</span>
                </div>
              </div>

              <div style="font-size: 0.78rem; color: var(--gov-text-secondary); margin-bottom: 12px; background: #f8fafc; padding: 8px; border-radius: 4px;">
                <strong>Degree:</strong> ${q.highestDegree || 'Specialized Doctorate'}<br/>
                <strong>Experience:</strong> ${q.yearsExperience} yrs (${q.batchesTrained} batches instructed)
              </div>

              <!-- Multi-Factor Radar Breakdown -->
              <div class="radar-breakdown-list">
                <div class="radar-bar-item">
                  <div class="radar-bar-label">
                    <span>Domain Qualification Relevance</span>
                    <span>${b.qualScore}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill ${isBest ? 'green' : ''}" style="width: ${b.qualScore}%;"></div>
                  </div>
                </div>

                <div class="radar-bar-item">
                  <div class="radar-bar-label">
                    <span>Public Service Field Experience</span>
                    <span>${b.expScore}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill ${isBest ? 'green' : ''}" style="width: ${b.expScore}%;"></div>
                  </div>
                </div>

                <div class="radar-bar-item">
                  <div class="radar-bar-label">
                    <span>Trainee Pedagogical Satisfaction</span>
                    <span>${b.ratingScore}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill ${isBest ? 'green' : ''}" style="width: ${b.ratingScore}%;"></div>
                  </div>
                </div>

                <div class="radar-bar-item">
                  <div class="radar-bar-label">
                    <span>Secretariat Batch Throughput</span>
                    <span>${b.pedaScore}%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill ${isBest ? 'green' : ''}" style="width: ${b.pedaScore}%;"></div>
                  </div>
                </div>
              </div>

              <div style="margin-top: 16px; border-top: 1px solid var(--gov-border-subtle); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                <span class="gov-badge gov-badge-info">Rating: ★${q.rating || 4.8} / 5.0</span>
                <button class="gov-btn ${isBest ? 'gov-btn-success' : 'gov-btn-secondary'} gov-btn-sm" onclick="window.sakshamCompetency.assignTrainer('${t.id}', '${currentSubject.id}')">
                  ${isBest ? 'Assign as Lead Instructor' : 'Assign Faculty'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Institutional Capability Gap Matrix -->
      <div class="gov-table-container" style="margin-top: 30px;">
        <div class="table-toolbar">
          <h3 style="color: var(--gov-navy); font-size: 1rem; font-weight: 700;">
            संस्थागत क्षमता अंतराल मैट्रिक्स / Institutional Workforce Capability Gap Matrix
          </h3>
          <span class="gov-tag">iGOT Karmayogi Macro Analysis</span>
        </div>
        <table class="gov-table">
          <thead>
            <tr>
              <th>Central Ministry / Agency</th>
              <th>Mandated Officers</th>
              <th>Trained Personnel</th>
              <th>Compliance %</th>
              <th>Critical Skill Deficit</th>
              <th>Governance Action</th>
            </tr>
          </thead>
          <tbody>
            ${this.store.data.capabilityMatrix.map(m => `
              <tr>
                <td><strong>${m.ministry}</strong></td>
                <td>${m.mandatedOfficers} Officers</td>
                <td>${m.trainedOfficers} Certified</td>
                <td>
                  <strong>${m.complianceRate}</strong>
                  <div class="progress-track" style="margin-top: 4px;">
                    <div class="progress-fill ${m.status === 'ADEQUATE' ? 'green' : m.status === 'CRITICAL' ? 'danger' : 'saffron'}" style="width: ${m.complianceRate};"></div>
                  </div>
                </td>
                <td>
                  <div style="font-size: 0.8rem; color: var(--gov-danger); font-weight: 600;">${m.skillGaps.join(' &bull; ')}</div>
                </td>
                <td>
                  <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="alert('Deploying automated CBC training intervention for ${m.ministry}. Recommended Instructor: ${m.recommendedTrainers.join(', ')}');">
                    Deploy Solution
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  selectSubject(subjId) {
    this.selectedSubjectId = subjId;
    window.sakshamApp.navigateTo('competency-mapping');
  }

  assignTrainer(trainerId, subjId) {
    const t = this.store.data.users.find(u => u.id === trainerId);
    const s = this.store.data.subjectsForMapping.find(sub => sub.id === subjId);
    alert(`Official Administrative Order: ${t.name} formally designated as Lead Instructor for "${s.title}" pursuant to CBC Competency Fit evaluation.`);
  }
}

window.sakshamCompetency = new SakshamCompetencyEngine();
