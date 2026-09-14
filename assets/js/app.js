/* ══ Львів, який шарудить під ногами · логіка презентації ══ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const deck   = $('#deck'),  phone = $('#phone'), head = $('#head'), rail = $('#rail');
const hKick  = $('#headKicker'), hTitle = $('#headTitle'), hCount = $('#headCount');
const sheet  = $('#sheet'), scrim = $('#scrim'), sheetBody = $('#sheetBody');

const STOPS = SLIDES.filter(s => s.type === 'stop');
const IMG   = (slug, alt, tape) =>
  `<figure class="frame">${tape ? '<span class="tape"></span>' : ''}
     <img src="assets/img/${slug}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async">
   </figure>`;

/* ─────────── Мапа маршруту (мальована) ─────────── */
const ROUTE_SVG = `
<svg viewBox="0 0 340 154" role="img" aria-label="Схема маршруту: Чупринки, Мельника, Коновальця, Піскові озера">
  <path d="M34 112 C 76 112, 76 46, 122 46 S 172 104, 214 92 S 272 52, 306 66"
        fill="none" stroke="#C78A54" stroke-width="3" stroke-linecap="round"
        stroke-dasharray="1 9" opacity=".9"/>
  <g font-family="Unbounded, sans-serif" font-size="7.5" font-weight="700" fill="#6B4A31" text-anchor="middle">
    <circle cx="34"  cy="112" r="6.5" fill="#E5812F"/><text x="36"  y="134">ЧУПРИНКИ</text>
    <circle cx="122" cy="46"  r="6.5" fill="#C9931A"/><text x="122" y="28">МЕЛЬНИКА</text>
    <circle cx="214" cy="92"  r="6.5" fill="#C6412A"/><text x="212" y="114">КОНОВАЛЬЦЯ</text>
    <circle cx="306" cy="66"  r="8"   fill="#2F8AA6"/><text x="286" y="46">ПІСКОВІ ОЗЕРА</text>
  </g>
</svg>`;

/* ─────────── Рендер слайдів ─────────── */
function render(s, i) {
  const tone = CHAPTERS[s.ch].tone;
  const open = (cls) => `<section class="slide ${cls}" data-i="${i}" data-ch="${s.ch}" data-tone="${tone}">`;

  if (s.type === 'intro') return `
    ${open('intro')}
      <figure class="frame wide"><span class="tape"></span><img src="assets/img/hero-chuprynky.jpg" alt="Вулиця Генерала Чупринки у Львові" decoding="async"></figure>
      <p class="intro-eyebrow">Львів · осіння прогулянка</p>
      <h1 class="big">Львів, який <em>шарудить</em> під ногами</h1>
      <p class="intro-sub">Від сецесійних вілл Кастелівки — бруківкою, повз маскарони й меморіальні таблиці — до двох озер, які колись були гіпсовим кар’єром.</p>
      <div class="route-map">${ROUTE_SVG}</div>
      <div class="chips">
        <span class="chip">≈ 3,5 км</span><span class="chip">4 вулиці</span>
        <span class="chip">${STOPS.length} зупинок</span><span class="chip">≈ 1,5 год</span>
      </div>
      <button class="start" id="startBtn">
        Почати прогулянку
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v15m0 0-6-6m6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="hint">гортайте вгору<span>↓</span></div>
    </section>`;

  if (s.type === 'chapter') return `
    ${open('chapter')}
      <p class="roman">${CHAPTERS[s.ch].n}</p>
      <p class="ch-kicker">${esc(CHAPTERS[s.ch].kicker)}</p>
      <h2 class="ch-title">${esc(s.title)}</h2>
      <p class="ch-lead">${esc(s.lead)}</p>
      <ul class="tl">${s.timeline.map(([y, n]) => `<li><b>${esc(y)}</b>${esc(n)}</li>`).join('')}</ul>
      ${s.note ? `<div class="note"><span class="pin">🍂</span>${esc(s.note)}</div>` : ''}
    </section>`;

  if (s.type === 'outro') return `
    ${open('outro')}
      <h2 class="outro-title">Ось і вода.</h2>
      <p class="body">Три з половиною кілометри, чотири вулиці, понад десяток імен, які вони встигли поміняти, — і два озера, що пам’ятають гіпсовий кар’єр. Осінь тут завжди закінчується пізніше, ніж у центрі.</p>
      ${IMG('lake-7', 'Піскові озера восени', true)}
      <div class="stats">
        <div class="stat"><b>${STOPS.length}</b><span>зупинок пройдено</span></div>
        <div class="stat"><b>5,8 га</b><span>площа парку</span></div>
        <div class="stat"><b>1923</b><span>рік заснування парку</span></div>
        <div class="stat"><b>6</b><span>імен однієї вулиці</span></div>
      </div>
      <button class="again" id="againBtn">↺ Пройти ще раз</button>
      <div class="credits">
        <p>Історичні відомості: Вікіпедія, <a href="https://www.032.ua" target="_blank" rel="noopener">032.ua</a>, <a href="https://photo-lviv.in.ua" target="_blank" rel="noopener">Фотографії старого Львова</a>, <a href="https://inlviv.in.ua" target="_blank" rel="noopener">То є Львів</a>.</p>
        <details>
          <summary>Автори фотографій · ${CREDITS.length} світлин</summary>
          <p>Усі фото — з Wikimedia Commons, ліцензії CC BY-SA / CC BY.</p>
          <ul>${CREDITS.map(c => `<li><a href="${esc(c.u)}" target="_blank" rel="noopener">${esc(c.t)}</a> — ${esc(c.a)}, ${esc(c.l)}</li>`).join('')}</ul>
        </details>
      </div>
    </section>`;

  /* звичайна зупинка */
  const media = s.gallery
    ? `<div class="gal">${s.gallery.map(g => IMG(g, s.title)).join('')}</div>
       <p class="gal-hint">← гортайте фото →</p>`
    : IMG(s.img, s.title, true);

  return `
    ${open('stop')}
      ${media}
      <span class="addr">${esc(s.addr)}</span>
      <h2 class="title">${esc(s.title)}</h2>
      ${s.meta ? `<p class="meta">${esc(s.meta)}</p>` : ''}
      <p class="body">${esc(s.text)}</p>
      ${s.note ? `<div class="note"><span class="pin">${s.highlight ? '⭐' : '🍁'}</span>${esc(s.note)}</div>` : ''}
    </section>`;
}

