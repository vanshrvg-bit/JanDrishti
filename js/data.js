/*


   JAN DRISHTI — It is a Demo civic dataset
   All figures are prototype data for our college event. Nothing here reflects real Kanpur civic records.
   
   
   */

const CATEGORY_META = {
  roads:          { label: "Roads",            icon: "road" },
  cleanliness:    { label: "Cleanliness",       icon: "broom" },
  lighting:       { label: "Street Lighting",   icon: "bulb" },
  water:          { label: "Water",             icon: "drop" },
  greenery:       { label: "Greenery",          icon: "leaf" },
  traffic:        { label: "Traffic",           icon: "signal" },
  accessibility:  { label: "Accessibility",     icon: "access" },
  services:       { label: "Public Services",   icon: "building" },
};

const AREAS = [
  {
    id: "kalyanpur", name: "Kalyanpur", city: "Kanpur, Uttar Pradesh",
    score: 84, delta: 6,
    grid: { row: 1, col: 1 },
    categories: { roads:78, cleanliness:91, lighting:88, water:84, greenery:76, traffic:73, accessibility:81, services:86 },
    activeIssues: 3, resolvedThisMonth: 18, citizens: 183, impacted: "47K+",
    trend: [ ["May",69],["Jun",72],["Jul",75],["Aug",84] ],
    improvements: [
      "Main Road pothole repaired",
      "12 streetlights restored",
      "Market waste cleared",
      "Park cleanliness improved"
    ],
    alerts: [
      { tone:"blue", text:"Road maintenance scheduled tomorrow near Sector 3." }
    ],
    nearby: {
      Hospitals: ["Kalyanpur Community Hospital"],
      Schools: ["St. Xavier's Public School"],
      "Police Stations": ["Kalyanpur Police Chowki"],
      "Public Transport": ["Kalyanpur Bus Terminal"]
    }
  },
  {
    id: "civil-lines", name: "Civil Lines", city: "Kanpur, Uttar Pradesh",
    score: 91, delta: 4,
    grid: { row: 1, col: 2 },
    categories: { roads:89, cleanliness:94, lighting:92, water:90, greenery:88, traffic:85, accessibility:90, services:93 },
    activeIssues: 2, resolvedThisMonth: 21, citizens: 240, impacted: "52K+",
    trend: [ ["May",84],["Jun",86],["Jul",88],["Aug",91] ],
    improvements: [
      "Mall Road footpath resurfaced",
      "New pedestrian crossing signals installed",
      "Green cover added along the boulevard"
    ],
    alerts: [],
    nearby: {
      Hospitals: ["Regency Hospital"],
      Schools: ["St. Mary's Convent"],
      "Government Offices": ["District Collectorate"],
      "Public Transport": ["Civil Lines Metro Station"]
    }
  },
  {
    id: "swaroop-nagar", name: "Swaroop Nagar", city: "Kanpur, Uttar Pradesh",
    score: 82, delta: 3,
    grid: { row: 1, col: 3 },
    categories: { roads:80, cleanliness:85, lighting:83, water:81, greenery:79, traffic:76, accessibility:78, services:84 },
    activeIssues: 4, resolvedThisMonth: 15, citizens: 156, impacted: "38K+",
    trend: [ ["May",74],["Jun",77],["Jul",79],["Aug",82] ],
    improvements: [
      "Storm drain cleared before monsoon",
      "New LED streetlights on Kailash Vihar Road"
    ],
    alerts: [
      { tone:"orange", text:"Water supply disruption reported in Block C." }
    ],
    nearby: {
      Hospitals: ["Swaroop Nagar Diagnostic Centre"],
      Schools: ["Swaroop Nagar Inter College"],
      "Police Stations": ["Swaroop Nagar Thana"]
    }
  },
  {
    id: "shastri-nagar", name: "Shastri Nagar", city: "Kanpur, Uttar Pradesh",
    score: 79, delta: 9,
    grid: { row: 2, col: 1 },
    categories: { roads:74, cleanliness:80, lighting:77, water:79, greenery:70, traffic:71, accessibility:75, services:82 },
    activeIssues: 5, resolvedThisMonth: 22, citizens: 201, impacted: "41K+",
    trend: [ ["May",64],["Jun",69],["Jul",73],["Aug",79] ],
    improvements: [
      "Community park benches repaired",
      "8 streetlights restored on 80 Feet Road",
      "Weekly waste pickup restored to schedule"
    ],
    alerts: [],
    nearby: {
      Hospitals: ["Shastri Nagar Primary Health Centre"],
      Schools: ["Kendriya Vidyalaya Shastri Nagar"],
      "Public Transport": ["Shastri Nagar Bus Stand"]
    }
  },
  {
    id: "kakadeo", name: "Kakadeo", city: "Kanpur, Uttar Pradesh",
    score: 68, delta: 2,
    grid: { row: 2, col: 2 },
    categories: { roads:64, cleanliness:70, lighting:66, water:69, greenery:58, traffic:60, accessibility:64, services:71 },
    activeIssues: 8, resolvedThisMonth: 11, citizens: 134, impacted: "33K+",
    trend: [ ["May",63],["Jun",64],["Jul",66],["Aug",68] ],
    improvements: [
      "Market square drainage cleared"
    ],
    alerts: [
      { tone:"orange", text:"Waste collection delay reported near the market." }
    ],
    nearby: {
      Hospitals: ["Kakadeo Nursing Home"],
      Schools: ["Kakadeo Public School"],
      "Police Stations": ["Kakadeo Chowki"]
    }
  },
  {
    id: "govind-nagar", name: "Govind Nagar", city: "Kanpur, Uttar Pradesh",
    score: 61, delta: -1,
    grid: { row: 2, col: 3 },
    categories: { roads:55, cleanliness:62, lighting:57, water:63, greenery:50, traffic:54, accessibility:58, services:66 },
    activeIssues: 11, resolvedThisMonth: 9, citizens: 98, impacted: "29K+",
    trend: [ ["May",60],["Jun",59],["Jul",60],["Aug",61] ],
    improvements: [
      "Streetlight repair crew assigned to Block 4"
    ],
    alerts: [
      { tone:"red", text:"Water supply disruption reported across three blocks." },
      { tone:"orange", text:"Road maintenance backlog under review." }
    ],
    nearby: {
      Hospitals: ["Govind Nagar Government Dispensary"],
      Schools: ["Govind Nagar Inter College"],
      "Fire Stations": ["Govind Nagar Fire Post"]
    }
  }
];

