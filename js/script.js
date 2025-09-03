/* =========================
   Pokédex — JS ÚNICO
   (Oculta el grid y muestra el detalle al hacer click)
   ========================= */

/* ====== Rutas de imágenes (Pokemapi) ====== */
const BASE_NORMAL     = "https://pokemongo-get.com/wp-content/themes/simplicity2-child/images/pokemongo";
const BASE_SHINY      = "https://pokemongo-get.com/wp-content/themes/simplicity2-child/images/pokemongo_shiny";
const BASE_MEGA       = "https://pokemongo-get.com/wp-content/themes/simplicity2-child/images/pokemongo_form/3d";
const BASE_MEGA_SHINY = "https://pokemongo-get.com/wp-content/themes/simplicity2-child/images/pokemongo_form/shiny";

/* ====== Variantes especiales (mega/gigamax/primal) ====== */
const FORM_VARIANTS = {
  /* Kanto */
  3:[{suffix:"mega",display:"Mega Venusaur"},{suffix:"gigamax",display:"Gigamax Venusaur"}],
  6:[{suffix:"mega-x",display:"Mega Charizard X"},{suffix:"mega-y",display:"Mega Charizard Y"},{suffix:"gigamax",display:"Gigamax Charizard"}],
  9:[{suffix:"mega",display:"Mega Blastoise"},{suffix:"gigamax",display:"Gigamax Blastoise"}],
  12:[{suffix:"gigamax",display:"Gigamax Butterfree"}],
  15:[{suffix:"mega",display:"Mega Beedrill"}],
  18:[{suffix:"mega",display:"Mega Pidgeot"}],
  25:[{suffix:"gigamax",display:"Gigamax Pikachu"}],
  52:[{suffix:"gigamax",display:"Gigamax Meowth"}],
  65:[{suffix:"mega",display:"Mega Alakazam"}],
  68:[{suffix:"gigamax",display:"Gigamax Machamp"}],
  80:[{suffix:"mega",display:"Mega Slowbro"}],
  94:[{suffix:"mega",display:"Mega Gengar"},{suffix:"gigamax",display:"Gigamax Gengar"}],
  99:[{suffix:"gigamax",display:"Gigamax Kingler"}],
  115:[{suffix:"mega",display:"Mega Kangaskhan"}],
  127:[{suffix:"mega",display:"Mega Pinsir"}],
  130:[{suffix:"mega",display:"Mega Gyarados"}],
  131:[{suffix:"gigamax",display:"Gigamax Lapras"}],
  133:[{suffix:"gigamax",display:"Gigamax Eevee"}],
  142:[{suffix:"mega",display:"Mega Aerodactyl"}],
  143:[{suffix:"gigamax",display:"Gigamax Snorlax"}],
  150:[{suffix:"mega-x",display:"Mega Mewtwo X"},{suffix:"mega-y",display:"Mega Mewtwo Y"}],
  /* Johto */
  181:[{suffix:"mega",display:"Mega Ampharos"}],
  208:[{suffix:"mega",display:"Mega Steelix"}],
  212:[{suffix:"mega",display:"Mega Scizor"}],
  214:[{suffix:"mega",display:"Mega Heracross"}],
  229:[{suffix:"mega",display:"Mega Houndoom"}],
  248:[{suffix:"mega",display:"Mega Tyranitar"}],
  /* Hoenn */
  254:[{suffix:"mega",display:"Mega Sceptile"}],
  257:[{suffix:"mega",display:"Mega Blaziken"}],
  260:[{suffix:"mega",display:"Mega Swampert"}],
  282:[{suffix:"mega",display:"Mega Gardevoir"}],
  302:[{suffix:"mega",display:"Mega Sableye"}],
  303:[{suffix:"mega",display:"Mega Mawile"}],
  306:[{suffix:"mega",display:"Mega Aggron"}],
  308:[{suffix:"mega",display:"Mega Medicham"}],
  310:[{suffix:"mega",display:"Mega Manectric"}],
  319:[{suffix:"mega",display:"Mega Sharpedo"}],
  323:[{suffix:"mega",display:"Mega Camerupt"}],
  334:[{suffix:"mega",display:"Mega Altaria"}],
  354:[{suffix:"mega",display:"Mega Banette"}],
  359:[{suffix:"mega",display:"Mega Absol"}],
  362:[{suffix:"mega",display:"Mega Glalie"}],
  373:[{suffix:"mega",display:"Mega Salamence"}],
  376:[{suffix:"mega",display:"Mega Metagross"}],
  /* Sinnoh */
  428:[{suffix:"mega",display:"Mega Lopunny"}],
  445:[{suffix:"mega",display:"Mega Garchomp"}],
  448:[{suffix:"mega",display:"Mega Lucario"}],
  460:[{suffix:"mega",display:"Mega Abomasnow"}],
  475:[{suffix:"mega",display:"Mega Gallade"}],
  /* Unova */
  531:[{suffix:"mega",display:"Mega Audino"}],
  /* Kalos */
  719:[{suffix:"mega",display:"Mega Diancie"}],
  /* Primal / Rayquaza */
  382:[{suffix:"primal",display:"Primal Kyogre"}],
  383:[{suffix:"primal",display:"Primal Groudon"}],
  384:[{suffix:"mega",display:"Mega Rayquaza"}],
  /* Gigamax */
  569:[{suffix:"gigamax",display:"Gigamax Garbodor"}],
  809:[{suffix:"gigamax",display:"Gigamax Melmetal"}],
  812:[{suffix:"gigamax",display:"Gigamax Rillaboom"}],
  815:[{suffix:"gigamax",display:"Gigamax Cinderace"}],
  818:[{suffix:"gigamax",display:"Gigamax Inteleon"}],
  823:[{suffix:"gigamax",display:"Gigamax Corviknight"}],
  826:[{suffix:"gigamax",display:"Gigamax Orbeetle"}],
  834:[{suffix:"gigamax",display:"Gigamax Drednaw"}],
  839:[{suffix:"gigamax",display:"Gigamax Coalossal"}],
  841:[{suffix:"gigamax",display:"Gigamax Flapple"}],
  844:[{suffix:"gigamax",display:"Gigamax Sandaconda"}],
  849:[{suffix:"gigamax",display:"Gigamax Toxtricity"}],
  851:[{suffix:"gigamax",display:"Gigamax Centiskorch"}],
  858:[{suffix:"gigamax",display:"Gigamax Hatterene"}],
  861:[{suffix:"gigamax",display:"Gigamax Grimmsnarl"}],
  869:[{suffix:"gigamax",display:"Gigamax Alcremie"}],
  879:[{suffix:"gigamax",display:"Gigamax Copperajah"}],
  884:[{suffix:"gigamax",display:"Gigamax Duraludon"}],
  892:[
    {suffix:"gigamax-single",display:"Gigamax Urshifu (Estilo Único)"},
    {suffix:"gigamax-rapid", display:"Gigamax Urshifu (Estilo Rápido)"}
  ]
};

