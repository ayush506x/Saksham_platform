/* =========================================================
   Trainer Dashboard Script — Saksham
   ========================================================= */

// ---- 1. Init Shell ----
initDashboardShell({ role: "trainer", active: "dashboard.html", title: "Dashboard", crumb: "Trainer workspace" })
  .then(profile => {
    if (!profile) return;
    const name = profile.name || "R. Mehta";
    const initials = name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
    const avatar = document.getElementById("profileAvatar");
    if (avatar && avatar.childNodes[0]) avatar.childNodes[0].textContent = initials;
    const pName = document.getElementById("profileName");
    if (pName) pName.textContent = name;
    const iName = document.getElementById("infoName");
    if (iName) iName.textContent = name;
    const iEmail = document.getElementById("infoEmail");
    if (profile.email && iEmail) iEmail.textContent = profile.email;
  });

// ---- 2. Trainee Table ----
(async function () {
  const rows = await loadWithFallback(Api.getTraineePerformance, MockDB.trainees);
  const traineeTable = document.getElementById("traineeTable");
  if (traineeTable) {
    traineeTable.innerHTML = rows.map(t => `
      <tr>
        <td>${t.name}</td><td>${t.dept}</td><td>${t.course}</td>
        <td style="min-width:140px;"><div class="progress"><span style="width:${t.progress}%"></span></div></td>
        <td>${t.score}</td>
      </tr>`).join("");
  }
})();

