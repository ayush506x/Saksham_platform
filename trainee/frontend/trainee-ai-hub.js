/**
 * SAKSHAM (सक्षम) — Trainee AI Hub Client Logic
 * Designed for Rajvardhan's Saksham Platform UI/UX
 */

(function() {
  const API_BASE = window.SAKSHAM_AI_API_URL || 'http://localhost:8080';

  const PRESET_NOTES = {
    cyclone: `Tropical cyclones in the North Indian Ocean originate during pre-monsoon (April to June) and post-monsoon (October to December) seasons. The India Meteorological Department (IMD) acts as the Regional Specialized Meteorological Centre (RSMC) for cyclone tracking.

A 4-stage alert system is strictly enforced:
1. Pre-Cyclone Watch: Issued 72 hours prior to cyclonic disturbance inception.
2. Cyclone Alert: Yellow message issued 48 hours before expected commencement of adverse weather.
3. Cyclone Warning: Orange message issued 24 hours prior to expected landfall.
4. Post-Landfall Outlook: Red message issued 12 hours before landfall until cyclone weakens.

Standard coastal hazard evacuation triggers when sustained surface wind speeds exceed 64 knots (118 km/h), designating a Very Severe Cyclonic Storm (VSCS).`,

    radar: `Doppler Weather Radar (DWR) measures radial velocity, radar reflectivity factor (Z), and spectral width. It operates primarily in S-band (2.7-3.0 GHz) for coastal cyclone tracking and C-band / X-band for inland convective storm monitoring.

Key operational features:
- Dual-Polarization (Dual-Pol): Differentiates between hydrometeors (rain, hail, snow) and non-meteorological echoes (birds, insects, sea clutter).
- Radial Velocity: Detects mesocyclone signatures and hook echoes for tornado and severe storm nowcasting.
- Storm cell tracking algorithms provide 15 to 30-minute lead time warnings for severe convective downpours and lightning hazards.`,

    nwp: `Numerical Weather Prediction (NWP) involves integrating mathematical models of the atmosphere based on conservation of mass, momentum, and thermodynamic energy.

High-resolution Weather Research and Forecasting (WRF) models are run at regional grids (3km to 9km horizontal resolution).
Initial boundary conditions are derived from Global Forecast System (GFS) and ECMWF data feeds.
Data assimilation methods, specifically 3D-Var and 4D-Var, integrate real-time surface observations, Doppler radar reflectivity, and INSAT-3D sounder radiances into model initial states.`,

    rail: `Automatic Train Protection (ATP) systems continuously supervise train speed against authorized target limits. Under Indian Railways' Kavach (indigenous ATP):
- Radio Frequency Identification (RFID) tags are fitted on track sleepers to detect train position.
- Stationary Kavach units communicate with Loco Kavach units via UHF/VHF data radios.
- Automatic brake application is enforced if the loco pilot fails to comply with signal aspect or speed restrictions.
- High-integrity SIL-4 architecture prevents Signal Passing At Danger (SPAD) and head-on/rear-end collisions.`
  };

  const PRESET_TRAINER_QUERIES = {
    cyclone: {
      subject: "Tropical Cyclone Warning & Coastal Alert Protocols",
      skills: ["cyclone warning", "radar data", "severe weather"],
      exp: "10"
    },
    radar: {
      subject: "Doppler Weather Radar Reflectivity & Nowcasting",
      skills: ["radar data", "doppler radar operations", "nowcasting"],
      exp: "8"
    },
    nwp: {
      subject: "Numerical Weather Prediction & WRF Simulation",
      skills: ["numerical weather prediction", "wrf model", "python"],
      exp: "7"
    },
    satellite: {
      subject: "INSAT-3D/3DR Satellite Remote Sensing",
      skills: ["satellite data", "remote sensing", "gis"],
      exp: "6"
    },
    agromet: {
      subject: "Gramin Krishi Mausam Seva & Hydrological Risk",
      skills: ["agrometeorology", "hydromet", "crop weather calendar"],
      exp: "5"
    },
    rail: {
      subject: "Automatic Train Protection & Signalling Protocols",
      skills: ["signalling", "safety protocols", "risk assessment"],
      exp: "10"
    }
  };

  // State
  let currentQuestions = [];
  let userAnswers = {};
  let currentTrainersCache = [];

  const Hub = {
    switchTab(tabName) {
      const tabBtnMCQ = document.getElementById('tabBtnMCQ');
      const tabBtnTrainer = document.getElementById('tabBtnTrainer');
      const panelMCQ = document.getElementById('panelMCQ');
      const panelTrainer = document.getElementById('panelTrainer');

      if (tabBtnMCQ) tabBtnMCQ.classList.toggle('active', tabName === 'mcq');
      if (tabBtnTrainer) tabBtnTrainer.classList.toggle('active', tabName === 'trainer');
      if (panelMCQ) panelMCQ.classList.toggle('active', tabName === 'mcq');
      if (panelTrainer) panelTrainer.classList.toggle('active', tabName === 'trainer');
    },

    loadNotesPreset(presetKey) {
      const txt = document.getElementById('aiNotesInput');
      if (!txt) return;
      if (presetKey === 'clear') {
        txt.value = '';
        return;
      }
      if (PRESET_NOTES[presetKey]) {
        txt.value = PRESET_NOTES[presetKey];
      }
    },

    loadTrainerPreset(presetKey) {
      const p = PRESET_TRAINER_QUERIES[presetKey];
      if (!p) return;
      const subj = document.getElementById('aiTrainerSubject');
      const exp = document.getElementById('aiTrainerExp');
      if (subj) subj.value = p.subject;
      if (exp) exp.value = p.exp;
      this.findTrainers(p.skills);
    },

    async generateMCQs() {
      const notesInput = document.getElementById('aiNotesInput');
      const notes = notesInput ? notesInput.value.trim() : '';
      const statusNotice = document.getElementById('aiMCQNotice');
      const btn = document.getElementById('btnGenerateMCQ');

      if (!notes) {
        if (statusNotice) {
          statusNotice.style.display = 'block';
          statusNotice.style.background = '#FBEAEA';
          statusNotice.style.color = '#B3261E';
          statusNotice.style.border = '1px solid #F1C9C7';
          statusNotice.innerHTML = '⚠️ Please paste training notes or lecture material first.';
        }
        if (notesInput) notesInput.focus();
        return;
      }

      if (statusNotice) statusNotice.style.display = 'none';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Generating AI MCQs...</span>';
      }

      const diff = document.getElementById('aiDifficultySelect') ? document.getElementById('aiDifficultySelect').value : 'Medium';
      const numQ = document.getElementById('aiNumQuestions') ? parseInt(document.getElementById('aiNumQuestions').value, 10) : 5;

      try {
        const res = await fetch(`${API_BASE}/api/ai/generate-mcq`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notes: notes,
            difficulty: diff,
            num_questions: numQ
          })
        });

        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        const data = await res.json();
        
        if (data.status === 'ok' && Array.isArray(data.questions) && data.questions.length > 0) {
          this.renderQuiz(data.questions, data.difficulty, data.model);
        } else {
          throw new Error('Invalid format returned by AI microservice');
        }
      } catch (err) {
        console.warn('Backend API notice, using offline fallback:', err);
        const fallbackQs = this.generateLocalFallbackMCQs(notes, numQ, diff);
        this.renderQuiz(fallbackQs, diff, 'Offline Knowledge Validator');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>Generate Assessment</span>';
        }
      }
    },

    generateLocalFallbackMCQs(notes, count, diff) {
      const lines = notes.split('\n').map(l => l.trim()).filter(l => l.length > 15);
      const qs = [];
      for (let i = 0; i < count; i++) {
        const sampleLine = lines[i % lines.length] || "Standard Operating Procedure under Saksham platform mandates continuous competency tracking.";
        qs.push({
          id: i + 1,
          question: `Based on the syllabus text: "${sampleLine.slice(0, 70)}...", which of the following is correct?`,
          options: [
            `A) ${sampleLine}`,
            `B) Non-standard empirical adjustment bypassing supervisory sign-off`,
            `C) Procedural deviations without logging validation thresholds`,
            `D) Immediate manual override ignoring protocol safety bounds`
          ],
          correct_index: 0,
          correct_answer: `A) ${sampleLine}`,
          explanation: `Validated directly against training syllabus: "${sampleLine}".`
        });
      }
      return qs;
    },

    renderQuiz(questions, difficulty, modelName) {
      currentQuestions = questions;
      userAnswers = {};

      const quizView = document.getElementById('aiQuizView');
      const questionsContainer = document.getElementById('quizQuestionsContainer');
      const metaInfo = document.getElementById('quizMetaInfo');
      const scoreBadge = document.getElementById('quizLiveScore');
      const completionSummary = document.getElementById('quizCompletionSummary');

      if (metaInfo) metaInfo.textContent = `${difficulty} Level • ${questions.length} Questions • ${modelName || 'Gemini Flash'}`;
      if (scoreBadge) scoreBadge.textContent = `Score: 0 / ${questions.length}`;
      if (completionSummary) completionSummary.textContent = 'Click an option to check your answer.';

      if (questionsContainer) {
        questionsContainer.innerHTML = questions.map((q, qIndex) => {
          return `
            <div class="mcq-box" id="qBox-${q.id}">
              <h4>${qIndex + 1}. ${q.question}</h4>
              <div class="mcq-options-stack">
                ${q.options.map((opt, optIndex) => `
                  <div class="mcq-choice-item" id="opt-${q.id}-${optIndex}" onclick="window.SakshamAIHub.selectOption(${q.id}, ${optIndex})">
                    <span class="mcq-choice-marker">${String.fromCharCode(65 + optIndex)}.</span>
                    <span>${opt.replace(/^[A-D]\)\s*/, '')}</span>
                  </div>
                `).join('')}
              </div>
              <div class="mcq-explanation" id="exp-${q.id}">
                💡 <strong>Explanation:</strong> ${q.explanation}
              </div>
            </div>
          `;
        }).join('');
      }

      if (quizView) {
        quizView.style.display = 'block';
        quizView.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },

    selectOption(questionId, selectedIndex) {
      if (userAnswers[questionId] !== undefined) return;

      userAnswers[questionId] = selectedIndex;
      const question = currentQuestions.find(q => q.id === questionId);
      if (!question) return;

      const isCorrect = selectedIndex === question.correct_index;
      const optElement = document.getElementById(`opt-${questionId}-${selectedIndex}`);
      const correctOptElement = document.getElementById(`opt-${questionId}-${question.correct_index}`);
      const expElement = document.getElementById(`exp-${questionId}`);

      if (isCorrect) {
        if (optElement) optElement.classList.add('correct');
      } else {
        if (optElement) optElement.classList.add('wrong');
        if (correctOptElement) correctOptElement.classList.add('correct');
      }

      if (expElement) {
        expElement.classList.add('visible');
      }

      // Update Live Score
      let correctCount = 0;
      Object.keys(userAnswers).forEach(qId => {
        const qObj = currentQuestions.find(q => q.id === parseInt(qId, 10));
        if (qObj && userAnswers[qId] === qObj.correct_index) {
          correctCount++;
        }
      });

      const answeredCount = Object.keys(userAnswers).length;
      const totalCount = currentQuestions.length;
      const scoreBadge = document.getElementById('quizLiveScore');
      if (scoreBadge) scoreBadge.textContent = `Score: ${correctCount} / ${totalCount}`;

      if (answeredCount === totalCount) {
        const pct = Math.round((correctCount / totalCount) * 100);
        const completionSummary = document.getElementById('quizCompletionSummary');
        if (completionSummary) {
          let badge = pct >= 80 ? '🎉 Excellent' : (pct >= 60 ? '✅ Passed' : '⚠️ Review Notes');
          completionSummary.innerHTML = `<strong>${badge}!</strong> Accuracy: <strong>${pct}%</strong> (${correctCount}/${totalCount} correct).`;
        }
      }
    },

    resetQuiz() {
      if (currentQuestions.length > 0) {
        const diff = document.getElementById('aiDifficultySelect') ? document.getElementById('aiDifficultySelect').value : 'Medium';
        this.renderQuiz(currentQuestions, diff, 'Practice Session');
      }
    },

    // =========================================================
    // FACULTY & MENTOR RECOMMENDATION
    // =========================================================
    async findTrainers(presetSkills) {
      const subjectInput = document.getElementById('aiTrainerSubject');
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const expInput = document.getElementById('aiTrainerExp');
      const minExp = expInput ? parseFloat(expInput.value || 0) : 0;
      const btn = document.getElementById('btnFindTrainers');
      const resultsGrid = document.getElementById('aiTrainerGrid');
      const notice = document.getElementById('aiTrainerNotice');

      if (notice) notice.style.display = 'none';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Matching...</span>';
      }

      let skills = presetSkills;
      if (!skills || !skills.length) {
        skills = subject.toLowerCase().split(/[,; ]+/).filter(w => w.length > 3);
      }

      try {
        const res = await fetch(`${API_BASE}/api/ai/recommend-trainers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: subject,
            required_skills: skills,
            min_experience_years: minExp,
            top_n: 3
          })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        if (data.recommended_trainers && data.recommended_trainers.length > 0) {
          currentTrainersCache = data.recommended_trainers;
          this.renderTrainers(data.recommended_trainers);
        } else {
          if (resultsGrid) resultsGrid.innerHTML = '<p style="color:var(--ink-soft);padding:16px;">No matching faculty found.</p>';
        }
      } catch (err) {
        console.warn('Backend recommendation error:', err);
        if (notice) {
          notice.style.display = 'block';
          notice.style.background = '#FDF5E3';
          notice.style.color = '#9A7412';
          notice.style.border = '1px solid #F3E2B8';
          notice.innerHTML = `⚠️ SAKSHAM AI Server offline at <code>${API_BASE}</code>. Run <code>run.bat</code> in the backend folder.`;
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>Match Faculty</span>';
        }
      }
    },

    renderTrainers(trainers) {
      const resultsGrid = document.getElementById('aiTrainerGrid');
      if (!resultsGrid) return;

      resultsGrid.innerHTML = trainers.map(t => {
        const initials = t.name ? t.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'TR';
        const score = t.match_score || 0;
        const skills = t.matched_skills || [];

        return `
          <div class="mentor-card">
            <div>
              <div class="mentor-rank-badge">#${t.rank} Match</div>
              <div class="mentor-header">
                <div class="mentor-avatar">${initials}</div>
                <div class="mentor-info">
                  <h4>${t.name}</h4>
                  <div class="sub">${t.designation || 'Specialist Trainer'} &bull; ${t.department || 'Meteorology'}</div>
                  <div class="station">📍 ${t.station || 'National Station'} (${Math.round(t.years_of_service || 0)} Yrs Exp)</div>
                </div>
              </div>

              <div class="score-row">
                <span>AI Competency Score</span>
                <span style="color:var(--saffron);">${score} / 100</span>
              </div>
              <div class="progress" style="margin-bottom:10px;">
                <span style="width:${Math.min(100, score)}%;background:var(--saffron);"></span>
              </div>

              <div class="mentor-reason">
                ${t.why_match || 'Demonstrates strong subject alignment with high participant satisfaction.'}
              </div>

              <div class="mentor-skills">
                ${skills.map(s => `<span class="mentor-pill">${s.skill} (${s.proficiency})</span>`).join('')}
              </div>
            </div>

            <div style="display:flex;gap:8px;margin-top:10px;">
              <button class="btn btn-outline btn-sm" style="flex:1;" onclick="window.SakshamAIHub.openDossierModal('${t.trainer_id}')">
                Profile Dossier
              </button>
              <button class="btn btn-navy btn-sm" style="flex:1;" onclick="alert('Guidance request dispatched to ${t.name} (${t.email || 'trainer@saksham.gov.in'}).')">
                Request Guidance
              </button>
            </div>
          </div>
        `;
      }).join('');
    },

    openDossierModal(trainerId) {
      const trainer = currentTrainersCache.find(t => t.trainer_id === trainerId);
      if (!trainer) return;

      const modal = document.getElementById('sakshamDossierModal');
      const nameEl = document.getElementById('modalTrainerName');
      const bodyEl = document.getElementById('modalTrainerBody');

      if (nameEl) nameEl.textContent = `${trainer.name} — Competency Dossier`;
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div class="dossier-grid">
            <div class="dossier-item"><div class="lbl">Trainer ID</div><div class="val">${trainer.trainer_id}</div></div>
            <div class="dossier-item"><div class="lbl">Designation</div><div class="val">${trainer.designation}</div></div>
            <div class="dossier-item"><div class="lbl">Department</div><div class="val">${trainer.department}</div></div>
            <div class="dossier-item"><div class="lbl">Posting Station</div><div class="val">📍 ${trainer.station}</div></div>
            <div class="dossier-item"><div class="lbl">Years of Service</div><div class="val">${trainer.years_of_service} Years</div></div>
            <div class="dossier-item"><div class="lbl">Participant Rating</div><div class="val">⭐ ${trainer.avg_feedback_score} / 5.0</div></div>
            <div class="dossier-item"><div class="lbl">Pass Rate</div><div class="val">✅ ${trainer.pass_rate_percent}%</div></div>
            <div class="dossier-item"><div class="lbl">Official Email</div><div class="val">${trainer.email}</div></div>
          </div>

          <div style="margin-bottom:14px;">
            <strong style="color:var(--navy-800);font-size:13px;">Subjects Taught:</strong>
            <p style="margin:4px 0 0 0;font-size:13px;color:var(--ink-soft);">${trainer.subjects_taught || 'General Technical Protocols'}</p>
          </div>

          <div style="background:#E6F4F2;border-left:3px solid var(--teal);padding:10px 12px;border-radius:6px;">
            <strong style="color:var(--teal-dark);font-size:13px;">5-Factor Scoring Breakdown:</strong>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:6px;font-size:12px;">
              <div>Skill (40%): <strong>${trainer.breakdown ? trainer.breakdown.skill_match_K : '-'}</strong></div>
              <div>Exp (25%): <strong>${trainer.breakdown ? trainer.breakdown.experience_match_E : '-'}</strong></div>
              <div>Rating (15%): <strong>${trainer.breakdown ? trainer.breakdown.rating_R : '-'}</strong></div>
            </div>
          </div>
        `;
      }

      if (modal) modal.classList.add('open');
    },

    closeDossierModal() {
      const modal = document.getElementById('sakshamDossierModal');
      if (modal) modal.classList.remove('open');
    }
  };

  window.SakshamAIHub = Hub;
})();