/* ====== DOM refs ====== */
const grid        = document.getElementById('grid');
const empty       = document.getElementById('empty');
const controls    = document.querySelector('.controls');

const q           = document.getElementById('q');
const limitSel    = document.getElementById('limit');
const reloadBtn   = document.getElementById('reload');
const formSel     = document.getElementById('formFilter');
const aspectSel   = document.getElementById('aspectFilter');

/* Detalle */
const detailView    = document.getElementById('detailView');
const backBtn       = document.getElementById('backBtn');
const detailTitle   = document.getElementById('detailTitle');
const detailImgWrap = document.getElementById('detailImgWrap');
const detailSprite  = document.getElementById('detailSprite');
const detailTypes   = document.getElementById('detailTypes');
const detailMeta    = document.getElementById('detailMeta');
const detailStats   = document.getElementById('detailStats');
const detailCP      = document.getElementById('detailCP');

/* ====== Estado ====== */
let all = [];
let statsMap = new Map();       // POGO base stats por id
window.statsMap = statsMap;     // (opcional) accesible global

/* ====== Helpers UI ====== */
function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function normalizeTerm(t){return t.trim().toLowerCase().replace(/^#/, '');}
function typePill(t){const el=document.createElement('span');el.className='pill';el.textContent=t;return el;}
function statRow(name,value){const row=document.createElement('div');row.className='statrow';const l=document.createElement('div');l.textContent=name;const v=document.createElement('div');const bar=document.createElement('div');bar.className='bar';const i=document.createElement('i');i.style.width=Math.min(100,(value/255)*100)+'%';bar.appendChild(i);v.appendChild(bar);row.appendChild(l);row.appendChild(v);return row;}

/* ====== LazyLoad (IntersectionObserver) ====== */
function lazyLoad(img, url) {
  if (!url) return;
  if (!('IntersectionObserver' in window)) { img.src = url; return; }
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) {
        img.src = url;
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '200px' });
  io.observe(img);
}

