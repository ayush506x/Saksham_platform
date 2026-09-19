/* =========================================================
   Trainer Library Script — Saksham
   ========================================================= */

(async function () {
  // Initialize Shell
  let profile = null;
  if (typeof initDashboardShell === "function") {
    profile = await initDashboardShell({
      role: "trainer",
      active: "library.html",
      title: "Library",
      crumb: "Trainer workspace"
    });
  }

  // DOM Elements
  const libraryList = document.getElementById("libraryList");
  const uploadModal = document.getElementById("uploadModal");
  const openUploadBtn = document.getElementById("openUpload");
  const closeUploadBtn = document.getElementById("closeUpload");
  const uploadForm = document.getElementById("uploadForm");

  // Mock Library Data
  const libraryItems = [
    { id: 1, title: "Budget Cycle — Recorded Lecture", type: "video", course: "Public Financial Management", date: "Sep 15, 2026", visible: true },
    { id: 2, title: "Cyber Hygiene Fundamentals", type: "pdf", course: "Cyber Hygiene Foundation", date: "Sep 12, 2026", visible: true },
    { id: 3, title: "Advanced Excel Formulas", type: "ppt", course: "Advanced MS Excel", date: "Sep 10, 2026", visible: false }
  ];

  function getIconForType(type) {
    if (type === "video") return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
    if (type === "ppt") return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`;
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
  }

  function renderLibrary() {
    if (!libraryList) return;
    
    if (libraryItems.length === 0) {
      libraryList.innerHTML = `<div style="text-align:center;padding:40px;color:var(--ink-soft);">No materials uploaded yet. Click "+ Upload material" to add some.</div>`;
      return;
    }

    libraryList.innerHTML = libraryItems.map(item => `
      <li class="resource-row" style="margin-bottom: 12px; background: #fff; padding: 16px; border-radius: 8px; border: 1px solid var(--line); display: flex; align-items: center; gap: 16px;">
        <div class="r-icon" style="background:var(--saffron-light); color:var(--saffron-dark); padding: 12px; border-radius: 8px; display: flex;">
          ${getIconForType(item.type)}
        </div>
        <div class="r-body" style="flex: 1;">
          <h4 style="font-size:15px; margin: 0 0 4px; color: var(--navy-800);">${item.title}</h4>
          <span style="font-size: 12.5px; color: var(--ink-soft);">Course: ${item.course} · Uploaded: ${item.date}</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge ${item.visible ? 'badge-completed' : 'badge-notstarted'}">${item.visible ? 'Visible' : 'Hidden'}</span>
          <button class="btn btn-ghost btn-sm" onclick="alert('Downloading/Viewing is disabled in demo mode.')">View</button>
        </div>
      </li>
    `).join("");
  }

  // Modal Logic
  function openModal() {
    if (uploadModal) uploadModal.classList.add("open");
  }

  function closeModal() {
    if (uploadModal) uploadModal.classList.remove("open");
    if (uploadForm) uploadForm.reset();
  }

  if (openUploadBtn) openUploadBtn.addEventListener("click", openModal);
  if (closeUploadBtn) closeUploadBtn.addEventListener("click", closeModal);
  if (uploadModal) {
    uploadModal.addEventListener("click", (e) => {
      if (e.target === uploadModal) closeModal();
    });
  }

  // Form Submission
  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const title = document.getElementById("u_title").value;
      const type = document.getElementById("u_type").value;
      const course = document.getElementById("u_course").value;
      const visible = document.getElementById("visibleCheck").checked;
      
      const newItem = {
        id: Date.now(),
        title: title,
        type: type,
        course: course,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        visible: visible
      };
      
      libraryItems.unshift(newItem);
      renderLibrary();
      closeModal();
      
      // Toast notification
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = "✓ Material uploaded successfully";
      toast.style.cssText = "background:#0F766E;border-left-color:#5BBD80;";
      let region = document.querySelector(".toast-region");
      if (!region) {
        region = document.createElement("div");
        region.className = "toast-region";
        document.body.appendChild(region);
      }
      region.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    });
  }

  // Initial Render
  renderLibrary();
})();
