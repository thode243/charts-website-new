/* dashboard.js */
const DATA = {
  sticky: [
    "656959693","562066817","111169045","2120533255","422483868","929446995"
  ],
  tabs: [
    {id:"oi-ccoi-lvd", name:"OI-CCOI-LVD", type:"strike", strikes: {
      25400:"319939010",25450:"2064959247",25500:"1169910435",25550:"1540248194",
      25600:"1130691669",25650:"1302705504",25700:"983537328",25750:"1180687704",
      25800:"857353960",25850:"1083404014",25900:"1202010075",25950:"894341899",
      26000:"472808175",26050:"1233756397",26100:"1541263372",26150:"1973965389",
      26200:"606099251",26250:"1224804094",26300:"11506296",26350:"101266446",
      26400:"1712698988",26450:"669780284",26500:"795026390"
    }},
    {id:"oi-amount", name:"OI-Amount", type:"grid", oids:[
      "78463756","1355325851","134367014","1355325851","58612295","768675277","1503965889"
    ]},
    {id:"data", name:"Data", type:"sheets", urls:[
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQwdBNIekjQua_YjtFzp4hCVs7XUHN4UilhgNG_wZy2w-gfFZUds2hr7lyqqrctXDQxtk9wKp3gRz_-/pubhtml?gid=1970058116&single=true",
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5Lvrxvflj_qRKt-eVIUlr3yltRJQgISwea-qRRDoI5tXMT3TFXiwy0pukbs6wjOfS1K_C9zNxtUra/pubhtml?gid=1970058116&single=true",
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGTwCzWLbbrZUWbAa0GbozgvHlvTD8oWeau15M9NepwzLRtGADrnb2KENAKLr057_rEacH0mExLJgp/pubhtml?gid=538734573&single=true"
    ]},
    {id:"lvd-data", name:"LVD Data", type:"sheets", urls:[
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQwdBNIekjQua_YjtFzp4hCVs7XUHN4UilhgNG_wZy2w-gfFZUds2hr7lyqqrctXDQxtk9wKp3gRz_-/pubhtml?gid=1952424351&single=true",
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQwdBNIekjQua_YjtFzp4hCVs7XUHN4UilhgNG_wZy2w-gfFZUds2hr7lyqqrctXDQxtk9wKp3gRz_-/pubhtml?gid=648250347&single=true",
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5Lvrxvflj_qRKt-eVIUlr3yltRJQgISwea-qRRDoI5tXMT3TFXiwy0pukbs6wjOfS1K_C9zNxtUra/pubhtml?gid=263796819&single=true",
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5Lvrxvflj_qRKt-eVIUlr3yltRJQgISwea-qRRDoI5tXMT3TFXiwy0pukbs6wjOfS1K_C9zNxtUra/pubhtml?gid=1094925548&single=true"
    ]},
    {id:"stocks", name:"Stocks", type:"sheets", urls:[
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSA5vQhFswmLtmvKkdQejxkj8uQIrAuIqTxruTjeetb9xVr5uRMNKm--Gux9TryBUQbJBtZ1LBWyYAF/pubhtml?gid=1037771693&single=true&widget=true&headers=false",
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSA5vQhFswmLtmvKkdQejxkj8uQIrAuIqTxruTjeetb9xVr5uRMNKm--Gux9TryBUQbJBtZ1LBWyYAF/pubhtml?gid=1491273881&single=true"
    ]},
    {id:"sticky-charts", name:"Sticky Charts", type:"grid", oids:[
      "111169045","2120533255","422483868","929446995","1218241067","1171857034"
    ]}
  ]
};

const BASE_CHART = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQwdBNIekjQua_YjtFzp4hCVs7XUHN4UilhgNG_wZy2w-gfFZUds2hr7lyqqrctXDQxtk9wKp3gRz_-/pubchart?format=interactive&oid=";

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));
  children.forEach(c=> e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
}

/* Render Sticky */
function renderSticky() {
  const container = document.getElementById('stickyCharts');
  DATA.sticky.forEach(oid => {
    container.appendChild(el('iframe', {src: BASE_CHART+oid, loading:'lazy'}));
  });
}

/* Build Nav */
function buildNav() {
  const nav = document.getElementById('tabNav');
  DATA.tabs.forEach((t,i) => {
    const btn = el('button', {class:'tab-btn', 'data-id':t.id}, t.name);
    btn.onclick = () => openTab(t.id);
    if (i===0) btn.classList.add('active');
    nav.appendChild(btn);
  });
}

