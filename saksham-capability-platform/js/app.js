/* ==========================================================================
   SAKSHAM (सक्षम) - Central Application Orchestrator
   Authentic Government Portal Router, Breadcrumbs, Authentication Guards
   ========================================================================== */

class SakshamApp {
  constructor() {
    this.store = window.sakshamStore;
    this.auth = window.sakshamAuth;
    this.currentView = 'home';
    this.fontSizeOffset = 0;

    this.protectedViews = [
      'trainee-dashboard', 'trainee-profile', 'course-catalog',
      'trainer-dashboard', 'trainer-monitoring', 'trainer-library', 'trainer-profile',
      'admin-dashboard', 'admin-verification', 'admin-users', 'competency-mapping'
    ];
  }

  init() {
    this.bindEvents();
    
    // Check if user has active session, otherwise default to public home
    const user = this.auth.getCurrentUser();
    if (user) {
      if (user.status === 'PENDING_APPROVAL') {
        this.currentView = 'pending-gate';
      } else if (user.role === 'ADMIN') {
        this.currentView = 'admin-dashboard';
      } else if (user.role === 'TRAINER') {
        this.currentView = 'trainer-dashboard';
      } else {
        this.currentView = 'trainee-dashboard';
      }
    } else {
      this.currentView = 'home';
    }

    this.updateUserContext();
    this.renderNavbar();
    this.renderSidebar();
    this.renderBreadcrumbs();
    this.renderView();
    this.renderChatbot();
    this.populateTicker();
  }

  bindEvents() {
    window.addEventListener('saksham:user-changed', (e) => {
      const u = e.detail;
      if (u) {
        if (u.status === 'PENDING_APPROVAL') {
          this.currentView = 'pending-gate';
        } else if (u.role === 'ADMIN') {
          this.currentView = 'admin-dashboard';
        } else if (u.role === 'TRAINER') {
          this.currentView = 'trainer-dashboard';
        } else {
          this.currentView = 'trainee-dashboard';
        }
      } else {
        this.currentView = 'home';
      }
      this.updateUserContext();
      this.renderNavbar();
      this.renderSidebar();
      this.renderBreadcrumbs();
      this.renderView();
    });

    window.addEventListener('saksham:data-updated', () => {
      this.updateUserContext();
      this.renderNavbar();
      this.renderSidebar();
      this.renderBreadcrumbs();
      this.renderView();
      this.populateTicker();
    });
  }

