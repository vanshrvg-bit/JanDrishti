/* ===================================================================
   JAN DRISHTI — shared app logic
   =================================================================== */

/* ---------------- local demo state ---------------- */
const STORE_KEY = "jandrishti_state_v1";
function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return { confirmed: {}, reports: [], points: 340, badges:["Civic Champion"], reported:8, confirmedCount:14, verified:5, azadi: 53 };
}
function saveState(s){ localStorage.setItem(STORE_KEY, JSON.stringify(s)); }
let STATE = loadState();

function addReport(report){
  STATE.reports.push(report);
  STATE.reported += 1;
  STATE.points += 15;
  STATE.azadi = Math.min(75, STATE.azadi + 1);
  const area = findArea(report.areaId);
  if(area) area.activeIssues += 1;
  saveState(STATE);
}
function confirmIssue(issueId){
  if(STATE.confirmed[issueId]) return false;
  STATE.confirmed[issueId] = true;
  STATE.confirmedCount += 1;
  STATE.points += 5;
  saveState(STATE);
  const issue = findIssue(issueId);
  if(issue) issue.confirms += 1;
  return true;
}
function isConfirmed(issueId){ return !!STATE.confirmed[issueId]; }

/* ---------------- icons ---------------- */
const ICONS = {
  road: `<path d="M5 3 2 21M15 3l3 18M9 3h2M8.5 8h1M8 13h1M7.5 18h1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
  broom: `<path d="M19 3 9 13m10-10-3 7-9 9-3-3 9-9 7-3ZM5 19l-2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  bulb: `<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  drop: `<path d="M12 2.5S5 11 5 15.5a7 7 0 0 0 14 0C19 11 12 2.5 12 2.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,
  leaf: `<path d="M20 4C10 4 4 10 4 18c8 0 14-6 14-14ZM7 17 18 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  signal: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M8 14a5 5 0 0 1 8 0M6 11a8 8 0 0 1 12 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/>`,
  access: `<circle cx="12" cy="5" r="1.6" fill="currentColor"/><path d="M12 8v5m0 0-4 7m4-7 4 7m-4-3 5-1.2M12 13l-5-1.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  building: `<path d="M4 21V6l8-3 8 3v15M4 21h16M9 21v-5h6v5M9 10h.01M9 14h.01M15 10h.01M15 14h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  other: `<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>`,
  camera: `<path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="13.5" r="3.4" stroke="currentColor" stroke-width="1.6"/>`,
  pin: `<path d="M12 22s7-7.3 7-12.5A7 7 0 0 0 5 9.5C5 14.7 12 22 12 22Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.3" stroke="currentColor" stroke-width="1.6"/>`,
  check: `<path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  arrow: `<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  home: `<path d="M4 11 12 4l8 7v9H4v-9Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,
  map: `<path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.6"/>`,
  flag: `<path d="M6 21V4m0 1 12 3-12 5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,
  chart: `<path d="M4 20h16M7 20V10m5 10V4m5 16v-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
  user: `<circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.6"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
};
function icon(name, cls=""){ return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${ICONS[name]||ICONS.other}</svg>`; }

