const GIMAGES = {};
let CUR_GK = null, CUR_FID = null, CUR_FNAME = null, CUR_ACC = '#1A6B52';

function getImage(key) {
  return GIMAGES[key] || STATIC_IMAGES[key] || null;
}

/* ─── GARMENT PANEL ─────────────────────────────────── */
function openGarmentPanel(gk, fid, fname, acc) {
  CUR_GK = gk; CUR_FID = fid; CUR_FNAME = fname; CUR_ACC = acc || '#1A6B52';
  const m = PRODUCTS_META[gk];
  const d = GD[gk];
  if (!m) return;

  document.getElementById('gp-crumb').innerHTML = `<strong>${fname}</strong> → ${m.name}`;
  const badge = document.getElementById('gp-badge');
  badge.innerHTML = `<svg viewBox="0 0 48 48" fill="none" stroke="${CUR_ACC}" stroke-width="1.6" style="width:14px;height:14px">${m.icon.replace(/<svg[^>]+>/, '').replace('</svg>', '')}</svg><span style="color:${CUR_ACC}">${m.name}</span>`;
  document.getElementById('gp-name').textContent = m.name;
  document.getElementById('gp-fabric').innerHTML = `Made in <span style="color:${CUR_ACC};font-weight:500">${fname}</span>`;

  const imgKey = `${gk}__${fid}`;
  const zone = document.getElementById('gp-imgzone');
  const photo = document.getElementById('gp-photo');
  const existingSrc = getImage(imgKey);
  if (existingSrc) { photo.src = existingSrc; zone.classList.add('filled'); }
  else { photo.src = ''; zone.classList.remove('filled'); }

  if (d) {
    document.getElementById('gp-specs').innerHTML = `
      <div class="gp-spec"><div class="gp-spec-lbl">MOQ</div><div class="gp-spec-val">${d.moq}</div></div>
      <div class="gp-spec"><div class="gp-spec-lbl">Lead Time</div><div class="gp-spec-val">${d.lt}</div></div>
      <div class="gp-spec"><div class="gp-spec-lbl">Sampling</div><div class="gp-spec-val">Free · 7 days</div></div>`;
    document.getElementById('gp-moq').textContent = d.moq;
    document.getElementById('gp-lt').textContent = d.lt;
    document.getElementById('gp-details').innerHTML = (d.d || []).map(row => `
      <div class="gp-detail-row">
        <div class="gp-dicon" style="color:${CUR_ACC}">${ICONS[row.i] || ''}</div>
        <div class="gp-dtext"><strong>${row.t}:</strong> ${row.b}</div>
      </div>`).join('');
    if (d.f && d.f.length) {
      document.getElementById('gp-finishes-wrap').style.display = '';
      document.getElementById('gp-finishes').innerHTML = d.f.map(x => `<span class="gp-chip">${x}</span>`).join('');
    } else {
      document.getElementById('gp-finishes-wrap').style.display = 'none';
    }
  }

  document.getElementById('garment-overlay').classList.add('open');
  document.getElementById('garment-panel').scrollTop = 0;
}

function closeGarmentPanel() { document.getElementById('garment-overlay').classList.remove('open'); }
function closeGarmentOvr(e) { if (e.target === document.getElementById('garment-overlay')) closeGarmentPanel(); }
function closeAllPanels() { closeGarmentPanel(); closeModalBtn(); document.body.style.overflow = ''; }