/* ====== Sprites (Pokemapi) ====== */
function gigamaxSuffix(id, form){
  if (form === 'gigamax-single') return '-1';
  if (form === 'gigamax-rapid')  return '-2';
  const megaForms = (FORM_VARIANTS[id] || []).filter(f => f.suffix.startsWith('mega'));
  return '-' + (megaForms.length + 1);
}
function imageCandidates(id, form){
  const isShiny = form.includes('shiny');
  if (form === 'normal') return [`${BASE_NORMAL}/${id}-1.png`];
  if (form === 'shiny')  return [`${BASE_SHINY}/${id}-1.png`, `${BASE_SHINY}/${id}-2.png`];
  if (form.startsWith('mega')){
    const idx = form.includes('mega-y') ? '-2' : '-1';
    return [ isShiny ? `${BASE_MEGA_SHINY}/${id}${idx}.png` : `${BASE_MEGA}/${id}${idx}.png` ];
  }
  if (form.startsWith('gigamax')){
    const suf = gigamaxSuffix(id, form);
    return [ isShiny ? `${BASE_MEGA_SHINY}/${id}${suf}.png` : `${BASE_MEGA}/${id}${suf}.png` ];
  }
  if (form.startsWith('primal')){
    return [ isShiny ? `${BASE_MEGA_SHINY}/${id}-1.png` : `${BASE_MEGA}/${id}-1.png` ];
  }
  return [];
}
function resolveSpriteURL(id, form){
  return new Promise((resolve)=>{
    const list = imageCandidates(id, form);
    let i=0;
    const tryNext=()=>{
      if(i>=list.length){ resolve(""); return; }
      const url=list[i++];
      const img=new Image();
      img.onload=()=>resolve(url);
      img.onerror=tryNext;
      img.src=url;
    };
    tryNext();
  });
}

