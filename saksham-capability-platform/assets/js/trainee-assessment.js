/* assets/js/trainee-assessment.js
 * Controller for trainee MCQ assessment page (assessment.html)
 */
(async function () {
  await initDashboardShell({
    role: "trainee",
    active: "assessment.html",
    title: "Assessments",
    crumb: "Trainee workspace / Assessments"
  });

  const params = new URLSearchParams(location.search);
  const assessmentId = params.get("id");

  let questions = (typeof MockDB !== "undefined" && MockDB.questions) ? [...MockDB.questions] : [
    { q: "Which document authorizes government expenditure for a financial year?", options: ["Finance Bill", "Appropriation Act", "Economic Survey", "Audit Report"], answer: 1 },
    { q: "The Comptroller and Auditor General submits reports to whom?", options: ["The Prime Minister", "The President", "The Finance Secretary", "The Cabinet Secretary"], answer: 1 },
    { q: "Which of these is a preventive cyber hygiene practice?", options: ["Reusing passwords", "Ignoring software updates", "Enabling two-factor authentication", "Clicking unknown links"], answer: 2 },
    { q: "Under RTI Act 2005, the default response period is:", options: ["7 days", "15 days", "30 days", "45 days"], answer: 2 },
    { q: "Zero-based budgeting requires each expense to be:", options: ["Carried forward automatically", "Justified afresh each cycle", "Approved only by audit", "Ignored if under threshold"], answer: 1 }
  ];

  let current = 0;
  let answers = new Array(questions.length).fill(null);
  let seconds = 600; // 10 minutes

  const qIndex = document.getElementById("qIndex");
  const qText = document.getElementById("qText");
  const qOptions = document.getElementById("qOptions");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const timer = document.getElementById("timer");
  const qNav = document.getElementById("qNav");
  const submitBtn = document.getElementById("submitBtn");
  const quizView = document.getElementById("quizView");
  const resultView = document.getElementById("resultView");
  const scoreText = document.getElementById("scoreText");
  const scoreBar = document.getElementById("scoreBar");

  try {
    if (assessmentId && typeof Api !== "undefined" && Api.getAssessment) {
      const data = await Api.getAssessment(assessmentId);
      if (data && data.questions && data.questions.length) {
        questions = data.questions;
        answers = new Array(questions.length).fill(null);
      }
    }
  } catch (e) {
    console.warn("Backend not reachable, using sample questions:", e.message);
  }

  function renderQuestion() {
    if (!questions.length) return;
    const q = questions[current];
    if (qIndex) qIndex.textContent = `Question ${current + 1} of ${questions.length}`;
    if (qText) qText.textContent = q.q;
    if (qOptions) {
      qOptions.innerHTML = q.options.map((opt, i) => `
        <label class="mcq-option ${answers[current] === i ? "selected" : ""}">
          <input type="radio" name="opt" value="${i}" ${answers[current] === i ? "checked" : ""}>
          <span>${opt}</span>
        </label>`).join("");
    }
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.textContent = current === questions.length - 1 ? "Finish" : "Next →";
    renderNav();
  }

  function renderNav() {
    if (!qNav) return;
    qNav.innerHTML = questions.map((_, i) => `
      <button type="button" class="${answers[i] !== null ? "answered" : ""} ${i === current ? "current" : ""}" data-goto="${i}">
        ${i + 1}
      </button>`).join("");
  }

  if (qOptions) {
    qOptions.addEventListener("change", (e) => {
      if (e.target.name === "opt") {
        answers[current] = Number(e.target.value);
        renderQuestion();
      }
    });
  }

  if (qNav) {
    qNav.addEventListener("click", (e) => {
      const target = e.target.closest("button");
      if (target && target.dataset.goto !== undefined) {
        current = Number(target.dataset.goto);
        renderQuestion();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (current > 0) {
        current--;
        renderQuestion();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (current < questions.length - 1) {
        current++;
        renderQuestion();
      } else {
        submit();
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", submit);
  }

  function tick() {
    seconds--;
    if (seconds <= 0) {
      submit();
      return;
    }
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    if (timer) timer.textContent = `${m}:${s}`;
  }
  const timerHandle = setInterval(tick, 1000);

  async function submit() {
    clearInterval(timerHandle);
    if (quizView) quizView.style.display = "none";
    if (resultView) resultView.style.display = "block";

    if (assessmentId && typeof Api !== "undefined" && Api.submitAssessment) {
      try {
        const result = await Api.submitAssessment(
          assessmentId,
          answers.map((a, i) => ({ questionId: i, selectedOption: a }))
        );
        const pct = Math.round((result.score / result.totalMarks) * 100) || 0;
        if (scoreText) scoreText.textContent = `${result.score} / ${result.totalMarks} (${pct}%)`;
        if (scoreBar) scoreBar.style.width = pct + "%";
        return;
      } catch (e) {
        console.warn("Backend not reachable, falling back to local scoring:", e.message);
      }
    }

    let correct = 0;
    answers.forEach((a, i) => {
      if (a === (questions[i] ? questions[i].answer : null)) correct++;
    });
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    if (scoreText) scoreText.textContent = `${correct} / ${questions.length} (${pct}%)`;
    if (scoreBar) scoreBar.style.width = pct + "%";
  }

  renderQuestion();
})();