function triggerUpl(e) { if (e) e.stopPropagation(); document.getElementById('gp-upload').click(); }
function handleUpl(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const src = ev.target.result;
    const imgKey = `${CUR_GK}__${CUR_FID}`;
    GIMAGES[imgKey] = src;
    document.getElementById('gp-photo').src = src;
    document.getElementById('gp-imgzone').classList.add('filled');
    document.querySelectorAll('#modal-products .product-item').forEach(el => {
      const oc = el.getAttribute('onclick') || '';
      if (oc.includes("'" + CUR_GK + "'")) {
        el.classList.add('has-image');
        const t = el.querySelector('.product-thumb');
        if (t) t.src = src;
      }
    });
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

/* ─── RENDER CARDS ──────────────────────────────────── */
function buildFabricSVG(tex) {
  const colors = {
    'tex-jersey': '#1A6B52', 'tex-terry': '#0F4030', 'tex-fleece': '#E8E8E8', 'tex-rib': '#3A8A9A',
    'tex-interlock': '#C9993D', 'tex-pique': '#4A7A9B', 'tex-waffle': '#8A7A5A', 'tex-lycra': '#E8BE6A',
    'tex-twill': '#9A7040', 'tex-poplin': '#A08060', 'tex-canvas': '#7A6040', 'tex-denim': '#2A4870',
    'tex-oxford': '#8A7A5A', 'tex-ripstop': '#4A6640', 'tex-linen': '#A09060', 'tex-satin': '#C0A860',
    'tex-velvet': '#6A3A8A', 'tex-jacquard': '#C0A040', 'tex-microfiber': '#4A7A9A', 'tex-muslin': '#C0B090',
    'tex-felt': '#8A4A2A', 'tex-terry-home': '#4A8AA0',
  };
  const c = colors[tex] || '#1A6B52';
  return `<svg viewBox="0 0 48 48" fill="none" stroke="${c}" stroke-width="1.4"><path d="M8 12h32M8 20h32M8 28h32M8 36h32M12 8v32M20 8v32M28 8v32M36 8v32" opacity=".4"/><rect x="4" y="4" width="40" height="40" rx="4" stroke="${c}" stroke-width="1.8"/><circle cx="24" cy="24" r="6" fill="${c}" opacity=".15" stroke="${c}" stroke-width="1.5"/></svg>`;
}

function renderCards(data, gridId) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = '';
  data.forEach((f, i) => {
    const card = document.createElement('div');
    card.className = 'fabric-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${f.name} — click to see what you can make`);
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="card-visual ${f.tex}">${buildFabricSVG(f.tex)}
        <span class="card-badge ${f.badge}">${f.badgeText}</span>
      </div>
      <div class="card-body">
        <div class="card-gsm">${f.gsm}</div>
        <div class="card-name">${f.name}</div>
        <div class="card-desc">${f.desc.substring(0, 80)}…</div>
        <div class="card-products">
          ${f.products.slice(0, 4).map(p => `<span class="product-pill">${PRODUCTS_META[p]?.name || p}</span>`).join('')}
          ${f.products.length > 4 ? `<span class="product-pill">+${f.products.length - 4} more</span>` : ''}
        </div>
        <div class="card-cta">View all options
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M8 3l5 5-5 5"/></svg>
        </div>
      </div>`;
    card.addEventListener('click', () => openModal(f));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(f); } });
    grid.appendChild(card);
  });
}

/* ─── MODAL ─────────────────────────────────────────── */
function openModal(f) {
  const colors = {
    'tex-jersey': '#E1F5EE', 'tex-terry': '#D4EDE6', 'tex-fleece': '#2E2E2E', 'tex-rib': '#D4E8F0',
    'tex-interlock': '#F0E8D8', 'tex-pique': '#D8E8F0', 'tex-waffle': '#EAE0D0', 'tex-lycra': '#1A2A4A',
    'tex-twill': '#F0E0C0', 'tex-poplin': '#F5F0E8', 'tex-canvas': '#E8DCC0', 'tex-denim': '#CCDAEE',
    'tex-oxford': '#EAE0CC', 'tex-ripstop': '#D4E0CC', 'tex-linen': '#F0E8D0', 'tex-satin': '#FFF8E8',
    'tex-velvet': '#2A1A4A', 'tex-jacquard': '#F0E4B0', 'tex-microfiber': '#D0E4F4', 'tex-muslin': '#F5EFE5',
    'tex-felt': '#EAD0B8', 'tex-terry-home': '#D0E8F0',
  };
  const iconCol = {
    'tex-jersey': '#1A6B52', 'tex-terry': '#0F4030', 'tex-fleece': '#E8E8E8', 'tex-rib': '#2A7A9A',
    'tex-interlock': '#C9993D', 'tex-pique': '#2A6A9A', 'tex-waffle': '#7A6A4A', 'tex-lycra': '#E8BE6A',
    'tex-twill': '#7A5030', 'tex-poplin': '#8A6840', 'tex-canvas': '#6A5030', 'tex-denim': '#2A4870',
    'tex-oxford': '#7A6A4A', 'tex-ripstop': '#3A5630', 'tex-linen': '#8A7840', 'tex-satin': '#C0A040',
    'tex-velvet': '#D0A0FF', 'tex-jacquard': '#C0A040', 'tex-microfiber': '#3A6A8A', 'tex-muslin': '#A09060',
    'tex-felt': '#C09070', 'tex-terry-home': '#3A7A90',
  };
  const bg = colors[f.tex] || '#E1F5EE';
  const ic = iconCol[f.tex] || '#1A6B52';

  document.getElementById('modal-visual').innerHTML = `<svg viewBox="0 0 48 48" fill="none" stroke="${ic}" stroke-width="1.4"><path d="M8 12h32M8 20h32M8 28h32M8 36h32M12 8v32M20 8v32M28 8v32M36 8v32" opacity=".4"/><rect x="4" y="4" width="40" height="40" rx="4" stroke="${ic}" stroke-width="1.8"/><circle cx="24" cy="24" r="6" fill="${ic}" opacity=".2" stroke="${ic}" stroke-width="1.5"/></svg>`;
  document.getElementById('modal-visual').style.background = bg;
  document.getElementById('modal-category').textContent = f.cat;
  document.getElementById('modal-title').textContent = f.name;
  document.getElementById('modal-desc').textContent = f.desc;

  document.getElementById('modal-specs').innerHTML = f.specs.map(s => `
    <div class="spec-box">
      <div class="spec-label">${s.l}</div>
      <div class="spec-val">${s.v}</div>
    </div>`).join('');

  document.getElementById('modal-products').innerHTML = f.products.map(p => {
    const m = PRODUCTS_META[p];
    if (!m) return '';
    const imgKey = `${p}__${f.id}`;
    const storedSrc = getImage(imgKey) || '';
    const hasImg = !!storedSrc;
    return `<div class="product-item${hasImg ? ' has-image' : ''}" onclick="openGarmentPanel('${p}','${f.id}','${f.name}','${ic}')" tabindex="0" role="button" aria-label="View ${m.name} in ${f.name}">
      <div class="img-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
      <img class="product-thumb" src="${storedSrc}" alt="${m.name}"/>
      <div class="product-icon" style="color:${ic}">${m.icon}</div>
      <div class="product-name">${m.name}</div>
      <div class="product-note">${m.note}</div>
      <div class="product-tap-hint">Tap to explore →</div>
    </div>`;
  }).join('');

  const ov = document.getElementById('modal');
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  ov.querySelector('.modal').scrollTop = 0;
  setTimeout(() => document.getElementById('modal-title').focus(), 100);
}

function closeModal(e) { if (e.target === document.getElementById('modal')) closeModalBtn(); }
function closeModalBtn() { document.getElementById('modal').classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModalBtn(); });

/* ─── TABS ──────────────────────────────────────────── */
function showTab(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
}

/* ─── ALL PRODUCTS ──────────────────────────────────── */
function getFabricsForProduct(productKey) {
  const result = [];
  for (const category of Object.values(DATA)) {
    for (const fabric of category) {
      if (fabric.products.includes(productKey)) result.push(fabric);
    }
  }
  return result;
}

function getBestImage(productKey) {
  for (const [key, path] of Object.entries(STATIC_IMAGES)) {
    if (key.startsWith(productKey + '__')) return path;
  }
  return null;
}

function renderAllProducts(gridId) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = '';
  const keys = Object.keys(PRODUCTS_META);
  document.getElementById('all-products-count').textContent = keys.length;

  keys.forEach((key, i) => {
    const m = PRODUCTS_META[key];
    const fabrics = getFabricsForProduct(key);
    const img = getBestImage(key);

    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${m.name} — available in ${fabrics.length} fabrics`);
    card.style.animationDelay = `${i * 0.03}s`;

    const pillsHTML = fabrics.slice(0, 3).map(f =>
      `<span class="pc-pill">${f.name}</span>`
    ).join('') + (fabrics.length > 3 ? `<span class="pc-pill">+${fabrics.length - 3}</span>` : '');

    card.innerHTML = `
      <div class="pc-visual">
        ${img
          ? `<img src="${img}" alt="${m.name}" loading="lazy"/>`
          : `<div class="pc-icon">${m.icon}</div>`}
        <span class="pc-fabric-count">${fabrics.length} fabric${fabrics.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="pc-body">
        <div class="pc-name">${m.name}</div>
        <div class="pc-note">${m.note}</div>
        <div class="pc-fabrics">${pillsHTML}</div>
      </div>`;

    card.addEventListener('click', () => openProductModal(key));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProductModal(key); } });
    grid.appendChild(card);
  });
}

