/* ===================================================================
   JAN DRISHTI — Kanpur Civic Pulse map
   A stylized ward map built from data, not a decorative image:
   each block's fill responds to the live category filter.
   =================================================================== */

const WARD_LAYOUT = {
  "kalyanpur":      { x:36,  y:150, w:190, h:150, rx:26 },
  "civil-lines":    { x:250, y:78,  w:190, h:120, rx:26 },
  "swaroop-nagar":  { x:462, y:112, w:196, h:150, rx:26 },
  "shastri-nagar":  { x:56,  y:326, w:190, h:140, rx:26 },
  "kakadeo":        { x:270, y:280, w:190, h:160, rx:26 },
  "govind-nagar":   { x:480, y:296, w:190, h:160, rx:26 },
};
const ROADS = [
  ["kalyanpur","civil-lines"], ["civil-lines","swaroop-nagar"],
  ["kalyanpur","shastri-nagar"], ["civil-lines","kakadeo"],
  ["kakadeo","govind-nagar"], ["swaroop-nagar","govind-nagar"],
  ["shastri-nagar","kakadeo"]
];

function wardCenter(id){
  const w = WARD_LAYOUT[id];
  return [w.x + w.w/2, w.y + w.h/2];
}

function toneColorVar(tone){
  return tone==="green" ? "var(--green)" : tone==="orange" ? "var(--orange)" : "var(--red)";
}
function toneTint(tone){
  return tone==="green" ? "var(--green-tint)" : tone==="orange" ? "var(--orange-tint)" : "var(--red-tint)";
}

function valueForFilter(area, filter){
  return filter === "overall" ? area.score : area.categories[filter];
}

function buildMapSvg(filter){
  const roadPaths = ROADS.map(([a,b])=>{
    const [x1,y1] = wardCenter(a), [x2,y2] = wardCenter(b);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--line)" stroke-width="10" stroke-linecap="round"/>`;
  }).join("");

  const wards = AREAS.map(area=>{
    const w = WARD_LAYOUT[area.id];
    const val = valueForFilter(area, filter);
    const tone = scoreTone(val);
    const [cx,cy] = wardCenter(area.id);
    return `
    <g class="ward" data-id="${area.id}" tabindex="0" role="button" aria-label="${area.name}, score ${val}"
       style="cursor:pointer;">
      <rect x="${w.x}" y="${w.y}" width="${w.w}" height="${w.h}" rx="${w.rx}"
        fill="${toneTint(tone)}" stroke="${toneColorVar(tone)}" stroke-width="2" class="ward-rect"></rect>
      <text x="${cx}" y="${cy-6}" text-anchor="middle" font-family="Manrope" font-weight="700" font-size="15" fill="var(--ink)">${area.name}</text>
      <text x="${cx}" y="${cy+16}" text-anchor="middle" font-family="IBM Plex Mono" font-weight="600" font-size="19" fill="${toneColorVar(tone)}">${val}</text>
    </g>`;
  }).join("");

  return `
  <svg viewBox="0 0 700 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" id="civicMapSvg" style="max-height:480px;">
    <path d="M-10 40 C 140 10, 260 70, 400 30 S 640 -10, 720 40" stroke="var(--blue)" stroke-width="3" fill="none" opacity="0.28" stroke-linecap="round"/>
    <text x="560" y="34" font-family="IBM Plex Mono" font-size="11" fill="var(--blue)" opacity="0.7">GANGA →</text>
    ${roadPaths}
    ${wards}
  </svg>`;
}

/**
 * Renders an interactive civic map into `container`.
 * options: { onSelect(areaId), showFilters: bool, showLegend: bool, showPopover: bool }
 */
function renderCivicMap(container, options={}){
  const { onSelect, showPopover = true } = options;
  let filter = "overall";

  container.innerHTML = `<div class="civic-map-shell" style="position:relative;">${buildMapSvg(filter)}</div>`;
  const shell = container.querySelector(".civic-map-shell");

  let popover;
  if(showPopover){
    popover = document.createElement("div");
    popover.className = "map-popover";
    popover.style.cssText = "position:absolute;z-index:20;display:none;width:230px;pointer-events:none;";
    shell.appendChild(popover);
  }

  function paint(){
    shell.querySelectorAll(".ward").forEach(g=>{
      const id = g.dataset.id;
      const area = findArea(id);
      const val = valueForFilter(area, filter);
      const tone = scoreTone(val);
      g.querySelector(".ward-rect").setAttribute("fill", toneTint(tone).startsWith("var")? getComputedCssVar(toneTint(tone)) : toneTint(tone));
    });
  }

  function getComputedCssVar(v){ return v; } // fill accepts var() directly in modern browsers

  function attachEvents(){
    shell.querySelectorAll(".ward").forEach(g=>{
      const id = g.dataset.id;
      const show = ()=> showCard(g, id);
      g.addEventListener("mouseenter", show);
      g.addEventListener("focus", show);
      g.addEventListener("click", ()=>{ if(onSelect) onSelect(id); });
      g.addEventListener("keydown", (e)=>{ if(e.key==="Enter" && onSelect) onSelect(id); });
    });
    shell.addEventListener("mouseleave", ()=>{ if(popover) popover.style.display="none"; });
  }

  function showCard(g, id){
    if(!popover) return;
    const area = findArea(id);
    const val = valueForFilter(area, filter);
    const tone = scoreTone(val);
    popover.innerHTML = `
      <div class="card" style="padding:16px;pointer-events:auto;box-shadow:var(--shadow-lg);">
        <div class="flex-between mb-8">
          <strong style="font-size:15px;">${area.name.toUpperCase()}</strong>
          <span class="status ${tone}">${val}</span>
        </div>
        <div class="stack gap-4 small muted">
          <div class="flex-between"><span>Roads</span><span class="mono">${area.categories.roads}</span></div>
          <div class="flex-between"><span>Cleanliness</span><span class="mono">${area.categories.cleanliness}</span></div>
          <div class="flex-between"><span>Lighting</span><span class="mono">${area.categories.lighting}</span></div>
        </div>
        <hr class="divider" style="margin:10px 0;">
        <div class="flex-between tiny muted">
          <span>${area.activeIssues} active issues</span>
          <span>${area.resolvedThisMonth} resolved</span>
        </div>
        <div class="delta ${area.delta>=0?'up':'down'} tiny mt-8">${area.delta>=0?'+':''}${area.delta} this month</div>
        <a href="area.html?id=${area.id}" class="btn btn-primary btn-sm btn-block mt-12" style="pointer-events:auto;">Explore Area</a>
      </div>`;
    const rect = g.querySelector("rect");
    const x = parseFloat(rect.getAttribute("x")), y = parseFloat(rect.getAttribute("y")), w = parseFloat(rect.getAttribute("width"));
    const svgW = 700, containerW = shell.clientWidth;
    const scale = containerW / svgW;
    let left = (x + w + 10) * scale;
    if(left + 230 > containerW) left = (x - 240) * scale;
    popover.style.left = Math.max(4, left) + "px";
    popover.style.top = (y * scale) + "px";
    popover.style.display = "block";
  }

  attachEvents();

  return {
    setFilter(f){ filter = f; paint(); },
    getFilter(){ return filter; }
  };
}