deck.innerHTML = SLIDES.map(render).join('');
const slides = [...deck.querySelectorAll('.slide')];

/* фото: плавна поява */
deck.querySelectorAll('.frame img').forEach(im => {
  const ok = () => im.classList.add('ready');
  im.complete ? ok() : im.addEventListener('load', ok, { once: true });
  im.addEventListener('error', () => im.closest('.frame')?.remove(), { once: true });
});

/* ─────────── Прогрес-гілка ─────────── */
const TONE_HEX = { amber:'#E5812F', mustard:'#C9931A', maple:'#C6412A', water:'#2F8AA6' };
rail.innerHTML = CHAPTERS.map(c => `<span style="--seg:${TONE_HEX[c.tone]}"></span>`).join('');
const segs = [...rail.children];

const chCounts = CHAPTERS.map((_, ci) => SLIDES.filter(s => s.ch === ci).length);

function paint(i) {
  const s = SLIDES[i], ch = s.ch;
  phone.dataset.tone = CHAPTERS[ch].tone;

  const first = SLIDES.findIndex(x => x.ch === ch);
  const within = i - first + 1;
  segs.forEach((el, k) => {
    el.style.setProperty('--p', k < ch ? '100%' : k > ch ? '0%' : Math.round(within / chCounts[ch] * 100) + '%');
  });

  if (s.type === 'intro')      { hKick.textContent = 'прогулянка';  hTitle.textContent = 'Львів, який шарудить під ногами'; }
  else if (s.type === 'outro') { hKick.textContent = 'фінал';       hTitle.textContent = 'Дякуємо за прогулянку'; }
  else                         { hKick.textContent = CHAPTERS[ch].kicker; hTitle.textContent = CHAPTERS[ch].name; }

  const n = STOPS.indexOf(s);
  hCount.textContent = n >= 0 ? `${n + 1}/${STOPS.length}` : '';

  sheetBody.querySelectorAll('.sh-item').forEach(b => b.classList.toggle('cur', +b.dataset.i === i));
}

/* ─────────── Спостерігач ─────────── */
let current = 0;
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('seen');                 // з'явився бодай краєм — показуємо
    if (e.intersectionRatio < .45) return;          // а заголовок міняємо лише для головного
    const i = +e.target.dataset.i;
    if (i !== current) { current = i; paint(i); }
  });
}, { root: deck, threshold: [.01, .45] });
slides.forEach(sl => io.observe(sl));
paint(0);

