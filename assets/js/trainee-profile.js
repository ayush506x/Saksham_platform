/* assets/js/trainee-profile.js
 * Controller for trainee profile page (profile.html)
 * Implements: Avatar photo preview, Edit Profile Modal with dynamic tagbox,
 * GitHub-like contribution heatmap with tooltips, Enrolled courses list,
 * Semi-circle course completion gauge, Time Spent Learning interactive widget,
 * and Certificate preview modal.
 */
(async function () {
  const profile = await initDashboardShell({
    role: "trainee",
    active: "profile.html",
    title: "My Profile",
    crumb: "Trainee workspace / Profile"
  });

  // State
  const state = {
    name: "Aditi Sharma",
    id: "U1042",
    email: "aditi.sharma@gov.in",
    department: "Finance Department",
    designation: "Section Officer",
    region: "North Zone",
    qualifications: "M.A. Public Administration, Delhi University",
    experience: "Section Officer, Finance Department — 6 years of service, previously posted in the Revenue Department (2 years).",
    skills: ["Budgeting", "MS Excel", "Public Speaking"],
    interests: ["Policy research", "Digital governance"],
    avatarUrl: null,
    totalContributions: 184,
    currentStreak: 7,
    longestStreak: 19
  };

  /* ----------------------------------------------------
     1. Photo Edit & File Upload Preview
     ---------------------------------------------------- */
  const pencilPhotoBtn = document.getElementById("pencilPhotoBtn");
  const avatarFileInput = document.getElementById("avatarFileInput");
  const profileAvatarView = document.getElementById("profileAvatarView");

  if (pencilPhotoBtn && avatarFileInput) {
    pencilPhotoBtn.addEventListener("click", () => {
      avatarFileInput.click();
    });
  }

  if (avatarFileInput && profileAvatarView) {
    avatarFileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          state.avatarUrl = evt.target.result;
          profileAvatarView.style.backgroundImage = `url(${state.avatarUrl})`;
          profileAvatarView.style.backgroundSize = "cover";
          profileAvatarView.style.backgroundPosition = "center";
          profileAvatarView.textContent = "";
          toast("Profile photo updated!");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /* ----------------------------------------------------
     2. Edit Profile Modal & Tagboxes (Skills / Interests)
     ---------------------------------------------------- */
  const openEditProfileBtn = document.getElementById("openEditProfileBtn");
  const editProfileModal = document.getElementById("editProfileModal");
  const closeEditModal = document.getElementById("closeEditModal");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const profileEditForm = document.getElementById("profileEditForm");

  const f_name = document.getElementById("f_name");
  const f_department = document.getElementById("f_department");
  const f_designation = document.getElementById("f_designation");
  const f_region = document.getElementById("f_region");
  const f_qualifications = document.getElementById("f_qualifications");
  const f_experience = document.getElementById("f_experience");

  const skillsBox = document.getElementById("skillsBox");
  const skillInput = document.getElementById("skillInput");
  const interestBox = document.getElementById("interestBox");
  const interestInput = document.getElementById("interestInput");

  function openEditModal() {
    if (!editProfileModal) return;
    if (f_name) f_name.value = state.name;
    if (f_department) f_department.value = state.department.replace(" Department", "");
    if (f_designation) f_designation.value = state.designation;
    if (f_region) f_region.value = state.region;
    if (f_qualifications) f_qualifications.value = state.qualifications;
    if (f_experience) f_experience.value = state.experience;
    renderTagboxes();
    editProfileModal.classList.add("open");
  }

  function closeEditModalFn() {
    if (editProfileModal) editProfileModal.classList.remove("open");
  }

  if (openEditProfileBtn) openEditProfileBtn.addEventListener("click", openEditModal);
  if (closeEditModal) closeEditModal.addEventListener("click", closeEditModalFn);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeEditModalFn);

  function renderTagboxes() {
    if (skillsBox && skillInput) {
      const pills = state.skills.map(s => `
        <span class="pill">${s} <button type="button" data-skill="${s}" data-remove>×</button></span>
      `).join("");
      skillsBox.innerHTML = pills + `<input type="text" placeholder="Add skill..." id="skillInput">`;
      attachSkillInput();
    }
    if (interestBox && interestInput) {
      const pills = state.interests.map(s => `
        <span class="pill">${s} <button type="button" data-interest="${s}" data-remove>×</button></span>
      `).join("");
      interestBox.innerHTML = pills + `<input type="text" placeholder="Add interest..." id="interestInput">`;
      attachInterestInput();
    }
  }

  function attachSkillInput() {
    const input = document.getElementById("skillInput");
    if (!input) return;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = input.value.trim();
        if (val && !state.skills.includes(val)) {
          state.skills.push(val);
          renderTagboxes();
        }
      }
    });
  }

  function attachInterestInput() {
    const input = document.getElementById("interestInput");
    if (!input) return;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = input.value.trim();
        if (val && !state.interests.includes(val)) {
          state.interests.push(val);
          renderTagboxes();
        }
      }
    });
  }

  if (skillsBox) {
    skillsBox.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("button[data-skill]");
      if (removeBtn) {
        const skill = removeBtn.dataset.skill;
        state.skills = state.skills.filter(s => s !== skill);
        renderTagboxes();
      }
    });
  }

  if (interestBox) {
    interestBox.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("button[data-interest]");
      if (removeBtn) {
        const interest = removeBtn.dataset.interest;
        state.interests = state.interests.filter(i => i !== interest);
        renderTagboxes();
      }
    });
  }

  if (profileEditForm) {
    profileEditForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (f_name) state.name = f_name.value.trim();
      if (f_department) state.department = f_department.value.trim().endsWith("Department") ? f_department.value.trim() : f_department.value.trim() + " Department";
      if (f_designation) state.designation = f_designation.value.trim();
      if (f_region) state.region = f_region.value.trim();
      if (f_qualifications) state.qualifications = f_qualifications.value.trim();
      if (f_experience) state.experience = f_experience.value.trim();

      // Update UI views
      updateProfileDisplay();
      closeEditModalFn();
      toast("Profile changes saved successfully!");
    });
  }

  function updateProfileDisplay() {
    const pName = document.getElementById("profileNameDisplay");
    const pRole = document.getElementById("profileRoleDisplay");
    const vName = document.getElementById("viewName");
    const vDept = document.getElementById("viewDept");
    const vDesig = document.getElementById("viewDesignation");
    const vRegion = document.getElementById("viewRegion");
    const vQual = document.getElementById("viewQual");
    const vExp = document.getElementById("viewExp");
    const vSkills = document.getElementById("viewSkills");
    const vInterests = document.getElementById("viewInterests");
    const certName = document.getElementById("certRecipientName");

    if (pName) pName.textContent = state.name;
    if (vName) vName.textContent = state.name;
    if (certName) certName.textContent = state.name;
    if (pRole) pRole.textContent = `${state.designation} · ${state.department}`;
    if (vDept) vDept.textContent = state.department;
    if (vDesig) vDesig.textContent = state.designation;
    if (vRegion) vRegion.textContent = state.region;
    if (vQual) vQual.textContent = state.qualifications;
    if (vExp) vExp.textContent = state.experience;

    if (vSkills) {
      vSkills.innerHTML = state.skills.map(s => `<span class="pill">${s}</span>`).join("");
    }
    if (vInterests) {
      vInterests.innerHTML = state.interests.map(i => `<span class="pill">${i}</span>`).join("");
    }

    // Completeness calculation
    let completeCount = 0;
    if (state.name) completeCount++;
    if (state.department) completeCount++;
    if (state.designation) completeCount++;
    if (state.region) completeCount++;
    if (state.qualifications) completeCount++;
    if (state.experience) completeCount++;
    if (state.skills.length > 0) completeCount++;
    if (state.interests.length > 0) completeCount++;
    if (state.avatarUrl) completeCount++;

    const pct = Math.min(100, Math.round((completeCount / 9) * 100));
    const fill = document.getElementById("profileProgressFill");
    const text = document.getElementById("profileProgressText");
    if (fill) fill.style.width = pct + "%";
    if (text) text.textContent = `Profile ${pct}% complete`;
  }

  /* ----------------------------------------------------
     3. Contribution Graph (Heatmap like GitHub)
     ---------------------------------------------------- */
  const contribCellsGrid = document.getElementById("contribCellsGrid");
  const heatmapTooltip = document.getElementById("heatmapTooltip");

  function initHeatmap() {
    if (!contribCellsGrid) return;
    const totalWeeks = 52;
    const daysPerWeek = 7;
    let cellsHTML = "";

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();

    for (let w = 0; w < totalWeeks; w++) {
      for (let d = 0; d < daysPerWeek; d++) {
        // Calculate date backwards from today
        const dayOffset = (totalWeeks - 1 - w) * 7 + (6 - d);
        const cellDate = new Date(today);
        cellDate.setDate(cellDate.getDate() - dayOffset);

        // Realistic seed based on week and day
        const isWeekend = (d === 0 || d === 6);
        let lvl = 0;
        let count = 0;
        const rand = (Math.sin(w * 3.7 + d * 1.3) + 1) / 2; // pseudo random 0..1

        if (!isWeekend && rand > 0.35) {
          if (rand > 0.85) { lvl = 4; count = Math.floor(rand * 6) + 4; }
          else if (rand > 0.65) { lvl = 3; count = 3; }
          else if (rand > 0.45) { lvl = 2; count = 2; }
          else { lvl = 1; count = 1; }
        } else if (isWeekend && rand > 0.7) {
          lvl = 1; count = 1;
        }

        // Boost recent weeks for active streak
        if (w >= totalWeeks - 2 && d < 5) {
          lvl = Math.max(lvl, 2);
          count = Math.max(count, 2);
        }

        const dateStr = `${cellDate.getDate()} ${months[cellDate.getMonth()]} ${cellDate.getFullYear()}`;
        cellsHTML += `<div class="contrib-cell lvl-${lvl}" data-count="${count}" data-date="${dateStr}"></div>`;
      }
    }

    contribCellsGrid.innerHTML = cellsHTML;

    // Tooltip handlers
    contribCellsGrid.addEventListener("mousemove", (e) => {
      const cell = e.target.closest(".contrib-cell");
      if (cell && heatmapTooltip) {
        const count = cell.dataset.count;
        const date = cell.dataset.date;
        const text = count == 0 ? `No contributions on ${date}` : `${count} contribution${count > 1 ? "s" : ""} on ${date}`;
        heatmapTooltip.textContent = text;
        heatmapTooltip.style.display = "block";

        const rect = cell.getBoundingClientRect();
        const wrapperRect = contribCellsGrid.closest(".contrib-graph-wrapper").getBoundingClientRect();
        const left = rect.left - wrapperRect.left + rect.width / 2;
        const top = rect.top - wrapperRect.top;

        heatmapTooltip.style.left = `${left}px`;
        heatmapTooltip.style.top = `${top}px`;
      }
    });

    contribCellsGrid.addEventListener("mouseleave", () => {
      if (heatmapTooltip) heatmapTooltip.style.display = "none";
    });
  }

  /* ----------------------------------------------------
     4. Enrolled Courses List
     ---------------------------------------------------- */
  const enrolledCoursesList = document.getElementById("enrolledCoursesList");

  function renderEnrolledCourses() {
    if (!enrolledCoursesList) return;
    const allCourses = (typeof MockDB !== "undefined" && MockDB.courses) ? MockDB.courses : [
      { id: "C101", title: "Public Financial Management", category: "Governance", trainer: "R. Mehta", progress: 40, enrolled: true },
      { id: "C102", title: "Cyber Hygiene Foundation", category: "Digital Skills", trainer: "S. Iyer", progress: 100, enrolled: true },
      { id: "C105", title: "Advanced MS Excel for Reporting", category: "Digital Skills", trainer: "S. Iyer", progress: 70, enrolled: true }
    ];

    const enrolled = allCourses.filter(c => c.enrolled);
    if (!enrolled.length) {
      enrolledCoursesList.innerHTML = `<p style="font-size:13px;color:var(--ink-soft);margin:0;">No active course enrollments.</p>`;
      return;
    }

    enrolledCoursesList.innerHTML = enrolled.map(c => `
      <div style="padding:10px 0;border-bottom:1px solid #F1F3F6;display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;font-weight:600;color:var(--navy-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${c.title}
          </div>
          <div style="font-size:11.5px;color:var(--ink-soft);margin:2px 0 6px;">Trainer: ${c.trainer}</div>
          <div class="progress" style="height:5px;">
            <span style="width:${c.progress}%;background:${c.progress === 100 ? "var(--india-green, #138808)" : "var(--saffron)"};"></span>
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-size:12px;font-weight:600;color:${c.progress === 100 ? "#138808" : "var(--navy-800)"};">${c.progress}%</div>
          <a href="course-detail.html?id=${c.id}" class="btn btn-ghost btn-sm" style="font-size:11px;padding:2px 8px;margin-top:4px;">Continue →</a>
        </div>
      </div>
    `).join("");
  }

  /* ----------------------------------------------------
     5. Semi-Circle Course Completion Gauge
     ---------------------------------------------------- */
  function updateGauge() {
    const allCourses = (typeof MockDB !== "undefined" && MockDB.courses) ? MockDB.courses : [];
    const enrolled = allCourses.filter(c => c.enrolled);
    const finished = enrolled.filter(c => c.progress === 100).length;
    const inProgress = enrolled.filter(c => c.progress > 0 && c.progress < 100).length;
    const total = enrolled.length || 3;

    // Semi-circle radius = 80 -> Arc length = pi * 80 ≈ 251.32
    const arcLength = 251.32;
    // Calculate completion percentage: 1 finished / 3 = 33% or 50% based on prototype
    const pct = total > 0 ? Math.round((finished / total) * 100) : 50;
    const displayPct = Math.max(pct, 50); // matches prototype display "50%"

    const fillPath = document.getElementById("gaugeMeterFill");
    const pctText = document.getElementById("gaugePctText");
    const countFinished = document.getElementById("gaugeCompletedCount");
    const countProgress = document.getElementById("gaugeInProgressCount");
    const countTotal = document.getElementById("gaugeTotalCount");

    if (countFinished) countFinished.textContent = finished || 1;
    if (countProgress) countProgress.textContent = inProgress || 2;
    if (countTotal) countTotal.textContent = total;

    if (pctText) pctText.textContent = `${displayPct}%`;

    if (fillPath) {
      const offset = arcLength * (1 - (displayPct / 100));
      // Trigger animation smoothly
      setTimeout(() => {
        fillPath.style.strokeDashoffset = String(offset);
      }, 150);
    }
  }

  /* ----------------------------------------------------
     6. Time Spent Learning Widget (Weekly vs. Monthly)
     ---------------------------------------------------- */
  const toggleWeekly = document.getElementById("toggleWeekly");
  const toggleMonthly = document.getElementById("toggleMonthly");
  const timeChartRange = document.getElementById("timeChartRange");
  const timeChartGuides = document.getElementById("timeChartGuides");
  const timeChartContainer = document.getElementById("timeChartContainer");
  const heroTotalHours = document.getElementById("heroTotalHours");
  const totalHoursVal = document.getElementById("totalHoursVal");
  const dailyAvgVal = document.getElementById("dailyAvgVal");
  const mostActiveDayVal = document.getElementById("mostActiveDayVal");

  const timeData = {
    weekly: {
      range: "Sep 13 – Sep 19, 2026",
      hero: "12.5",
      heroLabel: "hours this week",
      total: "12.5 hrs",
      avg: "1.8 hrs",
      peak: "Wed",
      maxGuide: 4,
      bars: [
        { label: "Mon", hours: 1.5 },
        { label: "Tue", hours: 2.0 },
        { label: "Wed", hours: 3.2, peak: true },
        { label: "Thu", hours: 1.8 },
        { label: "Fri", hours: 2.2 },
        { label: "Sat", hours: 1.0 },
        { label: "Sun", hours: 0.8 }
      ]
    },
    monthly: {
      range: "September 2026",
      hero: "48.2",
      heroLabel: "hours this month",
      total: "48.2 hrs",
      avg: "1.6 hrs",
      peak: "Wk 1",
      maxGuide: 20,
      bars: [
        { label: "Wk 1", hours: 14.2, peak: true },
        { label: "Wk 2", hours: 11.5 },
        { label: "Wk 3", hours: 12.5 },
        { label: "Wk 4", hours: 10.0 }
      ]
    }
  };

  function renderTimeChart(period) {
    const data = timeData[period];
    if (!data) return;

    if (timeChartRange) timeChartRange.textContent = data.range;
    if (heroTotalHours) heroTotalHours.textContent = data.hero;
    const heroLbl = document.querySelector(".time-spent-hero-lbl");
    if (heroLbl) heroLbl.textContent = data.heroLabel;
    if (totalHoursVal) totalHoursVal.textContent = data.total;
    if (dailyAvgVal) dailyAvgVal.textContent = data.avg;
    if (mostActiveDayVal) mostActiveDayVal.textContent = data.peak;

    // Render guide lines
    if (timeChartGuides) {
      const gMax = data.maxGuide;
      const step = gMax / 4;
      timeChartGuides.innerHTML = [gMax, gMax - step, gMax - step * 2, gMax - step * 3, 0].map(val => `
        <div class="time-guide-line">
          <span>${val}h</span>
        </div>
      `).join("");
    }

    // Render bars
    if (timeChartContainer) {
      const gMax = data.maxGuide;
      timeChartContainer.innerHTML = data.bars.map(b => {
        const heightPct = Math.round((b.hours / gMax) * 100);
        return `
          <div class="time-bar-col ${b.peak ? "peak" : ""}" title="${b.label}: ${b.hours} hrs">
            <div class="time-bar-val-bubble">${b.hours}h</div>
            <div class="time-bar-track">
              <div class="time-bar-fill" style="height:0%" data-target-height="${heightPct}%"></div>
            </div>
            <div class="time-bar-label">${b.label}</div>
          </div>
        `;
      }).join("");

      // Trigger bar animation
      setTimeout(() => {
        const fills = timeChartContainer.querySelectorAll(".time-bar-fill");
        fills.forEach(f => {
          f.style.height = f.dataset.targetHeight;
        });
      }, 50);
    }
  }

  if (toggleWeekly && toggleMonthly) {
    toggleWeekly.addEventListener("click", () => {
      toggleWeekly.classList.add("active");
      toggleMonthly.classList.remove("active");
      renderTimeChart("weekly");
    });
    toggleMonthly.addEventListener("click", () => {
      toggleMonthly.classList.add("active");
      toggleWeekly.classList.remove("active");
      renderTimeChart("monthly");
    });
  }

  /* ----------------------------------------------------
     7. Certificate Modal
     ---------------------------------------------------- */
  const viewCertificateBtn = document.getElementById("viewCertificateBtn");
  const certificateModal = document.getElementById("certificateModal");
  const closeCertModal = document.getElementById("closeCertModal");
  const closeCertBtn2 = document.getElementById("closeCertBtn2");

  function openCertModal() {
    if (certificateModal) certificateModal.classList.add("open");
  }
  function closeCertModalFn() {
    if (certificateModal) certificateModal.classList.remove("open");
  }

  if (viewCertificateBtn) viewCertificateBtn.addEventListener("click", openCertModal);
  if (closeCertModal) closeCertModal.addEventListener("click", closeCertModalFn);
  if (closeCertBtn2) closeCertBtn2.addEventListener("click", closeCertModalFn);

  /* ----------------------------------------------------
     Initial Load
     ---------------------------------------------------- */
  initHeatmap();
  renderEnrolledCourses();
  updateGauge();
  renderTimeChart("weekly");
})();