// Kanpur-wide rollup (distinct from any single locality average — used on homepage)
const CITY = {
  name: "Kanpur",
  score: 78,
  delta: 5,
  activeIssues: 128,
  resolved: 94,
  citizens: 642,
};

const IMPACT_STATS = {
  citizensInvolved: 12482,
  issuesResolved: 8921,
  peopleImpacted: "47,200+",
  communityActions: 1248
};

let ISSUES = [
  {
    id: "JD-2026-4118", title: "Dangerous Pothole", category: "roads",
    area: "kalyanpur", location: "Main Road",
    confirms: 27, priority: 91, status: "verified", severity:"High",
    affected: "My Neighbourhood", description: "A deep pothole has formed near the Main Road junction, causing two-wheelers to swerve into oncoming traffic, especially after dark.",
    photo: "assets/issues/pothole.jpg", resolved:false,
    timeline: ["reported","verified","assigned"]
  },
  {
    id: "JD-2026-4021", title: "Waste Accumulation", category: "cleanliness",
    area: "kalyanpur", location: "Near School",
    confirms: 14, priority: 72, status: "reported", severity:"Moderate",
    affected: "My Street", description: "Garbage has been piling up near the school gate for the past week, past the scheduled collection day.",
    photo: "assets/issues/waste.jpg", resolved:false,
    timeline: ["reported"]
  },
  {
    id: "JD-2026-3987", title: "Streetlight Failure", category: "lighting",
    area: "kalyanpur", location: "Sector 4",
    confirms: 8, priority: 63, status: "assigned", severity:"Moderate",
    affected: "My Street", description: "Three consecutive streetlights on Sector 4 have been non-functional for over 10 days, making the stretch unsafe at night.",
    photo: "assets/issues/streetlight.jpeg", resolved:false,
    timeline: ["reported","verified","assigned"]
  },
  {
    id: "JD-2026-3820", title: "Cracked Footpath", category: "roads",
    area: "civil-lines", location: "Mall Road",
    confirms: 19, priority: 68, status: "verified", severity:"Moderate",
    affected: "My Neighbourhood", description: "A large section of the footpath outside the row of shops has cracked and shifted, becoming a trip hazard for pedestrians.",
    photo: "assets/issues/footpath.jpg", resolved:false,
    timeline: ["reported","verified"]
  },
  {
    id: "JD-2026-3701", title: "Overflowing Drain", category: "water",
    area: "swaroop-nagar", location: "Block C",
    confirms: 22, priority: 84, status: "assigned", severity:"High",
    affected: "Large Public Area", description: "A blocked storm drain has caused standing water and an unpleasant odour along Block C during the recent rains.",
    photo: "assets/issues/drain.jpg", resolved:false,
    timeline: ["reported","verified","assigned"]
  },
  {
    id: "JD-2026-3654", title: "Unsafe Pedestrian Crossing", category: "accessibility",
    area: "kakadeo", location: "Market Square",
    confirms: 16, priority: 70, status: "reported", severity:"High",
    affected: "Large Public Area", description: "There is no marked pedestrian crossing or signal near the market square despite heavy foot traffic and fast-moving vehicles.",
    photo: "assets/issues/crossing.jpg", resolved:false,
    timeline: ["reported"]
  },
  {
    id: "JD-2026-3502", title: "Fallen Tree Branch", category: "greenery",
    area: "govind-nagar", location: "Block 4",
    confirms: 6, priority: 55, status: "reported", severity:"Low",
    affected: "My Street", description: "A large branch came down during recent winds and is partially blocking the side lane.",
    photo: "assets/issues/tree.jpg", resolved:false,
    timeline: ["reported"]
  },
  {
    id: "JD-2026-3299", title: "Traffic Signal Malfunction", category: "traffic",
    area: "govind-nagar", location: "Main Crossing",
    confirms: 24, priority: 88, status: "assigned", severity:"Critical",
    affected: "Large Public Area", description: "The traffic signal at the main crossing has been stuck on red in all directions, causing congestion during peak hours.",
    photo: "assets/issues/signal.jpg", resolved:false,
    timeline: ["reported","verified","assigned"]
  },
  {
    id: "JD-2026-2988", title: "Broken Water Pipeline", category: "water",
    area: "shastri-nagar", location: "80 Feet Road",
    confirms: 31, priority: 79, status: "resolved", severity:"High",
    affected: "My Neighbourhood", description: "A ruptured pipeline was leaking freely onto the road, wasting water and softening the road surface.",
    photo: "assets/issues/pipeline.jpg", resolved:true, resolvedNote:"Municipal team replaced the damaged section within 6 days of verification.",
    timeline: ["reported","verified","assigned","progress","resolved"]
  },
  {
    id: "JD-2026-2754", title: "Park Cleanliness", category: "cleanliness",
    area: "shastri-nagar", location: "Community Park",
    confirms: 18, priority: 58, status: "resolved", severity:"Moderate",
    affected: "My Neighbourhood", description: "The community park had accumulated litter around the benches and children's play area.",
    photo: "assets/issues/park.jpg", resolved:true, resolvedNote:"Local sanitation crew cleared the park and restored a weekly cleaning schedule.",
    timeline: ["reported","verified","assigned","progress","resolved"]
  },
];

const SUGGESTIONS = [
  { id:"s1", area:"kalyanpur", text:"Add a pedestrian crossing near the school on Main Road.", support: 43 },
  { id:"s2", area:"kakadeo", text:"Convert the unused plot behind the market into a community park.", support: 61 },
  { id:"s3", area:"govind-nagar", text:"Install solar streetlights along Block 4 to reduce outages.", support: 37 },
];

const POLLS = {
  kalyanpur: { question:"What should improve first in Kalyanpur?", options:[["Roads",52],["Greenery",28],["Waste",20]] }
};

const LEADERBOARD = [...AREAS].sort((a,b)=>b.score-a.score);
const MOST_IMPROVED = [...AREAS].sort((a,b)=>b.delta-a.delta).slice(0,3);

function scoreTone(score){
  if(score>=75) return "green";
  if(score>=55) return "orange";
  return "red";
}
function toneHex(tone){
  return tone==="green" ? getCss('--green') : tone==="orange" ? getCss('--orange') : getCss('--red');
}
function getCss(varName){
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}
function findArea(id){ return AREAS.find(a=>a.id===id); }
function findIssue(id){ return ISSUES.find(i=>i.id===id); }
function issuesForArea(id){ return ISSUES.filter(i=>i.area===id); }