/* страхувальна сітка: слайд посеред екрана завжди видимий */
let tick;
deck.addEventListener('scroll', () => {
  clearTimeout(tick);
  tick = setTimeout(() => {
    const mid = deck.scrollTop + deck.clientHeight / 2;
    const sl = slides.find(el => el.offsetTop <= mid && el.offsetTop + el.offsetHeight > mid);
    if (sl) {
      sl.classList.add('seen');
      const i = +sl.dataset.i;
      if (i !== current) { current = i; paint(i); }
    }
  }, 120);
}, { passive: true });

/* ─────────── Панель маршруту ─────────── */
sheetBody.innerHTML = CHAPTERS.map((c, ci) => {
  const items = SLIDES.map((s, i) => ({ s, i })).filter(x => x.s.ch === ci && x.s.type !== 'intro');
  return `<div class="sh-group">
    <div class="sh-gtitle" style="--accent:${TONE_HEX[c.tone]};--accent-ink:${TONE_HEX[c.tone]}">${esc(c.kicker)} ${esc(c.name)}</div>
    ${items.map(({ s, i }) => {
      const thumb = s.img ? `<img class="sh-thumb" src="assets/img/${s.img}.jpg" alt="" loading="lazy">`
        : `<div class="sh-thumb ph">${s.type === 'chapter' ? CHAPTERS[s.ch].n : '🍁'}</div>`;
      const t = s.type === 'chapter' ? s.title : s.type === 'outro' ? 'Фінал прогулянки' : s.title;
      const sub = s.type === 'chapter' ? 'початок розділу' : s.addr || '';
      return `<button class="sh-item" data-i="${i}" style="--accent-wash:${TONE_HEX[c.tone]}22">
        ${thumb}<span class="sh-txt"><b>${esc(t)}</b><span>${esc(sub)}</span></span></button>`;
    }).join('')}
  </div>`;
}).join('');

const goto = i => { slides[i].scrollIntoView({ behavior: 'smooth', block: 'start' }); };
const openSheet = on => {
  sheet.classList.toggle('on', on); scrim.classList.toggle('on', on);
  sheet.setAttribute('aria-hidden', String(!on));
  $('#menuBtn').setAttribute('aria-expanded', String(on));
  if (on) sheetBody.querySelector('.sh-item.cur')?.scrollIntoView({ block: 'center' });
};

$('#menuBtn').addEventListener('click', () => openSheet(!sheet.classList.contains('on')));
scrim.addEventListener('click', () => openSheet(false));
sheetBody.addEventListener('click', e => {
  const b = e.target.closest('.sh-item'); if (!b) return;
  openSheet(false); setTimeout(() => goto(+b.dataset.i), 180);
});
$('#mark').addEventListener('click', () => goto(0));
deck.addEventListener('click', e => {
  if (e.target.closest('#startBtn')) goto(1);
  if (e.target.closest('#againBtn')) goto(0);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') return openSheet(false);
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goto(Math.min(current + 1, slides.length - 1)); }
  if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); goto(Math.max(current - 1, 0)); }
});

/* ─────────── Падаюче листя ─────────── */
const LEAF_SHAPES = [
  'M22 2C9 2 2 9 2 22 15 22 22 15 22 2Z',
  'M12 1l2.4 4.4L19 4l-1.2 4.3 4.6-.6-3.1 3.3 4.5 2.1-4.5 1.3 2.5 3.6-4.4-1 .4 4.4L12 19l-2.8 2.4.4-4.4-4.4 1 2.5-3.6L3 13.1l4.5-2.1-3.1-3.3 4.6.6L7.8 4 12 5.4 12 1z',
  'M12 2c6.5 3.2 8.6 8.6 6.2 13.6S9.6 22.8 5.4 19.4C1.4 16 4.6 5.6 12 2Z',
  'M3 21C3 12 9 3 21 3c0 10-8 18-18 18Z'
];
const LEAF_COLORS = ['#E5812F', '#C6412A', '#D9A21B', '#B06A2C', '#E8A33F', '#8E9B44'];

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const sow = (box, count) => {
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.className = 'leaf';
      const size = rnd(15, 31);
      d.style.cssText = `left:${rnd(-4, 100)}%;--drift:${rnd(-90, 110)}px;
        animation-duration:${rnd(13, 26)}s;animation-delay:${-rnd(0, 26)}s;opacity:${rnd(.4, .8)}`;
      d.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="animation-duration:${rnd(2.4, 5.5)}s">
        <path d="${LEAF_SHAPES[i % LEAF_SHAPES.length]}" fill="${LEAF_COLORS[i % LEAF_COLORS.length]}"/></svg>`;
      box.appendChild(d);
    }
  };
  sow($('#leavesIn'), 14);
  sow($('#leavesOut'), 12);
}
})();
