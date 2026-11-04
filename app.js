const navIcons={"\u25eb": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"/>", "\u25a4": "<path d=\"M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7\"/>", "\u25a7": "<path d=\"M3 5h7l2 2h9v13H3zM7 12h10M7 16h7\"/>", "\u21c4": "<path d=\"M4 7h15l-4-4M20 17H5l4 4M20 7v4M4 17v-4\"/>"};
Object.assign(navIcons,{'♙':'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0112 0v3M16 4a3 3 0 010 6M18 14a5 5 0 013 5v2"/>','◷':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>','♲':'<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>','⚙':'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>'});

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let proposals=[],docs=[],texts={},page='Home',stage=0,section=0,settingTab='Profile';
const stages=['Overview','RFP & Documents','Requirements Review','Proposal Builder','Team & Experience','Commercial','Review & Export'];
const sections=['Cover Letter','Executive Summary','Project Understanding','Scope of Services','Methodology','Deliverables & Programme','Assumptions & Exclusions'];
const roleLabels={admin:'Admin',manager:'Manager',contributor:'Contributor',reviewer:'Reviewer',viewer:'Viewer'};
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',4000)}
function head(title,sub,action=''){return `<div class="heading"><div><div class="eyebrow">PROPELLA / ${page==='Workspace'?'PROPOSAL WORKSPACE':'WORKSPACE'}</div><h1>${title}</h1><p style="margin:0">${sub}</p></div>${action}</div>`}
function btn(t,fn,primary=false){return `<button class="${primary?'primary':''}" onclick="${fn}">${t}</button>`}
function filterStatus(v){$('#rows').innerHTML=rows();if(v!=='All statuses')Array.from($('#rows').children).forEach(r=>r.hidden=!r.textContent.includes(v))}
function aiContext(){const id=['rfp','rfp','check','draft','team',null,'review'][stage];if(!id)return '';const t=aiTasks.find(x=>x.id===id);return `<div class="ai-context"><div><b>✧ Propella AI</b><span>${t.desc}</span></div><button class="ai-outline" onclick="openAI('${id}')">${t.title} with AI →</button></div>`;}
function aiCards(){return `<div class="ai-task-grid">${aiTasks.map(t=>`<button class="ai-task" onclick="openAI('${t.id}')"><span class="ai-task-icon">✧</span><strong>${t.title}</strong><span>${t.desc}</span><small>Open action →</small></button>`).join('')}</div>`;}

const aiTasks=[
 {id:'rfp',title:'Analyze RFP',step:1,desc:'Extract scope, deliverables, deadlines and submission requirements.',input:'RFP documents and client addenda',output:'Requirements summary, source references and missing inputs'},
 {id:'draft',title:'Generate proposal section',step:3,desc:'Prepare the selected section using the brief and DGJ reference content.',input:'Reviewed requirements, DGJ template and selected section',output:'A proposed draft for your review'},
 {id:'rewrite',title:'Improve this section',step:3,desc:'Refine wording and clarity while preserving confirmed facts.',input:'Current section text and your revision request',output:'A suggested revision to compare before applying'},
 {id:'team',title:'Suggest team & experience',step:4,desc:'Identify potentially relevant profiles and evidence for the opportunity.',input:'RFP team criteria and available DGJ knowledge',output:'Suggested matches with sources and confirmation needs'},
 {id:'check',title:'Check RFP coverage',step:2,desc:'Compare the response against the client requirements.',input:'RFP requirements and current proposal content',output:'Coverage findings and outstanding actions'},
 {id:'review',title:'Review proposal with AI',step:6,desc:'Find inconsistencies, unsupported claims and unresolved placeholders.',input:'Current proposal sections and confirmed requirements',output:'A review checklist for the proposal team'}
];
