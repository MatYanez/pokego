


(() => {
  const POGO_STATS_URL = 'https://pogoapi.net/api/v1/pokemon_stats.json';
  const CPM_LEVEL_20 = 0.5974; // nivel 20
  const CP_LABEL = 'Máx PC ';

  function getPokemonIdFromCard(cardEl) {
    const dataId = cardEl.getAttribute('data-id');
    if (dataId && /^\d+$/.test(dataId)) return parseInt(dataId, 10);
    const dexEl = cardEl.querySelector('.dex');
    if (dexEl) {
      const m = dexEl.textContent.match(/#0*(\d+)/);
      if (m) return parseInt(m[1], 10);
    }
    return null;
  }

  function computeCPMaxLevel20(baseAtk, baseDef, baseSta) {
    const atk = baseAtk + 15;
    const def = baseDef + 15;
    const sta = baseSta + 15;
    const cp = Math.floor(((atk) * Math.sqrt(def) * Math.sqrt(sta) * (CPM_LEVEL_20 ** 2)) / 10);
    return cp;
  }

  function upsertCPParagraph(cardEl, cpValue) {
    let p = cardEl.querySelector('.cp-max-100-l20');
    if (!p) {
      p = document.createElement('p');
      p.className = 'cp-max-100-l20';
      p.style.color = '#ff6f00';
      p.style.fontWeight = '700';
      p.style.margin = '0 0 6px';
      p.style.fontSize = '13px';
      p.style.textAlign = 'center';
      cardEl.insertBefore(p, cardEl.firstChild);
    }
    p.textContent = CP_LABEL + cpValue;
  }

  function annotateAllCards(statsById, root=document){
    const cards = root.querySelectorAll('.card');
    cards.forEach(card => {
      const pid = getPokemonIdFromCard(card);
      if (!pid) return;
      const stats = statsById.get(pid);
      if (!stats) return;
      const cp = computeCPMaxLevel20(stats.attack, stats.defense, stats.stamina);
      upsertCPParagraph(card, cp);
    });
  }

  async function fetchPoGoStats() {
    const res = await fetch(POGO_STATS_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo obtener pokemon_stats.json de PoGoAPI.net');
    return res.json();
  }

  function buildStatsMap(rows) {
    const map = new Map();
    for (const r of rows) {
      const id = Number(r.pokemon_id);
      if (!Number.isFinite(id)) continue;
      const attack  = Number(r.base_attack);
      const defense = Number(r.base_defense);
      const stamina = Number(r.base_stamina);
      if ([attack, defense, stamina].some(v => !Number.isFinite(v))) continue;
      map.set(id, { attack, defense, stamina });
    }
    return map;
  }

  async function run() {
    try {
      const rows = await fetchPoGoStats();
      const statsById = buildStatsMap(rows);
      // 1) Anotar lo que ya haya
      annotateAllCards(statsById);
      // 2) Observar inserciones para anotar nuevas cards
      const grid = document.getElementById('grid');
      if (grid) {
        const mo = new MutationObserver(() => annotateAllCards(statsById, grid));
        mo.observe(grid, { childList: true, subtree: false });
      }
    } catch (err) {
      console.error('[Máx CP] Error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();








/* =================== RUTAS DE IMÁGENES (Pokemapi) =================== */
const BASE_NORMAL     = "https://pokemongo-get.com/wp-content/themes/simplicity2-child/images/pokemongo";
const BASE_SHINY      = "https://pokemongo-get.com/wp-content/themes/simplicity2-child/images/pokemongo_shiny";
const BASE_MEGA       = "https://pokemongo-get.com/wp-content/themes/simplicity2-child/images/pokemongo_form/3d";
const BASE_MEGA_SHINY = "https://pokemongo-get.com/wp-content/themes/simplicity2-child/images/pokemongo_form/shiny";

/* =================== VARIANTES A CLONAR =================== */
const FORM_VARIANTS = {
  /* --- Kanto --- */
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
  /* --- Johto --- */
  181:[{suffix:"mega",display:"Mega Ampharos"}],
  208:[{suffix:"mega",display:"Mega Steelix"}],
  212:[{suffix:"mega",display:"Mega Scizor"}],
  214:[{suffix:"mega",display:"Mega Heracross"}],
  229:[{suffix:"mega",display:"Mega Houndoom"}],
  248:[{suffix:"mega",display:"Mega Tyranitar"}],
  /* --- Hoenn --- */
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
  /* --- Sinnoh --- */
  428:[{suffix:"mega",display:"Mega Lopunny"}],
  445:[{suffix:"mega",display:"Mega Garchomp"}],
  448:[{suffix:"mega",display:"Mega Lucario"}],
  460:[{suffix:"mega",display:"Mega Abomasnow"}],
  475:[{suffix:"mega",display:"Mega Gallade"}],
  /* --- Unova --- */
  531:[{suffix:"mega",display:"Mega Audino"}],
  /* --- Kalos --- */
  719:[{suffix:"mega",display:"Mega Diancie"}],
  /* --- Primal / Rayquaza --- */
  382:[{suffix:"primal",display:"Primal Kyogre"}],
  383:[{suffix:"primal",display:"Primal Groudon"}],
  384:[{suffix:"mega",display:"Mega Rayquaza"}],
  /* --- Gigamax --- */
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

/* =================== SUFIJO GIGAMAX =================== */
function gigamaxSuffix(id, form){
  if (form === 'gigamax-single') return '-1';
  if (form === 'gigamax-rapid')  return '-2';
  const megaForms = (FORM_VARIANTS[id] || []).filter(f => f.suffix.startsWith('mega'));
  return '-' + (megaForms.length + 1);
}

/* =================== URLs de imagen (Pokemapi) =================== */
function imageCandidates(id, form){
  const isShiny = form.includes('shiny');

  // Base
  if (form === 'normal') return [`${BASE_NORMAL}/${id}-1.png`];

  // Base Shiny: probar -1 y luego -2
  if (form === 'shiny')  return [
    `${BASE_SHINY}/${id}-1.png`,
    `${BASE_SHINY}/${id}-2.png`
  ];

  // Megas (Y usa -2; el resto -1)
  if (form.startsWith('mega')){
    const idx = form.includes('mega-y') ? '-2' : '-1';
    return [ isShiny ? `${BASE_MEGA_SHINY}/${id}${idx}.png` : `${BASE_MEGA}/${id}${idx}.png` ];
  }

  // Gigamax (auto-sufijo)
  if (form.startsWith('gigamax')){
    const suf = gigamaxSuffix(id, form);
    return [ isShiny ? `${BASE_MEGA_SHINY}/${id}${suf}.png` : `${BASE_MEGA}/${id}${suf}.png` ];
  }

  // Primal (usamos -1)
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

/* =================== DATOS: PokeAPI =================== */
async function fetchList(limit){
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`);
  const data = await res.json();

  const base = data.results.map(x=>{
    const id = Number(x.url.match(/\/pokemon\/(\d+)\//)[1]);
    return { id, name:x.name, displayName:capitalize(x.name), form:"normal" };
  });

  const all = [];
  for (const p of base){
    // Base normal + base shiny
    all.push(p);
    all.push({ ...p, idVirtual: `${p.id}-s`, displayName: `${p.displayName} Shiny`, form:"shiny" });

    // Variantes (mega/gigamax/primal) + shiny
    const variants = FORM_VARIANTS[p.id] || [];
    variants.forEach((v, i) => {
      all.push({ ...p, idVirtual: `${p.id}-v${i+1}`,   displayName: v.display,              form: v.suffix });
      all.push({ ...p, idVirtual: `${p.id}-v${i+1}s`, displayName: `${v.display} Shiny`,   form: `${v.suffix}-shiny` });
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

/* =================== UI HELPERS =================== */
function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function typePill(t){const span=document.createElement('span');span.className='pill';span.textContent=t;return span;}
function statRow(name,value){const row=document.createElement('div');row.className='statrow';const l=document.createElement('div');l.textContent=name;const v=document.createElement('div');const bar=document.createElement('div');bar.className='bar';const i=document.createElement('i');i.style.width=Math.min(100,(value/255)*100)+'%';bar.appendChild(i);v.appendChild(bar);row.appendChild(l);row.appendChild(v);return row;}

/* =================== RENDER =================== */
async function buildCard(p){
  const div=document.createElement('div');div.className='card';div.setAttribute('data-id', String(p.id));

  const imgWrap=document.createElement('div');
  if(p.form.includes("shiny")) imgWrap.classList.add('shiny-wrapper');

  const img=document.createElement('img');
  img.className='sprite';
  img.alt=p.displayName;
  img.loading='lazy';
  // set src cuando resuelva
  resolveSpriteURL(p.id,p.form).then(url=>{ if(url) img.src=url; });

  imgWrap.appendChild(img);
  div.appendChild(imgWrap);

  const dex=document.createElement('div');dex.className='dex';dex.textContent='#'+String(p.id).padStart(4,'0');
  const name=document.createElement('div');name.className='name';name.textContent=p.displayName;
  div.appendChild(dex); div.appendChild(name);

  div.addEventListener('click',()=>openDetail(p));
  return div;
}

async function render(list){
  grid.innerHTML='';
  if(!list.length){empty.hidden=false;return;}
  empty.hidden=true;
  for(const p of list){grid.appendChild(await buildCard(p));}
}

async function openDetail(p){
  dlg.showModal();
  dlgTitle.textContent=p.displayName;
  dlgSprite.src=''; dlgTypes.innerHTML=''; dlgMeta.textContent=''; dlgStats.innerHTML='';

  const data=await fetchOne(p.id);

  const wrap=document.getElementById('dlgImgWrap');
  wrap.classList.toggle('shiny-wrapper', p.form.includes('shiny'));

  resolveSpriteURL(p.id,p.form).then(url=>{ if(url) dlgSprite.src=url; });
  data.types.forEach(t=>dlgTypes.appendChild(typePill(t)));
  dlgMeta.textContent=`Altura: ${data.height/10} m · Peso: ${data.weight/10} kg`;
  data.stats.forEach(s=>dlgStats.appendChild(statRow(s.name,s.base)));
}

/* =================== FILTROS =================== */
function isShinyForm(form){ return form.includes('shiny'); }
function isFormKind(p, kind){
  if(kind==='all') return true;
  if(kind==='normal')  return p.form==='normal' || p.form==='shiny';
  return p.form.startsWith(kind); // mega, gigamax, primal
}

function normalizeTerm(t){
  // permite "#25", "025", "25", "mega", etc.
  return t.trim().toLowerCase().replace(/^#/, '');
}

function applyFilter(){
  const termRaw     = q.value;
  const term        = normalizeTerm(termRaw);
  const formFilter  = formSel.value;   // all / normal / mega / gigamax / primal
  const aspect      = aspectSel.value; // normal / shiny

  const filtered = all.filter(p=>{
    // 1) tipo de forma
    if(!isFormKind(p, formFilter)) return false;

    // 2) aspecto
    const shiny = isShinyForm(p.form);
    if(aspect==='normal' && shiny) return false;
    if(aspect==='shiny'  && !shiny) return false;

    // 3) texto
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

/* =================== WIRING =================== */
const grid      = document.getElementById('grid');
const empty     = document.getElementById('empty');
const q         = document.getElementById('q');
const limitSel  = document.getElementById('limit');
const reloadBtn = document.getElementById('reload');
const dlg       = document.getElementById('dlg');
const dlgTitle  = document.getElementById('dlgTitle');
const dlgSprite = document.getElementById('dlgSprite');
const dlgTypes  = document.getElementById('dlgTypes');
const dlgMeta   = document.getElementById('dlgMeta');
const dlgStats  = document.getElementById('dlgStats');
const formSel   = document.getElementById('formFilter');
const aspectSel = document.getElementById('aspectFilter');

let all=[];

async function boot(){
  grid.innerHTML='<p class="empty">Cargando…</p>';
  all = await fetchList(Number(limitSel.value));
  applyFilter(); // render inicial con filtros actuales
}

q.addEventListener('input',applyFilter);
reloadBtn.addEventListener('click',boot);
limitSel.addEventListener('change',boot);
formSel.addEventListener('change',applyFilter);
aspectSel.addEventListener('change',applyFilter);

boot();
