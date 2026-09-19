/* ==========================================================================
   SAKSHAM (सक्षम) - Authentication & Approval Gate Engine
   Supports full email/password authentication, quick-fill demo logins,
   and bureaucratic approval gate workflows
   ========================================================================== */

class SakshamAuth {
  constructor() {
    this.store = window.sakshamStore;
  }

  generateBearerToken(user) {
    if (!user) return null;
    return `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      sub: user.id,
      name: user.name,
      role: user.role,
      status: user.status,
      dept: user.department,
      iss: 'https://clerk.saksham.gov.in',
      exp: Date.now() + 3600000
    }))}.mock_clerk_signature_saksham_2026`;
  }

  getCurrentUser() {
    return this.store.getCurrentUser();
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  getRole() {
    const u = this.getCurrentUser();
    return u ? u.role : 'GUEST';
  }

  getStatus() {
    const u = this.getCurrentUser();
    return u ? u.status : 'GUEST';
  }

  isApproved() {
    const u = this.getCurrentUser();
    return u && u.status === 'APPROVED';
  }

  isPendingApproval() {
    const u = this.getCurrentUser();
    return u && u.status === 'PENDING_APPROVAL';
  }

  login(email, password) {
    const user = this.store.authenticate(email, password);
    if (user) {
      console.log(`[Saksham Auth] Authenticated as ${user.name} (${user.role})`);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid Government email or password. Please verify credentials or use a 1-Click Demo Login pill.' };
  }

  quickLogin(userId) {
    const user = this.store.setCurrentUser(userId);
    if (user) {
      console.log(`[Saksham Auth] Quick logged in as ${user.name} (${user.role})`);
      return user;
    }
    return null;
  }

  logout() {
    this.store.setCurrentUser(null);
    console.log('[Saksham Auth] Session closed. Returned to Karmayogi Homepage.');
  }

  renderPendingGateScreen() {
    const u = this.getCurrentUser();
    return `
      <div class="gov-card" style="max-width: 780px; margin: 40px auto; border-top: 4px solid var(--gov-saffron);">
        <div class="gov-card-header" style="background: #fffbeb;">
          <h3 style="color: var(--gov-warning); font-size: 1.15rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            कार्यालयीन सत्यापन प्रगति पर / Application Under Administrative Verification
          </h3>
          <span class="gov-badge gov-badge-warning">VERIFICATION IN PROGRESS</span>
        </div>
        <div class="gov-card-body" style="padding: 24px;">
          <div style="background: #f8fafc; border: 1px solid var(--gov-border); border-radius: var(--gov-radius-sm); padding: 16px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.85rem;">
              <div><strong>Application Ref No:</strong> <span style="font-family: monospace; color: var(--gov-navy);">${u.applicationRef || 'SAKSHAM/2026/APP-7721'}</span></div>
              <div><strong>Applied Role:</strong> <span class="gov-badge gov-badge-navy">${u.role}</span></div>
              <div><strong>Applicant Name:</strong> ${u.name}</div>
              <div><strong>Parent Cadre/Cadre Body:</strong> ${u.cadre || 'State Administrative Academy'}</div>
              <div><strong>Submission Timestamp:</strong> ${u.dateJoined} 10:45 AM IST</div>
              <div><strong>Nodal Screening Desk:</strong> CBC Verification Cell, New Delhi</div>
            </div>
          </div>

          <p style="font-size: 0.9rem; color: var(--gov-text-secondary); margin-bottom: 16px; line-height: 1.6;">
            <strong>Government Vetting Protocol Note:</strong> In accordance with the <em>Capacity Building Commission (CBC) Instructor Accreditation Mandate 2026</em>, all Trainer accounts require mandatory document scrutiny (Doctoral/PG credentials, No Objection Certificate from parent administrative cadre, and past training track-record) before authorization to publish questionnaires, review trainee scores, or upload syllabus materials.
          </p>

          <div style="border-left: 3px solid var(--gov-navy); padding-left: 14px; margin-bottom: 24px; font-size: 0.82rem; color: var(--gov-text-muted);">
            Estimated Scrutiny Turnaround: <strong>2 Working Days</strong>. You will receive an SMS and official NIC email alert once approved by the Joint Secretary (Admin).
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end; align-items: center; border-top: 1px solid var(--gov-border-subtle); padding-top: 16px;">
            <button class="gov-btn gov-btn-secondary" onclick="window.sakshamAuth.logout();">
              Sign Out to Homepage
            </button>
            <button class="gov-btn gov-btn-success" onclick="window.sakshamStore.approveUser('${u.id}'); window.sakshamAuth.quickLogin('${u.id}');">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              [Demo Fast-Track: Approve Instantly as Admin]
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

window.sakshamAuth = new SakshamAuth();
