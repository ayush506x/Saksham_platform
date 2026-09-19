/* ==========================================================================
   SAKSHAM (सक्षम) - Admin Module
   Verification Desk (Approval Gate), User Management, Executive Capacity Dashboard,
   Official Content Publishing
   ========================================================================== */

class SakshamAdminModule {
  constructor() {
    this.store = window.sakshamStore;
  }

  renderDashboard() {
    const users = this.store.data.users;
    const courses = this.store.data.courses;
    const enrollments = this.store.data.enrollments;
    const pending = users.filter(u => u.status === 'PENDING_APPROVAL');
    const trainers = users.filter(u => u.role === 'TRAINER' && u.status === 'APPROVED');
    const trainees = users.filter(u => u.role === 'TRAINEE');

    const totalEnrolledOfficers = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), enrollments.length);

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>क्षमता निर्माण आयोग - प्रशासनिक नियंत्रण कक्ष / Executive Capacity Governance Desk</h1>
          <p>National Mission Karmayogi Capacity Building Commission Oversight Dashboard</p>
        </div>
        <div class="page-actions-group">
          <button class="gov-btn gov-btn-warning" onclick="window.sakshamApp.navigateTo('admin-verification')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Verification Desk (${pending.length} Pending)
          </button>
          <button class="gov-btn gov-btn-primary" onclick="window.sakshamAdmin.openPublishAnnouncementModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Publish Gazette Circular
          </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-info-group">
            <div class="kpi-title">Officers Trained Org-wide</div>
            <div class="kpi-value">${totalEnrolledOfficers.toLocaleString()}</div>
            <div class="kpi-subtext">Across 42 Central Ministries & Departments</div>
          </div>
          <div class="kpi-icon-badge">🏛️</div>
        </div>

        <div class="kpi-card green-top">
          <div class="kpi-info-group">
            <div class="kpi-title">Certified Lead Trainers</div>
            <div class="kpi-value">${trainers.length} <span style="font-size: 0.9rem; font-weight: normal;">Active</span></div>
            <div class="kpi-subtext">Vetted under CBC Quality Framework</div>
          </div>
          <div class="kpi-icon-badge">👨‍🏫</div>
        </div>

        <div class="kpi-card saffron-top">
          <div class="kpi-info-group">
            <div class="kpi-title">Pending Vetting Queue</div>
            <div class="kpi-value">${pending.length} <span style="font-size: 0.9rem; font-weight: normal;">Applications</span></div>
            <div class="kpi-subtext">Awaiting administrative clearance</div>
          </div>
          <div class="kpi-icon-badge">⏳</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-info-group">
            <div class="kpi-title">National Assessment Pass Rate</div>
            <div class="kpi-value">88.4%</div>
            <div class="kpi-subtext">Statutory cutoff benchmark: 60%</div>
          </div>
          <div class="kpi-icon-badge">📈</div>
        </div>
      </div>

      <!-- Institutional Capacity Table -->
      <div class="gov-table-container">
        <div class="table-toolbar">
          <h3 style="color: var(--gov-navy); font-size: 1rem; font-weight: 700;">
            मंत्रालय-वार क्षमता निर्माण अनुपालन / Ministry-wise Capacity Compliance Roster
          </h3>
          <button class="gov-btn gov-btn-secondary gov-btn-sm" onclick="window.sakshamApp.navigateTo('competency-mapping')">
            Open Capability Matrix &rarr;
          </button>
        </div>
        <table class="gov-table">
          <thead>
            <tr>
              <th>Central Ministry / Department</th>
              <th>Mandated Quota</th>
              <th>Certified Officers</th>
              <th>Compliance Rate</th>
              <th>Identified Capability Gap</th>
              <th>Governance Status</th>
            </tr>
          </thead>
          <tbody>
            ${this.store.data.capabilityMatrix.map(m => `
              <tr>
                <td><strong>${m.ministry}</strong></td>
                <td>${m.mandatedOfficers} Officers</td>
                <td><strong>${m.trainedOfficers}</strong></td>
                <td>
                  <div style="font-size: 0.8rem; font-weight: 700; margin-bottom: 2px;">${m.complianceRate}</div>
                  <div class="progress-track">
                    <div class="progress-fill ${m.status === 'ADEQUATE' ? 'green' : m.status === 'CRITICAL' ? 'danger' : 'saffron'}" style="width: ${m.complianceRate};"></div>
                  </div>
                </td>
                <td>
                  <div style="font-size: 0.78rem; color: var(--gov-text-muted);">${m.skillGaps.join(', ')}</div>
                </td>
                <td>
                  <span class="matrix-status-cell ${m.status.toLowerCase()}">${m.status}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderVerificationDesk() {
    const pending = this.store.data.users.filter(u => u.status === 'PENDING_APPROVAL');

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>सत्यापन एवं अनुमोदन डेस्क / Administrative Verification Desk</h1>
          <p>Vetting queue enforcing statutory government approval gates before instructor credentials go live</p>
        </div>
        <div class="page-actions-group">
          <button class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.navigateTo('admin-dashboard')">
            &larr; Executive Dashboard
          </button>
        </div>
      </div>

      <div class="gov-table-container">
        <div class="table-toolbar">
          <h3 style="color: var(--gov-navy); font-size: 1rem; font-weight: 700;">
            Pending Registration & Instructor Vetting Applications (${pending.length})
          </h3>
          <span class="gov-tag">CBC Clearance Queue</span>
        </div>
        <table class="gov-table">
          <thead>
            <tr>
              <th>Application Ref & Candidate</th>
              <th>Applied Role</th>
              <th>Parent Institute / Cadre</th>
              <th>Submitted Qualifications</th>
              <th>Submission Date</th>
              <th>Official Scrutiny Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pending.length === 0 ? `
              <tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--gov-text-muted);">The administrative verification queue is clear. No pending applications.</td></tr>
            ` : pending.map(u => {
              const q = u.qualifications || {};
              return `
                <tr>
                  <td>
                    <strong>${u.name}</strong>
                    <div style="font-family: monospace; font-size: 0.74rem; color: var(--gov-navy);">${u.applicationRef || 'SAK-2026-APP'}</div>
                    <div style="font-size: 0.76rem; color: var(--gov-text-muted);">${u.email}</div>
                  </td>
                  <td><span class="gov-badge gov-badge-warning">${u.role}</span></td>
                  <td>${u.cadre}</td>
                  <td>
                    <div style="font-size: 0.8rem; font-weight: 600;">${q.highestDegree || 'Doctoral Credentials'}</div>
                    <div style="font-size: 0.74rem; color: var(--gov-text-muted);">${q.yearsExperience || 8} yrs experience &bull; ${(q.certifications || []).join(', ')}</div>
                  </td>
                  <td>${u.dateJoined}</td>
                  <td>
                    <div style="display: flex; gap: 8px;">
                      <button class="gov-btn gov-btn-success gov-btn-sm" onclick="window.sakshamAdmin.approveUser('${u.id}')">
                        Approve & Accredit
                      </button>
                      <button class="gov-btn gov-btn-secondary gov-btn-sm" style="color: var(--gov-danger);" onclick="window.sakshamAdmin.rejectUser('${u.id}')">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderUserManagement() {
    const users = this.store.data.users;

    return `
      <div class="page-header-row">
        <div class="page-title-group">
          <h1>उपयोगकर्ता एवं भूमिका प्रबंधन / User Directory & Role Delegation</h1>
          <p>Reassign roles, audit administrative permissions, and deactivate inactive service accounts</p>
        </div>
        <div class="page-actions-group">
          <input type="text" class="table-search-input" placeholder="Search civil servants by name or cadre..." onkeyup="window.sakshamAdmin.filterUsers(this.value)" />
        </div>
      </div>

      <div class="gov-table-container">
        <table class="gov-table" id="admin-user-table">
          <thead>
            <tr>
              <th>Civil Servant / Officer</th>
              <th>Ministry & Cadre</th>
              <th>System Role</th>
              <th>Clearance Status</th>
              <th>Delegated Authority Actions</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr data-name="${u.name.toLowerCase()} ${u.email.toLowerCase()} ${u.role.toLowerCase()}">
                <td>
                  <strong>${u.name}</strong>
                  <div style="font-size: 0.74rem; color: var(--gov-text-muted);">${u.email}</div>
                </td>
                <td>
                  <div>${u.department || 'Central Secretariat'}</div>
                  <div style="font-size: 0.74rem; color: var(--gov-text-muted);">${u.cadre || 'General Administration'}</div>
                </td>
                <td>
                  <span class="gov-badge ${u.role === 'ADMIN' ? 'gov-badge-danger' : u.role === 'TRAINER' ? 'gov-badge-navy' : 'gov-badge-info'}">
                    ${u.role}
                  </span>
                </td>
                <td>
                  <span class="gov-badge ${u.status === 'APPROVED' ? 'gov-badge-success' : 'gov-badge-warning'}">
                    ${u.status}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <select class="gov-form-control" style="width: auto; padding: 3px 8px; font-size: 0.78rem;" onchange="window.sakshamAdmin.changeRole('${u.id}', this.value)">
                      <option value="TRAINEE" ${u.role === 'TRAINEE' ? 'selected' : ''}>Role: Trainee</option>
                      <option value="TRAINER" ${u.role === 'TRAINER' ? 'selected' : ''}>Role: Trainer</option>
                      <option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>Role: Admin</option>
                    </select>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  filterUsers(query) {
    const q = query.toLowerCase();
    const rows = document.querySelectorAll('#admin-user-table tbody tr');
    rows.forEach(r => {
      const txt = r.getAttribute('data-name');
      r.style.display = txt.includes(q) ? '' : 'none';
    });
  }

  approveUser(userId) {
    this.store.approveUser(userId);
    alert('Application officially approved. Instructor granted full access to batch authoring and trainee monitoring.');
    window.sakshamApp.navigateTo('admin-verification');
  }

  rejectUser(userId) {
    if (confirm('Are you sure you want to reject this application? An official notification will be transmitted.')) {
      this.store.rejectUser(userId);
      window.sakshamApp.navigateTo('admin-verification');
    }
  }

  changeRole(userId, newRole) {
    this.store.reassignUserRole(userId, newRole);
    alert(`System privileges updated: User re-assigned as ${newRole}.`);
  }

  openPublishAnnouncementModal() {
    const body = `
      <form onsubmit="window.sakshamAdmin.publishAnnouncement(event)">
        <div class="gov-form-group">
          <label class="gov-form-label">Gazette Circular / Notice Title <span class="required">*</span></label>
          <input type="text" class="gov-form-control" name="title" placeholder="E.g., Circular on Compulsory e-Office 7.0 Certification for Under Secretaries" required />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="gov-form-group">
            <label class="gov-form-label">Official Circular Reference Number <span class="required">*</span></label>
            <input type="text" class="gov-form-control" name="circularNo" value="CBC/2026/NOTIF-${Math.floor(100 + Math.random() * 900)}" required />
          </div>
          <div class="gov-form-group">
            <label class="gov-form-label">Issuing Department</label>
            <input type="text" class="gov-form-control" name="dept" value="Capacity Building Commission" required />
          </div>
        </div>
        <div class="gov-form-group">
          <label class="gov-form-label">
            <input type="checkbox" name="urgent" /> Flag as Urgent Gazette Update (Red Banner Highlight)
          </label>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
          <button type="button" class="gov-btn gov-btn-secondary" onclick="window.sakshamApp.closeModal()">Cancel</button>
          <button type="submit" class="gov-btn gov-btn-success">Publish to Public Portal</button>
        </div>
      </form>
    `;

    window.sakshamApp.openModal('Publish Official Gazette Notification', body);
  }

  publishAnnouncement(e) {
    e.preventDefault();
    const f = e.target;
    this.store.addAnnouncement({
      id: `ANN-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      circularNo: f.circularNo.value,
      title: f.title.value,
      dept: f.dept.value,
      urgent: f.urgent.checked
    });
    alert('Gazette circular published. Broadcasted to homepage marquee and trainee notice boards.');
    window.sakshamApp.closeModal();
    window.location.reload();
  }
}

window.sakshamAdmin = new SakshamAdminModule();