  updateUserContext() {
    const u = this.auth.getCurrentUser();
    const avatarElem = document.getElementById('user-avatar-text');
    const nameElem = document.getElementById('user-name-text');
    const cadreElem = document.getElementById('user-cadre-text');
    const headerActions = document.getElementById('header-actions-mount');
    const sidebar = document.getElementById('portal-sidebar');

    if (u) {
      if (avatarElem) avatarElem.textContent = u.avatar || u.name.slice(0, 2).toUpperCase();
      if (nameElem) nameElem.textContent = u.name;
      if (cadreElem) cadreElem.textContent = `${u.role} &bull; ${u.department || 'Central Secretariat'}`;
      if (sidebar) sidebar.style.display = 'flex';

      if (headerActions) {
        headerActions.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="text-align: right;">
              <div style="font-size: 0.88rem; font-weight: 700; color: var(--gov-navy);">${u.name}</div>
              <div style="font-size: 0.74rem; color: var(--gov-text-muted);">${u.designation} (${u.role})</div>
            </div>
            <button class="gov-btn gov-btn-secondary gov-btn-sm" style="color: var(--gov-danger); border-color: #fecaca; background: #fff5f5;" onclick="window.sakshamApp.signOut()" title="Sign Out of Portal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Sign Out / लॉगआउट
            </button>
          </div>
        `;
      }
    } else {
      if (sidebar) sidebar.style.display = 'none';
      if (headerActions) {
        headerActions.innerHTML = `
          <button class="gov-btn gov-btn-primary gov-btn-sm" onclick="window.sakshamApp.navigateTo('login')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            Sign In / लॉगिन करें
          </button>
        `;
      }
    }
  }

  renderNavbar() {
    const navMount = document.getElementById('primary-nav-mount');
    if (!navMount) return;

    const u = this.auth.getCurrentUser();
    let links = [
      { id: 'home', label: 'Home / मुख्य पृष्ठ' },
      { id: 'about', label: 'About Commission / परिचय' },
      { id: 'public-courses', label: 'Training Catalog / पाठ्यक्रम' },
      { id: 'circulars', label: 'Gazette Circulars / परिपत्र' }
    ];

    if (u) {
      if (u.role === 'TRAINEE') {
        links.push({ id: 'trainee-dashboard', label: 'My Learning Desk / डैशबोर्ड' });
      } else if (u.role === 'TRAINER') {
        links.push({ id: 'trainer-dashboard', label: 'Trainer Console / कंसोल' });
      } else if (u.role === 'ADMIN') {
        links.push({ id: 'admin-dashboard', label: 'Executive Governance / नियंत्रण कक्ष' });
      }
    } else {
      links.push({ id: 'login', label: 'Portal Sign-In / प्रवेश' });
    }

    navMount.innerHTML = links.map(link => `
      <li class="gov-nav-item">
        <a class="gov-nav-link ${this.currentView === link.id ? 'active' : ''}" onclick="window.sakshamApp.navigateTo('${link.id}')">
          ${link.label}
        </a>
      </li>
    `).join('');
  }

  renderBreadcrumbs() {
    const breadcrumbMount = document.getElementById('breadcrumbs-mount');
    if (!breadcrumbMount) return;

    const u = this.auth.getCurrentUser();
    let crumbs = [
      `<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('home')">Home</a>`
    ];

    switch (this.currentView) {
      case 'home':
        crumbs.push(`<span class="breadcrumb-current">Portal Overview</span>`);
        break;
      case 'about':
        crumbs.push(`<span class="breadcrumb-current">About Capacity Building Commission</span>`);
        break;
      case 'public-courses':
        crumbs.push(`<span class="breadcrumb-current">National Training Catalog</span>`);
        break;
      case 'circulars':
        crumbs.push(`<span class="breadcrumb-current">Gazette Circulars Archive</span>`);
        break;
      case 'login':
        crumbs.push(`<span class="breadcrumb-current">Civil Servant Sign-In</span>`);
        break;
      case 'trainee-dashboard':
        crumbs.push(`<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('trainee-dashboard')">Trainee Portal</a>`);
        crumbs.push(`<span class="breadcrumb-current">Learning & Competency Desk</span>`);
        break;
      case 'trainee-profile':
        crumbs.push(`<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('trainee-dashboard')">Trainee Portal</a>`);
        crumbs.push(`<span class="breadcrumb-current">Civil Service Profile Builder</span>`);
        break;
      case 'course-catalog':
        crumbs.push(`<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('trainee-dashboard')">Trainee Portal</a>`);
        crumbs.push(`<span class="breadcrumb-current">Course Catalog & Enrollment</span>`);
        break;
      case 'trainer-dashboard':
        crumbs.push(`<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('trainer-dashboard')">Trainer Portal</a>`);
        crumbs.push(`<span class="breadcrumb-current">Instructional Console</span>`);
        break;
      case 'trainer-monitoring':
        crumbs.push(`<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('trainer-dashboard')">Trainer Portal</a>`);
        crumbs.push(`<span class="breadcrumb-current">Early-Warning Monitoring Desk</span>`);
        break;
      case 'trainer-library':
        crumbs.push(`<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('trainer-dashboard')">Trainer Portal</a>`);
        crumbs.push(`<span class="breadcrumb-current">Central Study Library</span>`);
        break;
      case 'trainer-profile':
        crumbs.push(`<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('trainer-dashboard')">Trainer Portal</a>`);
        crumbs.push(`<span class="breadcrumb-current">Accreditation Portfolio</span>`);
        break;
      case 'admin-dashboard':
        crumbs.push(`<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('admin-dashboard')">Admin Portal</a>`);
        crumbs.push(`<span class="breadcrumb-current">Executive Capacity Governance Desk</span>`);
        break;
      case 'admin-verification':
        crumbs.push(`<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('admin-dashboard')">Admin Portal</a>`);
        crumbs.push(`<span class="breadcrumb-current">Approval Gate Verification Desk</span>`);
        break;
      case 'admin-users':
        crumbs.push(`<a class="breadcrumb-link" onclick="window.sakshamApp.navigateTo('admin-dashboard')">Admin Portal</a>`);
        crumbs.push(`<span class="breadcrumb-current">User Directory & Permissions</span>`);
        break;
      case 'competency-mapping':
        crumbs.push(`<span class="breadcrumb-current">Competency Mapping & Capability Matrix</span>`);
        break;
      case 'pending-gate':
        crumbs.push(`<span class="breadcrumb-current">Administrative Scrutiny Clearance</span>`);
        break;
      default:
        crumbs.push(`<span class="breadcrumb-current">${this.currentView}</span>`);
    }

    breadcrumbMount.innerHTML = crumbs.join(' &gt; ');
  }

  navigateTo(viewId) {
    // Authentication Guard for protected views
    if (this.protectedViews.includes(viewId) && !this.auth.isAuthenticated()) {
      alert('Access Restricted: Please sign in with your official Government credentials to access this portal.');
      this.currentView = 'login';
    } else {
      this.currentView = viewId;
    }

    this.renderNavbar();
    this.renderSidebar();
    this.renderBreadcrumbs();
    this.renderView();
    window.scrollTo(0, 0);
  }

  signOut() {
    this.auth.logout();
    this.currentView = 'home';
    this.updateUserContext();
    this.renderNavbar();
    this.renderSidebar();
    this.renderBreadcrumbs();
    this.renderView();
    window.scrollTo(0, 0);
  }

  renderSidebar() {
    const user = this.auth.getCurrentUser();
    const navMount = document.getElementById('sidebar-nav-mount');
    if (!navMount) return;

    if (!user) {
      navMount.innerHTML = '';
      return;
    }

    const isApproved = user.status === 'APPROVED';
    const role = user.role;

    if (!isApproved) {
      navMount.innerHTML = `
        <div class="sidebar-nav-heading">Clearance Status</div>
        <li class="sidebar-nav-item">
          <a class="sidebar-nav-link active" onclick="window.sakshamApp.navigateTo('pending-gate')">
            <span class="left-content">
              <span>⏳</span>
              <span>Verification Status</span>
            </span>
          </a>
        </li>
      `;
      return;
    }

    let items = [];

    if (role === 'TRAINEE') {
      items = [
        { id: 'trainee-dashboard', label: 'प्रशिक्षार्थी डैशबोर्ड / Learning Desk', icon: '📊' },
        { id: 'course-catalog', label: 'पाठ्यक्रम सूची / Course Catalog', icon: '📚' },
        { id: 'trainee-profile', label: 'क्षमता प्रोफ़ाइल / Profile Builder', icon: '📝' },
        { id: 'competency-mapping', label: 'सक्षमता मानचित्रण / Competency Map', icon: '🎯' }
      ];
    } else if (role === 'TRAINER') {
      items = [
        { id: 'trainer-dashboard', label: 'प्रशिक्षक कंसोल / Instructor Desk', icon: '📊' },
        { id: 'trainer-monitoring', label: 'प्रारंभिक चेतावनी / Early-Warning', icon: '⚠️' },
        { id: 'trainer-library', label: 'केंद्रीय पुस्तकालय / Study Library', icon: '📁' },
        { id: 'trainer-profile', label: 'योग्यता पोर्टफोलियो / Portfolio', icon: '🏅' },
        { id: 'competency-mapping', label: 'प्रशिक्षक मिलान / Competency Match', icon: '🎯' }
      ];
    } else if (role === 'ADMIN') {
      items = [
        { id: 'admin-dashboard', label: 'कार्यकारी डैशबोर्ड / Capacity Desk', icon: '🏛️' },
        { id: 'admin-verification', label: 'सत्यापन कतार / Verification Desk', icon: '🛡️' },
        { id: 'admin-users', label: 'उपयोगकर्ता निर्देशिका / User Directory', icon: '👥' },
        { id: 'competency-mapping', label: 'सक्षमता मैट्रिक्स / Competency Engine', icon: '🎯' }
      ];
    }

    navMount.innerHTML = `
      <div class="sidebar-nav-heading">${role} PORTAL</div>
      ${items.map(item => `
        <li class="sidebar-nav-item">
          <a class="sidebar-nav-link ${this.currentView === item.id ? 'active' : ''}" onclick="window.sakshamApp.navigateTo('${item.id}')">
            <span class="left-content">
              <span>${item.icon}</span>
              <span>${item.label}</span>
            </span>
          </a>
        </li>
      `).join('')}
    `;
  }

  renderView() {
    const main = document.getElementById('main-workspace');
    if (!main) return;

    if (!this.auth.isAuthenticated()) {
      switch (this.currentView) {
        case 'about':
          main.innerHTML = window.sakshamHome.renderAbout();
          break;
        case 'public-courses':
          main.innerHTML = window.sakshamHome.renderPublicCourses();
          break;
        case 'circulars':
          main.innerHTML = window.sakshamHome.renderCirculars();
          break;
        case 'login':
          main.innerHTML = window.sakshamHome.renderLogin();
          break;
        default:
          main.innerHTML = window.sakshamHome.render();
      }
      return;
    }

    const user = this.auth.getCurrentUser();

    // Check approval gate
    if (user.status === 'PENDING_APPROVAL' || this.currentView === 'pending-gate') {
      main.innerHTML = this.auth.renderPendingGateScreen();
      return;
    }

    switch (this.currentView) {
      case 'about':
        main.innerHTML = window.sakshamHome.renderAbout();
        break;
      case 'public-courses':
        main.innerHTML = window.sakshamHome.renderPublicCourses();
        break;
      case 'circulars':
        main.innerHTML = window.sakshamHome.renderCirculars();
        break;
      case 'trainee-dashboard':
        main.innerHTML = window.sakshamTrainee.renderDashboard();
        break;
      case 'trainee-profile':
        main.innerHTML = window.sakshamTrainee.renderProfileBuilder();
        break;
      case 'course-catalog':
        main.innerHTML = window.sakshamTrainee.renderCourseCatalog();
        break;
      case 'trainer-dashboard':
        main.innerHTML = window.sakshamTrainer.renderDashboard();
        break;
      case 'trainer-monitoring':
        main.innerHTML = window.sakshamTrainer.renderMonitoringDesk();
        break;
      case 'trainer-library':
        main.innerHTML = window.sakshamTrainer.renderLibrary();
        break;
      case 'trainer-profile':
        main.innerHTML = window.sakshamTrainer.renderProfileManager();
        break;
      case 'admin-dashboard':
        main.innerHTML = window.sakshamAdmin.renderDashboard();
        break;
      case 'admin-verification':
        main.innerHTML = window.sakshamAdmin.renderVerificationDesk();
        break;
      case 'admin-users':
        main.innerHTML = window.sakshamAdmin.renderUserManagement();
        break;
      case 'competency-mapping':
        main.innerHTML = window.sakshamCompetency.renderView();
        break;
      default:
        main.innerHTML = window.sakshamHome.render();
    }
  }

  renderChatbot() {
    const mount = document.getElementById('chatbot-mount');
    if (mount && window.sakshamBot) {
      mount.innerHTML = window.sakshamBot.render();
      window.sakshamBot.renderMessages();
    }
  }

  populateTicker() {
    const tickerMount = document.getElementById('ticker-mount');
    if (!tickerMount) return;

    const ann = this.store.data.announcements || [];
    tickerMount.innerHTML = ann.map(a => `
      <span class="ticker-item">
        ${a.urgent ? '<span class="gov-badge gov-badge-danger">URGENT</span>' : '<span class="gov-badge gov-badge-info">NOTICE</span>'}
        <strong>${a.circularNo}:</strong> ${a.title} (${a.dept} &bull; ${a.date})
      </span>
    `).join('');
  }

  /* Modal Management */
  openModal(title, bodyHtml, isLarge = false) {
    const overlay = document.getElementById('gov-modal-overlay');
    const dialog = document.getElementById('gov-modal-dialog');
    const titleElem = document.getElementById('gov-modal-title');
    const bodyElem = document.getElementById('gov-modal-body');

    if (!overlay || !dialog) return;

    titleElem.textContent = title;
    bodyElem.innerHTML = bodyHtml;
    dialog.className = isLarge ? 'gov-modal-dialog modal-lg' : 'gov-modal-dialog';
    overlay.className = 'gov-modal-overlay open';
  }

  closeModal() {
    const overlay = document.getElementById('gov-modal-overlay');
    if (overlay) overlay.className = 'gov-modal-overlay';
    if (window.sakshamTrainee && window.sakshamTrainee.examTimerInterval) {
      clearInterval(window.sakshamTrainee.examTimerInterval);
    }
  }

  /* Accessibility Adjustments */
  adjustFontSize(delta) {
    if (delta === 0) {
      this.fontSizeOffset = 0;
    } else {
      this.fontSizeOffset = Math.max(-2, Math.min(4, this.fontSizeOffset + delta));
    }
    document.documentElement.style.fontSize = `${15 + this.fontSizeOffset}px`;
  }

  toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
  }
}

window.sakshamApp = new SakshamApp();