// ---- 3. Your Courses list & Gauge & Course Contribution Graph ----
(function () {
  const WEEKS_PER_MODULE = { 2: 2, 3: 3, 4: 4, 5: 6, 6: 8, 8: 10 };
  const trainerCourses = [
    { title: "Public Financial Management",  modules: 6, level: "Intermediate", trainees: 64,  completion: 40 },
    { title: "Effective File Noting",         modules: 2, level: "Beginner",     trainees: 28,  completion: 75 },
    { title: "RTI Act 2005 — Practice",      modules: 5, level: "Intermediate", trainees: 42,  completion: 58 }
  ];

  // Derive weeks from modules
  trainerCourses.forEach(c => {
    c.weeks = WEEKS_PER_MODULE[c.modules] || Math.ceil(c.modules * 1.4);
    const s = c.completion;
    c.statusLabel = s === 100 ? "Completed" : (s > 0 ? "In Progress" : "Not Started");
    c.statusCls   = s === 100 ? "badge-completed" : (s > 0 ? "badge-progress" : "badge-notstarted");
  });

  const list = document.getElementById("coursesList");
  if (list) {
    list.innerHTML = trainerCourses.map(c => `
    <div class="course-item">
      <div class="course-item-head">
        <div class="course-item-title">${c.title}</div>
        <span class="course-badge ${c.statusCls}">${c.statusLabel}</span>
      </div>
      <div class="course-meta">${c.modules} modules &nbsp;·&nbsp; ${c.weeks} weeks &nbsp;·&nbsp; Level: ${c.level} &nbsp;·&nbsp; ${c.trainees} trainees</div>
      <div class="course-progress-row">
        <div class="course-progress-bar">
          <div class="course-progress-fill ${c.completion === 100 ? 'full' : ''}" style="width:${c.completion}%"></div>
        </div>
        <div class="course-progress-label">${c.completion}% trainees done</div>
        <a href="library.html" class="course-continue-btn">View →</a>
      </div>
    </div>`).join("");
  }

  // Gauge
  const avgCompletion = Math.round(trainerCourses.reduce((s, c) => s + c.completion, 0) / trainerCourses.length);
  const completed = trainerCourses.filter(c => c.completion === 100).length;
  const inProgress = trainerCourses.filter(c => c.completion > 0 && c.completion < 100).length;
  const notStarted = trainerCourses.length - completed - inProgress;

  const gPct = document.getElementById("gaugePct");
  if (gPct) gPct.textContent = avgCompletion + "%";
  const gIn = document.getElementById("gStepIn");
  if (gIn) gIn.textContent = inProgress;
  const gComp = document.getElementById("gStepComp");
  if (gComp) gComp.textContent = completed;
  const gNot = document.getElementById("gStepNot");
  if (gNot) gNot.textContent = notStarted;

  const fill = document.getElementById("gaugeFill");
  if (fill) {
    const r = 56, cx = 70, cy = 76;
    const fillDeg = (avgCompletion / 100) * 180;
    const endAngle = 180 + fillDeg;
    const toRad = deg => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(180));
    const y1 = cy + r * Math.sin(toRad(180));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    fill.setAttribute("d", `M ${x1} ${y1} A ${r} ${r} 0 ${fillDeg > 180 ? 1 : 0} 1 ${x2} ${y2}`);
  }

  // Course Contribution Graph
  const contribGraph = document.getElementById("contribGraph");
  const maxWeeks = Math.max(...trainerCourses.map(c => c.weeks));
  const totalWeeks = trainerCourses.reduce((s, c) => s + c.weeks, 0);
  const avgComp = Math.round(trainerCourses.reduce((s, c) => s + c.completion, 0) / trainerCourses.length);

  const tCourses = document.getElementById("totalCoursesStat");
  if (tCourses) tCourses.textContent = trainerCourses.length;
  const aComp = document.getElementById("avgCompletionStat");
  if (aComp) aComp.textContent = avgComp + "%";
  const tWeeks = document.getElementById("totalWeeksStat");
  if (tWeeks) tWeeks.textContent = totalWeeks + " wks";

  if (contribGraph) {
    contribGraph.innerHTML = trainerCourses.map((c, i) => {
      const weekPct = Math.round((c.weeks / maxWeeks) * 100);
      const colors = [
        "linear-gradient(90deg,#E8590C,#0F766E)",
        "linear-gradient(90deg,#0A2647,#0F766E)",
        "linear-gradient(90deg,#C99A2E,#E8590C)"
      ];
      const bg = colors[i % colors.length];
      return `
      <div class="contrib-row">
        <div class="contrib-name" title="${c.title}">${c.title}</div>
        <div class="contrib-track-wrap">
          <div class="contrib-track">
            <div class="contrib-week-bar" style="width:${weekPct}%"></div>
            <div class="contrib-completion-bar" data-w="${c.completion}" style="width:0%;background:${bg}">
              <span class="contrib-bar-label">${c.completion}% done</span>
            </div>
          </div>
          <div class="contrib-meta">
            <span class="cm-weeks">${c.weeks} weeks</span>
            <span>${c.modules} modules · ${c.trainees} trainees</span>
          </div>
        </div>
        <div class="contrib-pct">${c.completion}%</div>
      </div>`;
    }).join("");

    requestAnimationFrame(() => {
      setTimeout(() => {
        contribGraph.querySelectorAll(".contrib-completion-bar").forEach(bar => {
          bar.style.width = bar.dataset.w + "%";
          bar.classList.add("loaded");
        });
      }, 120);
    });
  }
})();