/* ====== Data (PokeAPI) ====== */
async function fetchList(limit){
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`);
  const data = await res.json();

  const base = data.results.map(x=>{
    const id = Number(x.url.match(/\/pokemon\/(\d+)\//)[1]);
    return { id, name:x.name, displayName:capitalize(x.name), form:"normal" };
  });

  const all = [];
  for (const p of base){
    // Base normal + shiny
    all.push(p);
    all.push({ ...p, idVirtual: `${p.id}-s`, displayName: `${p.displayName} Shiny`, form:"shiny" });

    // Variantes y sus shiny
    const variants = FORM_VARIANTS[p.id] || [];
    variants.forEach((v, i) => {
      all.push({ ...p, idVirtual: `${p.id}-v${i+1}`,   displayName: v.display,            form: v.suffix });
      all.push({ ...p, idVirtual: `${p.id}-v${i+1}s`, displayName: `${v.display} Shiny`, form: `${v.suffix}-shiny` });
    });
  }
  return all;
}

async function fetchOne(id){
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const p = await res.json();
  return {
    id:p.id,
    displayName:capitalize(p.name),
    height:p.height,
    weight:p.weight,
    types:p.types.map(t=>t.type.name),
    stats:p.stats.map(s=>({name:s.stat.name,base:s.base_stat}))
  };
}

/* ====== CP Máx L20 (POGO) ====== */
const POGO_STATS_URL = 'https://pogoapi.net/api/v1/pokemon_stats.json';
const CPM_LEVEL_20 = 0.5974;
function computeCPMaxLevel20(a,d,s){
  const atk=a+15, def=d+15, sta=s+15;
  return Math.floor(((atk)*Math.sqrt(def)*Math.sqrt(sta)*(CPM_LEVEL_20**2))/10);
}
async function getStatsMap(){
  try{
    const res=await fetch(POGO_STATS_URL,{cache:'no-store'});
    if(!res.ok) return new Map();
    const rows=await res.json();
    return new Map(rows.map(r=>[+r.pokemon_id,{attack:+r.base_attack,defense:+r.base_defense,stamina:+r.base_stamina}]));
  }catch(e){
    return new Map();
  }
}

/* ====== Filtros ====== */
function isShinyForm(form){ return form.includes('shiny'); }
function isFormKind(p, kind){
  if(kind==='all') return true;
  if(kind==='normal')  return p.form==='normal' || p.form==='shiny';
  return p.form.startsWith(kind); // mega | gigamax | primal
}

/* ====== Cards ====== */
function buildCard(p){
  const card=document.createElement('div');
  card.className='card';
  card.setAttribute('data-id', String(p.id));

  const imgWrap=document.createElement('div');
  if(p.form.includes("shiny")) imgWrap.classList.add('shiny-wrapper');

  const img=document.createElement('img');
  img.className='sprite';
  img.alt=p.displayName;
  img.loading='lazy';

  resolveSpriteURL(p.id,p.form).then(url => lazyLoad(img, url));
  imgWrap.appendChild(img);
  card.appendChild(imgWrap);

  const dex=document.createElement('div');dex.className='dex';dex.textContent='#'+String(p.id).padStart(4,'0');
  const name=document.createElement('div');name.className='name';name.textContent=p.displayName;
  card.appendChild(dex); card.appendChild(name);

  // CP Máx en la card (si ya tenemos stats)
  const st = statsMap.get(p.id);
  if (st){
    const pcp=document.createElement('p');
    pcp.className='cp-max-100-l20';
    pcp.style.margin='0 0 6px';
    pcp.style.fontSize='13px';
    pcp.style.fontWeight='700';
    pcp.style.textAlign='center';
    pcp.textContent = 'Máx PC ' + computeCPMaxLevel20(st.attack, st.defense, st.stamina);
    card.insertBefore(pcp, card.firstChild);
  }

  // Click -> abrir detalle y ocultar todo el grid
  card.addEventListener('click', ()=>{
    openDetail({ id:p.id, form:p.form });
  });

  return card;
}

/* Anotar CP en cards ya renderizadas cuando llega statsMap */
function annotateCardsCP(){
  if (!statsMap.size) return;
  grid.querySelectorAll('.card').forEach(card=>{
    if (card.querySelector('.cp-max-100-l20')) return;
    const dexEl = card.querySelector('.dex');
    const m = dexEl?.textContent.match(/#0*(\d+)/);
    const id = m ? +m[1] : null;
    if (!id) return;
    const st = statsMap.get(id); if(!st) return;
    const pcp=document.createElement('p');
    pcp.className='cp-max-100-l20';
    pcp.style.margin='0 0 6px';
    pcp.style.fontSize='13px';
    pcp.style.fontWeight='700';
    pcp.style.textAlign='center';
    pcp.textContent = 'Máx PC ' + computeCPMaxLevel20(st.attack, st.defense, st.stamina);
    card.insertBefore(pcp, card.firstChild);
  });
}

/* ====== Render ====== */
function render(list){
  grid.innerHTML='';
  if(!list.length){ empty.hidden=false; return; }
  empty.hidden=true;
  const frag=document.createDocumentFragment();
  for(const p of list){ frag.appendChild(buildCard(p)); }
  grid.appendChild(frag);
  // Si ya tenemos stats, anotar CP
  annotateCardsCP();
}

function applyFilter(){
  const term        = normalizeTerm(q.value || '');
  const kind        = formSel.value;   // all/normal/mega/gigamax/primal
  const aspect      = aspectSel.value; // normal/shiny

  const filtered = all.filter(p=>{
    if(!isFormKind(p, kind)) return false;
    const shiny = isShinyForm(p.form);
    if(aspect==='normal' && shiny) return false;
    if(aspect==='shiny'  && !shiny) return false;

    const matchesText =
      !term ||
      String(p.id)===term ||
      (p.idVirtual && String(p.idVirtual).toLowerCase()===term) ||
      p.displayName.toLowerCase().includes(term) ||
      p.form.toLowerCase().includes(term);

    return matchesText;
  });

  render(filtered);
}

/* ====== Vista de Detalle (pantalla completa dentro de la misma página) ====== */
async function openDetail({ id, form='normal' }){
  // Ocultar listado + controles, mostrar detalle
  grid.hidden = true;
  empty.hidden = true;
  if (controls) controls.hidden = true;
  detailView.hidden = false;
  document.body.classList.add('detail-mode'); // si tu CSS la usa para ocultar header

  // Actualizar URL (para soportar Atrás)
  const params = new URLSearchParams({ pokemon:String(id), form });
  history.pushState({ view:'detail', id, form }, '', `?${params.toString()}`);

  // Limpiar detalle
  detailTitle.textContent = 'Cargando…';
  detailSprite.removeAttribute('src');
  detailImgWrap.classList.toggle('shiny-wrapper', form.includes('shiny'));
  detailTypes.innerHTML = '';
  detailMeta.textContent = '';
  detailStats.innerHTML = '';
  detailCP.textContent = '';

  // Datos + sprite
  const data = await fetchOne(id);
  detailTitle.textContent = data.displayName;

  resolveSpriteURL(id, form).then(url => lazyLoad(detailSprite, url));
  data.types.forEach(t => detailTypes.appendChild(typePill(t)));
  detailMeta.textContent = `Altura: ${data.height/10} m · Peso: ${data.weight/10} kg`;
  data.stats.forEach(s => detailStats.appendChild(statRow(s.name, s.base)));

  // CP Máx L20 si hay stats
  const st = statsMap.get(id);
  if (st){
    const cp = computeCPMaxLevel20(st.attack, st.defense, st.stamina);
    detailCP.textContent = 'Máx PC ' + cp;
  }
}

function showList(){
  // Mostrar listado y controles; ocultar detalle
  detailView.hidden = true;
  grid.hidden = false;
  if (controls) controls.hidden = false;
  document.body.classList.remove('detail-mode');

  // Limpiar parámetros de la URL
  if (location.search.includes('pokemon=')) {
    history.pushState({ view:'list' }, '', location.pathname);
  }
}

/* ====== Router (URL) ====== */
function routeFromURL(){
  const params = new URLSearchParams(location.search);
  const pid = params.get('pokemon');
  const form = params.get('form') || 'normal';
  if (pid && /^\d+$/.test(pid)) {
    openDetail({ id:+pid, form });
  } else {
    showList();
  }
}
window.addEventListener('popstate', routeFromURL);

/* ====== Boot ====== */
async function boot(){
  grid.innerHTML = '<p class="empty">Cargando…</p>';
  const [list, smap] = await Promise.all([
    fetchList(Number(limitSel.value)),
    getStatsMap()
  ]);
  all = list;
  statsMap = smap;
  window.statsMap = statsMap; // actualizar global

  // Si la URL ya pide un detalle, abrirlo; si no, listar y aplicar filtros
  if (location.search.includes('pokemon=')) {
    routeFromURL();
  } else {
    applyFilter(); // render inicial con filtros actuales (búsqueda, formas, aspecto)
  }
}

/* ====== Eventos ====== */
q.addEventListener('input', applyFilter);
formSel.addEventListener('change', applyFilter);
aspectSel.addEventListener('change', applyFilter);
reloadBtn.addEventListener('click', boot);
limitSel.addEventListener('change', boot);
if (backBtn) backBtn.addEventListener('click', ()=>{
  // Si venimos de pushState de detalle, usar back; si no, solo mostrar lista
  if (history.state && history.state.view === 'detail') history.back();
  else showList();
});

/* Start */
boot();

//v1.3