/* ---------------- header / footer / mobile nav ---------------- */
function renderChrome(active){
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const bottom = document.getElementById("bottom-nav");
  if(header){
    header.innerHTML = `
      <div class="wrap">
        <a href="index.html" class="brand">
          <span class="flag">🇮🇳</span>
          <span>JAN DRISHTI<small>See your area. Shape your city.</small></span>
        </a>
        <nav class="nav-links">
          <a href="index.html" class="${active==='home'?'active':''}">Home</a>
          <a href="areas.html" class="${active==='areas'?'active':''}">Explore Areas</a>
          <a href="issues.html" class="${active==='issues'?'active':''}">Issues</a>
          <a href="impact.html" class="${active==='impact'?'active':''}">Impact</a>
          <a href="impact.html#about" class="${active==='about'?'active':''}">About</a>
        </nav>
        <div class="header-actions">
          <button class="hamburger" id="hamburgerBtn" aria-label="Menu">${icon('menu')}</button>
          <a href="report.html" class="btn btn-saffron"><span>Report an Issue</span>${icon('arrow')}</a>
        </div>
      </div>
      <div class="mobile-menu" id="mobileMenu">
        <a href="index.html">Home</a>
        <a href="areas.html">Explore Areas</a>
        <a href="issues.html">Issues</a>
        <a href="impact.html">Impact</a>
        <a href="impact.html#about">About</a>
      </div>
    `;
    const hb = document.getElementById("hamburgerBtn");
    const mm = document.getElementById("mobileMenu");
    if(hb) hb.addEventListener("click", ()=> mm.classList.toggle("open"));
  }
  if(bottom){
    bottom.innerHTML = `
      <a href="index.html" class="${active==='home'?'active':''}">${icon('home')}Home</a>
      <a href="areas.html" class="${active==='areas'?'active':''}">${icon('map')}Areas</a>
      <a href="report.html" class="${active==='report'?'active':''}">${icon('flag')}Report</a>
      <a href="issues.html" class="${active==='issues'?'active':''}">${icon('chart')}Issues</a>
      <a href="impact.html" class="${active==='impact'?'active':''}">${icon('user')}Impact</a>
    `;
  }
  if(footer){
    footer.innerHTML = `
      <div class="wrap">
        <div class="stack gap-8">
          <div class="brand" style="font-size:16px;"><span class="flag">🇮🇳</span><span>JAN DRISHTI</span></div>
          <p class="footer-tag">Built for "Code for the Nation" — a civic health platform prototype for Kanpur.</p>
        </div>
        <div class="footer-tag">All civic data shown is illustrative demo data for this prototype.</div>
      </div>
    `;
  }
}

/* ---------------- ring gauge ---------------- */
function ringGauge({ score, size=180, stroke=14, label="Civic Health" }){
  const tone = scoreTone(score);
  const color = `var(--${tone==='green'?'green':tone==='orange'?'orange':'red'})`;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score/100) * c;
  return `
  <div class="ring-wrap" style="width:${size}px;height:${size}px;">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle class="ring-track" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}"></circle>
      <circle class="ring-value" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}"
        stroke="${color}" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-target="${offset}"></circle>
    </svg>
    <div class="ring-center">
      <span class="num" style="font-size:${size*0.24}px;">${score}</span>
      <span class="lbl">${label}</span>
    </div>
  </div>`;
}
function animateRings(root=document){
  root.querySelectorAll(".ring-value").forEach(el=>{
    const target = el.getAttribute("data-target");
    requestAnimationFrame(()=> requestAnimationFrame(()=>{ el.style.strokeDashoffset = target; }));
  });
}

/* ---------------- category bars ---------------- */
function categoryBars(categories){
  return Object.entries(categories).map(([key,val])=>{
    const meta = CATEGORY_META[key];
    const tone = scoreTone(val);
    return `
    <div class="cat-row">
      <span class="cat-name">${meta.label}</span>
      <div class="cat-track"><div class="cat-fill" style="width:0%;background:var(--${tone});" data-target="${val}"></div></div>
      <span class="cat-score tone-${tone}">${val}</span>
    </div>`;
  }).join("");
}
function animateBars(root=document){
  root.querySelectorAll(".cat-fill").forEach(el=>{
    const target = el.getAttribute("data-target");
    requestAnimationFrame(()=> requestAnimationFrame(()=>{ el.style.width = target+"%"; }));
  });
}

/* ---------------- area card ---------------- */
function areaCard(a){
  const tone = scoreTone(a.score);
  return `
  <a href="area.html?id=${a.id}" class="card card-hover stack gap-12" style="text-decoration:none;">
    <div class="flex-between">
      <div>
        <h3 style="font-size:19px;">${a.name}</h3>
        <span class="faint tiny">${a.city}</span>
      </div>
      <span class="status ${tone}">${tone==='green'?'Healthy':tone==='orange'?'Needs Attention':'Critical'}</span>
    </div>
    <div class="flex" style="align-items:baseline;gap:10px;">
      <span class="mono bold" style="font-size:30px;">${a.score}</span>
      <span class="faint">/100</span>
      <span class="delta ${a.delta>=0?'up':'down'}">${a.delta>=0?'+':''}${a.delta} this month</span>
    </div>
    <hr class="divider" style="margin:4px 0;">
    <div class="flex-between small muted">
      <span>${a.activeIssues} active issues</span>
      <span>${a.resolvedThisMonth} resolved</span>
    </div>
  </a>`;
}