// ---- 4. Daily Contribution Heatmap ----
(function () {
  const cellsEl    = document.getElementById("dhmCells");
  const monthRowEl = document.getElementById("dhmMonthRow");
  if (!cellsEl) return;

  const WEEKS = 52;
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const today  = new Date();

  function rng(seed) {
    let s = seed;
    return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967296; };
  }
  const rand = rng(137);

  const grid = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const r = rand();
      const isHot    = w >= WEEKS - 3 && d < 5;
      const isMid    = w >= 20 && w < 45 && r > .3;
      if (r < .35 && !isHot)  return 0;
      if (isHot)  return r < .25 ? 0 : (r < .5 ? 2 : (r < .75 ? 3 : 4));
      if (isMid)  return Math.min(4, Math.ceil(r * 4));
      return r < .6 ? 1 : (r < .85 ? 2 : (r < .95 ? 3 : 4));
    })
  );

  const all    = grid.flat();
  const total  = all.reduce((s, v) => s + v, 0);
  let streak = 0;
  outer: for (let w = WEEKS - 1; w >= 0; w--) {
    for (let d = 6; d >= 0; d--) {
      if (grid[w][d] > 0) streak++;
      else if (streak > 0) break outer;
    }
  }
  let cur = 0, longest = 0;
  all.forEach(v => { if (v > 0) { cur++; longest = Math.max(longest, cur); } else cur = 0; });

  const totalEl = document.getElementById("dhmTotal");
  if (totalEl) totalEl.textContent = (total * 4).toLocaleString();
  const streakEl = document.getElementById("dhmStreak");
  if (streakEl) streakEl.textContent = streak + " days";
  const longEl = document.getElementById("dhmLongest");
  if (longEl) longEl.textContent = longest + " days";

  let lastMonth = -1;
  const monthData = [];
  for (let w = 0; w < WEEKS; w++) {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - (WEEKS - 1 - w) * 7);
    const m = dt.getMonth();
    if (m !== lastMonth) { monthData.push({ w, name: MONTHS[m] }); lastMonth = m; }
  }
  if (monthRowEl) {
    monthRowEl.innerHTML = monthData.map((ml, i) => {
      const next = monthData[i + 1];
      const span = next ? next.w - ml.w : WEEKS - ml.w;
      return `<div class="dhm-month-lbl" style="flex:${span}">${ml.name}</div>`;
    }).join("");
  }

  cellsEl.innerHTML = grid.map((week, w) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - (WEEKS - 1 - w) * 7);
    return `<div class="dhm-col">${week.map((level, d) => {
      const day = new Date(dt); day.setDate(day.getDate() + d);
      const dateStr = day.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
      const acts = level === 0 ? "No activity" : (level === 1 ? "1 activity" : `${level * 3} activities`);
      return `<div class="dhm-cell dhm-l${level}" title="${dateStr} · ${acts}"></div>`;
    }).join("")}</div>`;
  }).join("");
})();