/* Open Tab */
function openTab(id) {
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.tab-btn[data-id="${id}"]`).classList.add('active');

  // WRAPPER TO PREVENT SCROLL & MANAGE CONTENT
  let wrapper = document.getElementById('tabContentWrapper');
  if (!wrapper) {
    wrapper = el('div', {id:'tabContentWrapper'});
    document.getElementById('tabContent').appendChild(wrapper);
  }
  wrapper.innerHTML = '';

  const tab = DATA.tabs.find(t=>t.id===id);
  if (!tab) return;

  // Legend (if applicable)
  if (tab.id.includes('oi-ccoi') || tab.id.includes('lvd-amount')) {
    wrapper.appendChild(createLegend());
  }

  // Controls for strike tabs
  if (tab.type === 'strike') {
    const ctrl = el('div', {class:'controls'});
    const selAll = el('button', {}, 'Select All');
    const desAll = el('button', {}, 'Deselect All');
    selAll.onclick = () => toggleAllStrikes(id, true);
    desAll.onclick = () => toggleAllStrikes(id, false);
    ctrl.append(selAll, desAll);
    wrapper.appendChild(ctrl);
  }

  // Render tab body
  if (tab.type === 'grid') {
    const grid = el('div', {class:'chart-grid'});
    tab.oids.forEach(oid => grid.appendChild(createChartCard(oid)));
    wrapper.appendChild(grid);
  }
  else if (tab.type === 'strike') {
    const strikes = tab.strikes;
    const grid = el('div', {class:'chart-grid'});
    const checkDiv = el('div', {class:'checkboxes'});
    Object.entries(strikes).forEach(([strike, oid]) => {
      const label = el('label');
      const cb = el('input', {type:'checkbox', id:`cb-${id}-${strike}`, checked:true});
      cb.onchange = () => toggleStrike(id, strike);
      label.append(cb, ` ${strike}`);
      checkDiv.appendChild(label);

      const card = createChartCard(oid, `Strike ${strike}`);
      card.id = `card-${id}-${strike}`;
      grid.appendChild(card);
    });
    wrapper.appendChild(checkDiv);
    wrapper.appendChild(grid);
  }
  else if (tab.type === 'sheets') {
    const grid = el('div', {style:'display:grid; gap:1rem; grid-template-columns:repeat(auto-fit, minmax(500px,1fr));'});
    tab.urls.forEach(url => {
      grid.appendChild(el('iframe', {src:url, class:'oi-amount-frame'}));
    });
    wrapper.appendChild(grid);
  }
}

/* Chart Card */
function createChartCard(oid, title = '') {
  const card = el('div', {class:'chart-card'});
  if (title) {
    card.appendChild(el('h3', {}, title));
  }
  card.appendChild(el('iframe', {src: BASE_CHART+oid, loading:'lazy'}));
  return card;
}

/* Legend */
function createLegend() {
  const legend = el('div', {class:'legend'});
  const items = [
    {cls:'solid-blue', txt:'Call OI'},
    {cls:'solid-red', txt:'Put OI'},
    {cls:'dotted-blue', txt:'Change OI – Call'},
    {cls:'dotted-red', txt:'Change OI – Put'},
    {cls:'light-green', txt:'CVD (Call)'},
    {cls:'light-red', txt:'PVD (Put)'}
  ];
  items.forEach(i=>{
    const box = el('span', {class:`legend-box ${i.cls}`});
    legend.appendChild(el('span', {}, box, i.txt));
  });
  return legend;
}

/* Strike Toggles */
function toggleStrike(tabId, strike) {
  const cb = document.getElementById(`cb-${tabId}-${strike}`);
  const card = document.getElementById(`card-${tabId}-${strike}`);
  if (card) {
    card.style.display = cb.checked ? '' : 'none';
  }
}
function toggleAllStrikes(tabId, state) {
  document.querySelectorAll(`input[id^="cb-${tabId}-"]`).forEach(cb=>{
    cb.checked = state;
    const strike = cb.id.split('-').pop();
    toggleStrike(tabId, strike);
  });
}

/* Refresh Logic */
let refreshTimer;
function startRefresh(ms) {
  clearInterval(refreshTimer);
  if (ms>0) refreshTimer = setInterval(refreshAll, ms);
}
function refreshAll() {
  if (!isMarketOpen()) return;
  document.querySelectorAll('iframe').forEach(f=>f.src = f.src);
  updateTime();
}
function isMarketOpen() {
  const d = new Date();
  const h = d.getHours(), m = d.getMinutes();
  return (h >= 9 && (h < 15 || (h===15 && m<=30)));
}
function updateTime() {
  const opts = {weekday:'short', year:'numeric', month:'short', day:'numeric',
                hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true};
  document.getElementById('lastUpdate').textContent = 
    `Last updated: ${new Date().toLocaleString('en-IN', opts)}`;
}

/* Init */
document.addEventListener('DOMContentLoaded', ()=>{
  renderSticky();
  buildNav();
  openTab(DATA.tabs[0].id);
  document.getElementById('refreshBtn').onclick = refreshAll;
  document.getElementById('autoRefresh').onchange = e=>startRefresh(+e.target.value);
  startRefresh(60000);
  updateTime();
});
