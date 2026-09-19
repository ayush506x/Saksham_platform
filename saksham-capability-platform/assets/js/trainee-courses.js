/* assets/js/trainee-courses.js
 * Controller for trainee courses catalog page (courses.html)
 */
(async function () {
  await initDashboardShell({
    role: "trainee",
    active: "courses.html",
    title: "Courses",
    crumb: "Trainee workspace / Courses"
  });

  let ALL_COURSES = [];
  try {
    if (typeof Api !== "undefined" && Api.getCourses) {
      ALL_COURSES = await Api.getCourses();
    }
  } catch (e) {
    console.warn("Backend not reachable, loading mock courses:", e.message);
  }

  if (!ALL_COURSES || !ALL_COURSES.length) {
    ALL_COURSES = (typeof MockDB !== "undefined" && MockDB.courses) ? [...MockDB.courses] : [];
  }

  const searchBox = document.getElementById("searchBox");
  const categoryFilter = document.getElementById("categoryFilter");
  const statusFilter = document.getElementById("statusFilter");
  const courseGrid = document.getElementById("courseGrid");
  const courseModal = document.getElementById("courseModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");

  function cardHTML(c) {
    return `
      <div class="course-card">
        <div class="course-thumb">${c.title.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
        <div class="course-body">
          <h4>${c.title}</h4>
          <div class="course-meta"><span>${c.category}</span><span>·</span><span>${c.level}</span></div>
          <div class="course-meta"><span>Trainer: ${c.trainer}</span></div>
          ${c.enrolled ? `<div class="progress" style="margin: 8px 0 4px;"><span style="width:${c.progress}%"></span></div><div class="course-meta" style="margin-bottom:8px;"><span>${c.progress}% complete</span></div>` : ""}
          <div style="display:flex;gap:8px;margin-top:8px;">
            <a href="course-detail.html?id=${c.id}" class="btn ${c.enrolled ? "btn-outline" : "btn-primary"} btn-sm">${c.enrolled ? "Continue" : "View details"}</a>
            ${!c.enrolled ? `<button class="btn btn-teal btn-sm" data-enroll="${c.id}">Enroll</button>` : ""}
          </div>
        </div>
      </div>`;
  }

  function render() {
    if (!courseGrid) return;
    const q = (searchBox ? searchBox.value : "").toLowerCase();
    const cat = categoryFilter ? categoryFilter.value : "";
    const status = statusFilter ? statusFilter.value : "";
    const list = ALL_COURSES.filter(c => {
      if (q && !c.title.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false;
      if (cat && c.category !== cat) return false;
      if (status === "enrolled" && !c.enrolled) return false;
      if (status === "available" && c.enrolled) return false;
      return true;
    });
    courseGrid.innerHTML = list.length ? list.map(cardHTML).join("") :
      `<div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;"><div class="icon" style="font-size:32px;">🔍</div>No courses match your filters.</div>`;
  }

  [searchBox, categoryFilter, statusFilter].forEach(el => {
    if (el) el.addEventListener("input", render);
  });

  if (courseGrid) {
    courseGrid.addEventListener("click", async (e) => {
      const enrollId = e.target.dataset.enroll;
      if (enrollId) {
        const c = ALL_COURSES.find(x => x.id === enrollId);
        if (c) {
          try {
            if (typeof Api !== "undefined" && Api.enrollCourse) {
              await Api.enrollCourse(enrollId);
            }
          } catch (err) {
            console.warn("Enrolled in offline mode:", err.message);
          }
          c.enrolled = true;
          c.progress = 0;
          toast(`Enrolled in ${c.title}`);
          render();
        }
      }
    });
  }

  if (closeModal && courseModal) {
    closeModal.addEventListener("click", () => {
      courseModal.classList.remove("open");
    });
  }

  render();
})();
