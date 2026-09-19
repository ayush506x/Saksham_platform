/* ==========================================================================
   SAKSHAM (सक्षम) - Course & Skill Recommendation Engine
   Analyzes Civil Servant Cadre, Department Mandates & Competency Deficits
   Provides transparent administrative justifications for each recommendation
   ========================================================================== */

class SakshamRecommendationEngine {
  constructor() {
    this.store = window.sakshamStore;
  }

  getRecommendationsForUser(user) {
    if (!user || user.role !== 'TRAINEE') return [];

    const prof = user.profile || {};
    const enrolledIds = this.store.data.enrollments
      .filter(e => e.userId === user.id)
      .map(e => e.courseId);

    const availableCourses = this.store.data.courses.filter(c => !enrolledIds.includes(c.id));
    const recommendations = [];

    availableCourses.forEach(crs => {
      let matchScore = 50;
      let reasons = [];

      // 1. Cadre Mandate Match
      if (user.cadre && (user.cadre.includes('CSS') || user.cadre.includes('Secretariat'))) {
        if (crs.code.includes('EOF') || crs.code.includes('FIN')) {
          matchScore += 35;
          reasons.push(`Statutory Mandate for ${user.designation || 'Under Secretary'} Cadre`);
        }
      }

      // 2. Department Alignment Match
      if (user.department && crs.department && user.department.toLowerCase().includes('finance')) {
        if (crs.category.includes('Finance') || crs.category.includes('Procurement')) {
          matchScore += 25;
          reasons.push(`Priority Area for Department of Expenditure`);
        }
      }

      // 3. Learning Interests & Skill Match
      const interests = (prof.learningInterests || []).map(i => i.toLowerCase());
      const titleLower = crs.title.toLowerCase();
      const summaryLower = crs.summary.toLowerCase();

      interests.forEach(interest => {
        if (titleLower.includes(interest) || summaryLower.includes(interest)) {
          matchScore += 20;
          reasons.push(`Matches your stated capacity building interest: "${interest}"`);
        }
      });

      // 4. Institutional Capability Gap Match
      const deptGap = this.store.data.capabilityMatrix.find(m => m.ministry.toLowerCase().includes('expenditure'));
      if (deptGap && deptGap.skillGaps.some(g => titleLower.includes('gem') || titleLower.includes('procurement'))) {
        matchScore += 25;
        reasons.push(`Directly bridges Ministry Skill Gap: GeM Reverse Auctioning`);
      }

      recommendations.push({
        course: crs,
        matchScore: Math.min(99, matchScore),
        primaryReason: reasons[0] || 'Recommended under Mission Karmayogi Annual Training Plan',
        allReasons: reasons
      });
    });

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  renderRecommendations() {
    const user = this.store.getCurrentUser();
    const recs = this.getRecommendationsForUser(user);

    if (recs.length === 0) {
      return `
        <div style="background: #ffffff; border: 1px solid var(--gov-border); padding: 18px; border-radius: var(--gov-radius-md); text-align: center; color: var(--gov-text-muted);">
          All recommended cadre training programs are currently enrolled or completed.
        </div>
      `;
    }

    return `
      <div class="courses-grid">
        ${recs.map(rec => {
          const crs = rec.course;
          const trainer = this.store.data.users.find(u => u.id === crs.leadTrainerId);
          return `
            <div class="gov-course-card">
              <div class="course-card-banner">
                <span class="course-dept-tag">${crs.department}</span>
                <span class="course-credit-badge">Fit Score: ${rec.matchScore}% &bull; ${crs.credits} Credits</span>
              </div>
              <div class="course-card-content">
                <div class="recommendation-reason-tag">
                  💡 ${rec.primaryReason}
                </div>
                <h3>${crs.code}: ${crs.title}</h3>
                <p>${crs.summary}</p>
                <div style="font-size: 0.78rem; color: var(--gov-text-muted); margin-bottom: 12px;">
                  Accredited Lead Faculty: <strong>${trainer ? trainer.name : 'ISTM Expert Panel'}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--gov-border-subtle); padding-top: 12px;">
                  <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="window.sakshamTrainee.viewResources('${crs.id}')">
                    Inspect Syllabus
                  </button>
                  <button class="gov-btn gov-btn-success gov-btn-sm" onclick="window.sakshamTrainee.enroll('${crs.id}')">
                    One-Click Enroll
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

window.sakshamRecommendation = new SakshamRecommendationEngine();
