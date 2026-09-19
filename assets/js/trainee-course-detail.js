/* assets/js/trainee-course-detail.js
 * Controller for trainee course detail view (course-detail.html)
 */
(async function () {
  await initDashboardShell({
    role: "trainee",
    active: "courses.html",
    title: "Course details",
    crumb: "Trainee workspace / Courses"
  });

  const iconFor = (type) => ({
    video: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 14 20H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"/><path d="M15.5 10l4.5-3v10l-4.5-3Z"/>',
    ppt: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 8h5a2.5 2.5 0 0 1 0 5H8v4"/>',
    pdf: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M7.5 8h2a1.7 1.7 0 0 1 0 3.4h-2V16M13 8v8M13 8h2a2 2 0 0 1 0 8h-2M17 8h2"/>',
    doc: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h5"/>'
  }[type] || '<circle cx="12" cy="12" r="9"/>');

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  let course = null;

  try {
    if (id && typeof Api !== "undefined" && Api.getCourseDetail) {
      course = await Api.getCourseDetail(id);
    }
  } catch (e) {
    console.warn("Backend not reachable, fallback course:", e.message);
  }

  if (!course && typeof MockDB !== "undefined" && MockDB.courses) {
    course = MockDB.courses.find(c => c.id === id) || MockDB.courses[0];
  }

  if (course) {
    const titleEl = document.getElementById("courseTitle");
    const trainerEl = document.getElementById("courseTrainer");
    const catEl = document.getElementById("courseCat");
    const progEl = document.getElementById("courseProgress");
    if (titleEl) titleEl.textContent = course.title;
    if (trainerEl) trainerEl.textContent = course.trainer;
    if (catEl) catEl.textContent = course.category;
    if (progEl) progEl.style.width = (course.progress || 0) + "%";
  }

  const resList = document.getElementById("resourceList");
  const resources = (typeof MockDB !== "undefined" && MockDB.resources) ? MockDB.resources : [];
  if (resList) {
    resList.innerHTML = resources.map(r => `
      <li class="resource-row">
        <div class="r-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${iconFor(r.type)}</svg></div>
        <div class="r-body"><h4>${r.title}</h4><span>${r.meta}</span></div>
        <a href="#" class="btn btn-ghost btn-sm" onclick="alert('Opening resource: ${r.title}'); return false;">Open</a>
      </li>`).join("");
  }

  const starRow = document.getElementById("starRow");
  if (starRow) {
    starRow.style.cursor = "pointer";
    starRow.addEventListener("click", () => {
      toast("Rating recorded: 5 stars ★★★★★");
    });
  }

  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        if (typeof Api !== "undefined" && Api.submitFeedback) {
          await Api.submitFeedback(id || "C101", {});
        }
      } catch (err) {
        console.warn("Feedback recorded locally:", err.message);
      }
      toast("Thanks for your feedback!");
      feedbackForm.reset();
    });
  }
})();