function openProductModal(productKey) {
  const m = PRODUCTS_META[productKey];
  const fabrics = getFabricsForProduct(productKey);
  const img = getBestImage(productKey);

  const iconCol = '#1A6B52';

  const visual = document.getElementById('pm-visual');
  if (img) {
    visual.innerHTML = `<img src="${img}" alt="${m.name}" style="width:100%;height:100%;object-fit:contain;border-radius:8px;"/>`;
    visual.style.background = 'var(--cream)';
  } else {
    visual.innerHTML = m.icon.replace('stroke="currentColor"', `stroke="${iconCol}"`);
    visual.style.background = 'rgba(26,107,82,.08)';
  }

  document.getElementById('pm-category').textContent = m.note;
  document.getElementById('pm-title').textContent = m.name;
  document.getElementById('pm-desc').textContent = `Available in ${fabrics.length} fabric${fabrics.length !== 1 ? 's' : ''}. Click a fabric below to view full specs and request a sample.`;

  const iconColors = {
    'tex-jersey':'#1A6B52','tex-terry':'#0F4030','tex-fleece':'#E8E8E8','tex-rib':'#2A7A9A',
    'tex-interlock':'#C9993D','tex-pique':'#2A6A9A','tex-waffle':'#7A6A4A','tex-lycra':'#E8BE6A',
    'tex-twill':'#7A5030','tex-poplin':'#8A6840','tex-canvas':'#6A5030','tex-denim':'#2A4870',
    'tex-oxford':'#7A6A4A','tex-ripstop':'#3A5630','tex-linen':'#8A7840','tex-satin':'#C0A040',
    'tex-velvet':'#D0A0FF','tex-jacquard':'#C0A040','tex-microfiber':'#3A6A8A','tex-muslin':'#A09060',
    'tex-felt':'#C09070','tex-terry-home':'#3A7A90',
  };

  document.getElementById('pm-fabrics').innerHTML = fabrics.map(f => {
    const ic = iconColors[f.tex] || '#1A6B52';
    const fabricImg = getImage(`${productKey}__${f.id}`);
    return `<div class="fabric-option-card" onclick="openFabricFromProduct('${productKey}','${f.id}','${f.name}','${ic}')" tabindex="0" role="button">
      <div class="foc-visual ${fabricImg ? '' : f.tex}">
        ${fabricImg
          ? `<img src="${fabricImg}" alt="${f.name}"/>`
          : `<div class="foc-svg">${buildFabricSVG(f.tex)}</div>`}
      </div>
      <div class="foc-body">
        <div class="foc-name">${f.name}</div>
        <div class="foc-gsm">${f.gsm}</div>
        <div class="foc-cta">View details <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M8 3l5 5-5 5"/></svg></div>
      </div>
    </div>`;
  }).join('');

  const ov = document.getElementById('product-modal');
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  ov.querySelector('.modal').scrollTop = 0;
}

function openFabricFromProduct(productKey, fabricId, fabricName, acc) {
  closeProductModalBtn();
  setTimeout(() => openGarmentPanel(productKey, fabricId, fabricName, acc), 320);
}

function closeProductModal(e) {
  if (e.target === document.getElementById('product-modal')) closeProductModalBtn();
}
function closeProductModalBtn() {
  document.getElementById('product-modal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeProductModalBtn(); closeModalBtn(); } });

/*  INIT  */
renderCards(DATA.knitted, 'knitted-grid');
renderCards(DATA.woven, 'woven-grid');
renderCards(DATA.homedecor, 'homedecor-grid');
renderAllProducts('allproducts-grid');

/* HANDLE HASH NAVIGATION */
function handleHash() {
  const hash = window.location.hash.substring(1);
  if (['knitted', 'woven', 'homedecor', 'allproducts'].includes(hash)) {
    const btn = document.querySelector(`.nav-tab[onclick*="'${hash}'"]`);
    if (btn) showTab(hash, btn);
  }
}

window.addEventListener('DOMContentLoaded', handleHash);
window.addEventListener('hashchange', handleHash);
handleHash();