/* ---------------- issue card ---------------- */
const STATUS_LABEL = { reported:"Reported", verified:"Community Verified", assigned:"Assigned", progress:"Work in Progress", resolved:"Resolved" };
const STATUS_TONE = { reported:"neutral", verified:"blue", assigned:"orange", progress:"orange", resolved:"green" };

function issueCard(iss){
  const area = findArea(iss.area);
  return `
  <div class="card card-hover stack gap-12 issue-card" data-id="${iss.id}" style="cursor:pointer;">
<div class="photo-block" style="height:130px;border-radius:12px;overflow:hidden;"><img src="${iss.photo}" alt="${iss.title}" style="width:100%;height:100%;object-fit:cover;display:block"></div>    <div class="flex-between">
      <span class="tag">${CATEGORY_META[iss.category].label}</span>
      <span class="status ${STATUS_TONE[iss.status]}">${STATUS_LABEL[iss.status]}</span>
    </div>
    <h3 style="font-size:17px;">${iss.title}</h3>
    <span class="small muted">${iss.location}, ${area?area.name:''}</span>
    <div class="flex-between mt-8">
      <span class="mono bold tone-${scoreTone(iss.priority)}">${iss.priority}/100</span>
      <span class="small faint">${iss.confirms} confirmations</span>
    </div>
  </div>`;
}

/* simple generative "photo" placeholder so the prototype needs no binary assets */
function photoSvg(seed, category){
  const palette = { roads:["#D9CBB8","#B7A489"], cleanliness:["#C9E4D3","#9CCBAE"], lighting:["#F4E3B8","#E8C878"],
    water:["#C7DEF0","#9EC3E3"], greenery:["#D3E8C8","#A9CE96"], traffic:["#F0CFC0","#E3A98D"],
    accessibility:["#DCD3EE","#B9A7DA"], services:["#D9DEE8","#AFB9CE"] };
  const [c1,c2] = palette[category] || ["#e5e5e5","#cfcfcf"];
  let hash=0; for(const ch of seed) hash = (hash*31 + ch.charCodeAt(0))>>>0;
  const shapes = Array.from({length:5}).map((_,i)=>{
    const x = (hash>>(i*3))%100, y=(hash>>(i*2+1))%60+20, r=18+((hash>>(i*4))%22);
    return `<circle cx="${x}%" cy="${y}%" r="${r}" fill="${c2}" opacity="0.5"/>`;
  }).join("");
  return `<svg viewBox="0 0 100 60" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    <rect width="100" height="60" fill="${c1}"/>${shapes}
  </svg>`;
}

/* ---------------- trend chart (svg) ---------------- */
function trendChart(trend, w=560, h=180){
  const pad = 28;
  const max = Math.max(...trend.map(t=>t[1]))+6;
  const min = Math.min(...trend.map(t=>t[1]))-6;
  const stepX = (w - pad*2) / (trend.length-1);
  const pts = trend.map((t,i)=>{
    const x = pad + i*stepX;
    const y = h - pad - ((t[1]-min)/(max-min))*(h-pad*2);
    return [x,y];
  });
  const path = pts.map((p,i)=> (i===0?"M":"L")+p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
  const area = path + ` L${pts[pts.length-1][0]},${h-pad} L${pts[0][0]},${h-pad} Z`;
  const dots = pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="var(--green)" stroke="#fff" stroke-width="2"/>
    <text x="${p[0]}" y="${p[1]-12}" text-anchor="middle" font-family="IBM Plex Mono" font-size="12" font-weight="600" fill="var(--ink)">${trend[i][1]}</text>
    <text x="${p[0]}" y="${h-8}" text-anchor="middle" font-family="Inter" font-size="11" fill="var(--ink-faint)">${trend[i][0]}</text>`).join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" class="reveal in">
    <defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--green)" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="var(--green)" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${area}" fill="url(#trendFill)"/>
    <path d="${path}" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
  </svg>`;
}

/* ---------------- scroll reveal ---------------- */
function initReveal(){
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold:.15 });
  els.forEach(el=>io.observe(el));
}

function qs(name){ return new URLSearchParams(location.search).get(name); }

document.addEventListener("DOMContentLoaded", ()=>{
  animateRings(); animateBars(); initReveal();
});