// =========================================================
//  5. ANALYTICS CHARTS — pure SVG, no dependencies
// =========================================================
const svgNS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs, text) {
  const e = document.createElementNS(svgNS, tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (text !== undefined) e.textContent = text;
  return e;
}

// ---- Line Chart: Enrollment Trend ----
(function () {
  const svg = document.getElementById("lineChart");
  if (!svg) return;
  const W = 380, H = 160;
  const pad = { t: 10, r: 16, b: 26, l: 36 };
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
  const months  = ["Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"];
  const enroll  = [38, 45, 30, 52, 60, 55, 72, 68, 80, 74, 90, 85];
  const target  = [40, 40, 40, 55, 55, 55, 70, 70, 70, 80, 80, 80];
  const maxVal  = 100;
  const xStep = cW / (months.length - 1);
  const scaleY = v => pad.t + cH - (v / maxVal) * cH;
  const scaleX = i => pad.l + i * xStep;

  const defs = svgEl("defs");
  const grad = svgEl("linearGradient", { id: "lgGrad", x1:"0", y1:"0", x2:"0", y2:"1" });
  grad.appendChild(svgEl("stop", { offset:"0%", "stop-color":"#E8590C" }));
  grad.appendChild(svgEl("stop", { offset:"100%", "stop-color":"#E8590C", "stop-opacity":"0" }));
  defs.appendChild(grad); svg.appendChild(defs);

  [0,25,50,75,100].forEach(v => {
    const y = scaleY(v);
    svg.appendChild(svgEl("line",{ x1:pad.l, y1:y, x2:W-pad.r, y2:y, stroke:"#F0F2F5", "stroke-width":"1" }));
    svg.appendChild(svgEl("text",{ x:pad.l-4, y:y+4, "text-anchor":"end","font-size":"8.5",fill:"#A0AEC0" }, v+"%"));
  });

  const smooth = (data) => {
    const pts = data.map((v,i)=>[scaleX(i),scaleY(v)]);
    let d = `M ${pts[0].join(",")}`;
    for (let i=1;i<pts.length;i++){
      const cp1x=pts[i-1][0]+xStep*.35, cp1y=pts[i-1][1];
      const cp2x=pts[i][0]-xStep*.35,   cp2y=pts[i][1];
      d+=` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i].join(",")}`;
    }
    return { d, pts };
  };

  const tRes = smooth(target);
  svg.appendChild(svgEl("path",{ d:tRes.d, fill:"none", stroke:"#0F766E","stroke-width":"1.5","stroke-dasharray":"4,3",opacity:"0.45" }));

  const eRes = smooth(enroll);
  const pts  = eRes.pts;
  const area = eRes.d + ` L ${pts[pts.length-1][0]},${H-pad.b} L ${pts[0][0]},${H-pad.b} Z`;
  svg.appendChild(svgEl("path",{ d:area, fill:"url(#lgGrad)", opacity:"0.18" }));
  svg.appendChild(svgEl("path",{ d:eRes.d, fill:"none", stroke:"#E8590C","stroke-width":"2.5","stroke-linecap":"round" }));

  enroll.forEach((v,i) => svg.appendChild(svgEl("circle",{ cx:scaleX(i), cy:scaleY(v), r:"3.5", fill:"#fff", stroke:"#E8590C","stroke-width":"2" })));
  months.forEach((m,i) => { if(i%2===0) svg.appendChild(svgEl("text",{x:scaleX(i),y:H-4,"text-anchor":"middle","font-size":"8.5",fill:"#A0AEC0"},m)); });
})();

// ---- Bar Chart: Avg Score by Dept ----
(function () {
  const svg = document.getElementById("barChart");
  if (!svg) return;
  const W=380, H=160;
  const pad={t:10,r:16,b:26,l:38};
  const cW=W-pad.l-pad.r, cH=H-pad.t-pad.b;
  const depts=["Finance","IT","Revenue","Admin","Policy"];
  const scores=[72,85,68,76,60];
  const colors=["#0A2647","#0F766E","#E8590C","#C99A2E","#123B6B"];
  const barW=(cW/depts.length)*0.52;
  const groupW=cW/depts.length;

  [0,25,50,75,100].forEach(v=>{
    const y=pad.t+cH-(v/100)*cH;
    svg.appendChild(svgEl("line",{x1:pad.l,y1:y,x2:W-pad.r,y2:y,stroke:"#F0F2F5","stroke-width":"1"}));
    svg.appendChild(svgEl("text",{x:pad.l-4,y:y+4,"text-anchor":"end","font-size":"8.5",fill:"#A0AEC0"},v+"%"));
  });

  scores.forEach((s,i)=>{
    const bH=(s/100)*cH;
    const x=pad.l+i*groupW+(groupW-barW)/2, y=pad.t+cH-bH;
    const rr=4;
    const d=`M ${x},${y+rr} Q ${x},${y} ${x+rr},${y} L ${x+barW-rr},${y} Q ${x+barW},${y} ${x+barW},${y+rr} L ${x+barW},${y+bH} L ${x},${y+bH} Z`;
    svg.appendChild(svgEl("path",{d,fill:colors[i],opacity:"0.88"}));
    svg.appendChild(svgEl("text",{x:x+barW/2,y:y-3,"text-anchor":"middle","font-size":"9",fill:colors[i],"font-weight":"700"},s+"%"));
    svg.appendChild(svgEl("text",{x:x+barW/2,y:H-4,"text-anchor":"middle","font-size":"8.5",fill:"#A0AEC0"},depts[i]));
  });
})();

// ---- Donut Chart: Completion Share ----
(function () {
  const svg=document.getElementById("donutChart");
  const legend=document.getElementById("donutLegend");
  if(!svg) return;
  const cx=105, cy=88, R=68, r=42;

  const segs=[
    {label:"Completed",   value:42, color:"#0F766E"},
    {label:"In Progress", value:35, color:"#E8590C"},
    {label:"Not Started", value:23, color:"#E2E8F0"}
  ];
  const tot=segs.reduce((s,d)=>s+d.value,0);
  const toRad=d=>(d*Math.PI)/180;

  let ang=-90;
  segs.forEach(seg=>{
    const sw=(seg.value/tot)*360;
    const ea=ang+sw;
    const [x1,y1]=[cx+R*Math.cos(toRad(ang)), cy+R*Math.sin(toRad(ang))];
    const [x2,y2]=[cx+R*Math.cos(toRad(ea)),  cy+R*Math.sin(toRad(ea))];
    const [ix1,iy1]=[cx+r*Math.cos(toRad(ea)),  cy+r*Math.sin(toRad(ea))];
    const [ix2,iy2]=[cx+r*Math.cos(toRad(ang)), cy+r*Math.sin(toRad(ang))];
    const lg=sw>180?1:0;
    const path=svgEl("path",{
      d:`M${x1} ${y1} A${R} ${R} 0 ${lg} 1 ${x2} ${y2} L${ix1} ${iy1} A${r} ${r} 0 ${lg} 0 ${ix2} ${iy2} Z`,
      fill:seg.color, stroke:"#fff","stroke-width":"2"
    });
    path.style.cursor="pointer";
    path.addEventListener("mouseover",()=>path.setAttribute("opacity","0.78"));
    path.addEventListener("mouseout",()=>path.removeAttribute("opacity"));
    svg.appendChild(path);
    ang=ea;
  });

  svg.appendChild(svgEl("text",{x:cx,y:cy-6,"text-anchor":"middle","font-size":"22","font-weight":"700",fill:"#0A2647","font-family":"Poppins,sans-serif"},tot+"%"));
  svg.appendChild(svgEl("text",{x:cx,y:cy+12,"text-anchor":"middle","font-size":"9",fill:"#7AA891","font-weight":"600"},"TRAINEES"));

  let yo=22;
  const barX=182, barMaxW=170;
  segs.forEach(seg=>{
    const pct=Math.round((seg.value/tot)*100);
    const bW=(pct/100)*barMaxW;
    svg.appendChild(svgEl("text",{x:barX,y:yo,"font-size":"10.5",fill:"#1E293B","font-weight":"600"},seg.label));
    svg.appendChild(svgEl("rect",{x:barX,y:yo+4,width:barMaxW,height:"10",rx:"5",fill:"#F0F2F5"}));
    svg.appendChild(svgEl("rect",{x:barX,y:yo+4,width:bW,height:"10",rx:"5",fill:seg.color,opacity:"0.88"}));
    svg.appendChild(svgEl("text",{x:barX+barMaxW+6,y:yo+13,"font-size":"9.5",fill:seg.color,"font-weight":"700"},pct+"%"));
    yo+=40;
  });

  if(legend) legend.innerHTML=segs.map(s=>
    `<div class="chart-legend-item"><div class="cl-dot" style="background:${s.color}"></div>${s.label} (${s.value}%)</div>`
  ).join("");
})();

// ---- Radar Chart: Trainer Skill ----
(function () {
  const svg=document.getElementById("radarChart");
  if(!svg) return;
  const cx=190, cy=108, maxR=75;
  const axes=["Subject Matter","Assessment Design","Engagement","Feedback Quality","Digital Tools","Admin Skills"];
  const trainer=[92,78,85,70,65,88];
  const avg    =[75,70,72,68,60,74];
  const N=axes.length;
  const toRad=d=>(d*Math.PI)/180;
  const pt=(i,rr)=>{
    const a=toRad(i*(360/N)-90);
    return [cx+rr*Math.cos(a), cy+rr*Math.sin(a)];
  };

  for(let l=5;l>=1;l--){
    const rr=(l/5)*maxR;
    const pts=axes.map((_,i)=>pt(i,rr).join(",")).join(" ");
    svg.appendChild(svgEl("polygon",{points:pts, fill:l%2===0?"#F8FAFC":"#fff", stroke:"#E8E8EE","stroke-width":"0.8"}));
  }

  axes.forEach((label,i)=>{
    const [ax,ay]=pt(i,maxR);
    svg.appendChild(svgEl("line",{x1:cx,y1:cy,x2:ax,y2:ay,stroke:"#E2E8F0","stroke-width":"1"}));
    const [lx,ly]=pt(i,maxR+16);
    const anch=lx<cx-5?"end":(lx>cx+5?"start":"middle");
    svg.appendChild(svgEl("text",{x:lx,y:ly+3.5,"text-anchor":anch,"font-size":"9","font-weight":"600",fill:"#5B6B82"},label));
  });

  const avgPts=avg.map((v,i)=>pt(i,(v/100)*maxR).join(",")).join(" ");
  svg.appendChild(svgEl("polygon",{points:avgPts,fill:"#0F766E","fill-opacity":"0.12",stroke:"#0F766E","stroke-width":"1.5","stroke-dasharray":"4,3"}));

  const trPts=trainer.map((v,i)=>pt(i,(v/100)*maxR).join(",")).join(" ");
  svg.appendChild(svgEl("polygon",{points:trPts,fill:"#E8590C","fill-opacity":"0.15",stroke:"#E8590C","stroke-width":"2.2"}));

  trainer.forEach((v,i)=>{
    const [x,y]=pt(i,(v/100)*maxR);
    svg.appendChild(svgEl("circle",{cx:x,cy:y,r:"4",fill:"#fff",stroke:"#E8590C","stroke-width":"2.2"}));
    const [lx,ly]=pt(i,(v/100)*maxR+13);
    svg.appendChild(svgEl("text",{x:lx,y:ly+3,"text-anchor":"middle","font-size":"9","font-weight":"700",fill:"#E8590C"},v));
  });
})();

// =========================================================
//  6. EDIT PROFILE MODAL
// =========================================================
(function () {
  const overlay   = document.getElementById("epOverlay");
  const btnOpen   = document.getElementById("editProfileBtn");
  const btnClose  = document.getElementById("epClose");
  const btnCancel = document.getElementById("epCancel");
  const btnSave   = document.getElementById("epSave");
  if (!overlay || !btnOpen) return;

  const skillTags    = ["Public Finance","Policy Analysis","Governance"];
  const interestTags = ["Policy research","Digital governance"];

  function renderTags(arr, boxId, inputId) {
    const box   = document.getElementById(boxId);
    const input = document.getElementById(inputId);
    if (!box || !input) return;
    box.querySelectorAll(".ep-tag").forEach(t => t.remove());
    arr.forEach((tag, i) => {
      const span = document.createElement("span");
      span.className = "ep-tag";
      span.innerHTML = `${tag}<button class="rm" aria-label="Remove ${tag}" title="Remove">&times;</button>`;
      span.querySelector(".rm").addEventListener("click", () => {
        arr.splice(i, 1);
        renderTags(arr, boxId, inputId);
      });
      box.insertBefore(span, input);
    });
    box.addEventListener("click", () => input.focus());
    input.onkeydown = e => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const val = input.value.trim().replace(/,$/, "");
        if (val && !arr.includes(val)) { arr.push(val); renderTags(arr, boxId, inputId); }
        input.value = "";
      }
      if (e.key === "Backspace" && input.value === "" && arr.length > 0) {
        arr.pop(); renderTags(arr, boxId, inputId);
      }
    };
  }

  function openModal() {
    const epName = document.getElementById("epName");
    if (epName) epName.value = document.getElementById("infoName")?.textContent || "R. Mehta";
    const epDept = document.getElementById("epDept");
    if (epDept) epDept.value = document.querySelector(".info-row:nth-child(4) .info-value")?.textContent || "Governance & Finance";
    const epDesig = document.getElementById("epDesig");
    if (epDesig) epDesig.value = document.querySelector(".info-row:nth-child(5) .info-value")?.textContent || "Senior Trainer";
    const epRegion = document.getElementById("epRegion");
    if (epRegion) epRegion.value = document.querySelector(".info-row:nth-child(6) .info-value")?.textContent || "Central Secretariat";
    const epQual = document.getElementById("epQual");
    if (epQual) epQual.value = localStorage.getItem("ep_qual") || "M.A. Public Administration, Delhi University";
    const epWork = document.getElementById("epWork");
    if (epWork) epWork.value = localStorage.getItem("ep_work") || "Senior Trainer, Governance Department — 8 years of service, previously posted in Policy & Revenue Dept (3 years).";

    const sk = localStorage.getItem("ep_skills");
    const it = localStorage.getItem("ep_interests");
    skillTags.splice(0, skillTags.length, ...(sk ? JSON.parse(sk) : ["Public Finance","Policy Analysis","Governance"]));
    interestTags.splice(0, interestTags.length, ...(it ? JSON.parse(it) : ["Policy research","Digital governance"]));

    renderTags(skillTags,    "epSkillBox",    "epSkillInput");
    renderTags(interestTags, "epInterestBox", "epInterestInput");

    overlay.classList.add("open");
    if (epName) epName.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  btnOpen.addEventListener("click", e => { e.preventDefault(); openModal(); });
  if (btnClose)  btnClose.addEventListener("click", closeModal);
  if (btnCancel) btnCancel.addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && overlay.classList.contains("open")) closeModal(); });

  if (btnSave) {
    btnSave.addEventListener("click", () => {
      const si = document.getElementById("epSkillInput");
      if (si?.value.trim()) { skillTags.push(si.value.trim()); si.value = ""; }
      const ii = document.getElementById("epInterestInput");
      if (ii?.value.trim()) { interestTags.push(ii.value.trim()); ii.value = ""; }

      const name   = document.getElementById("epName")?.value.trim()   || "R. Mehta";
      const dept   = document.getElementById("epDept")?.value.trim()   || "Governance & Finance";
      const desig  = document.getElementById("epDesig")?.value.trim()  || "Senior Trainer";
      const region = document.getElementById("epRegion")?.value.trim() || "Central Secretariat";
      const qual   = document.getElementById("epQual")?.value.trim()   || "";
      const work   = document.getElementById("epWork")?.value.trim()   || "";

      const nameEl     = document.getElementById("profileName");
      const infoNameEl = document.getElementById("infoName");
      const avatarEl   = document.getElementById("profileAvatar");
      const roleEl     = document.getElementById("profileRoleLabel");

      if (nameEl)     nameEl.textContent = name;
      if (infoNameEl) infoNameEl.textContent = name;

      if (avatarEl && avatarEl.childNodes[0]) {
        const initials = name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
        avatarEl.childNodes[0].textContent = initials;
      }
      if (roleEl) roleEl.textContent = `${desig} · ${dept}`;

      const infoRows = document.querySelectorAll(".profile-info .info-row .info-value");
      if (infoRows[0]) infoRows[0].textContent = name;
      if (infoRows[2]) infoRows[2].textContent = dept;
      if (infoRows[3]) infoRows[3].textContent = dept;
      if (infoRows[4]) infoRows[4].textContent = desig;
      if (infoRows[5]) infoRows[5].textContent = region;

      localStorage.setItem("ep_qual",      qual);
      localStorage.setItem("ep_work",      work);
      localStorage.setItem("ep_skills",    JSON.stringify(skillTags));
      localStorage.setItem("ep_interests", JSON.stringify(interestTags));
      localStorage.setItem("ep_name",      name);
      localStorage.setItem("ep_dept",      dept);
      localStorage.setItem("ep_desig",     desig);
      localStorage.setItem("ep_region",    region);

      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = "✓ Profile updated successfully";
      toast.style.cssText = "background:#0F766E;border-left-color:#5BBD80;";
      let region2 = document.querySelector(".toast-region");
      if (!region2) {
        region2 = document.createElement("div");
        region2.className = "toast-region";
        document.body.appendChild(region2);
      }
      region2.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      closeModal();
    });
  }

  // Restore persisted values on page load
  (function restoreFromStorage() {
    const n  = localStorage.getItem("ep_name");
    const d  = localStorage.getItem("ep_dept");
    const dg = localStorage.getItem("ep_desig");
    const rg = localStorage.getItem("ep_region");
    if (n) {
      const nameEl     = document.getElementById("profileName");
      const infoNameEl = document.getElementById("infoName");
      const avatarEl   = document.getElementById("profileAvatar");
      const roleEl     = document.getElementById("profileRoleLabel");
      if (nameEl)     nameEl.textContent = n;
      if (infoNameEl) infoNameEl.textContent = n;
      if (avatarEl && avatarEl.childNodes[0]) {
        avatarEl.childNodes[0].textContent = n.split(" ").map(s=>s[0]).slice(0,2).join("").toUpperCase();
      }
      if (roleEl && dg && d) roleEl.textContent = `${dg} · ${d}`;
      const infoRows = document.querySelectorAll(".profile-info .info-row .info-value");
      if (infoRows[0]) infoRows[0].textContent = n;
      if (infoRows[3]) infoRows[3].textContent = d || "";
      if (infoRows[4]) infoRows[4].textContent = dg || "";
      if (infoRows[5]) infoRows[5].textContent = rg || "";
    }
  })();
})();
