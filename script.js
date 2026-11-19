// Mailam CLG – Student Project by Aswini
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth scrolling (Apple-like feel)
if (!reduce && window.Lenis) {
  const lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -70 }); }
  }));
}

// HERO: intro, then zoom-out + fade as you scroll
gsap.timeline({ delay: .2 })
  .to('.hero-title .line>span', { y: 0, duration: 1.1, ease: 'expo.out', stagger: .12 })
  .to('.reveal-hero', { opacity: 1, duration: .9, stagger: .1 }, '-=.7');

gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true } })
  .to('#heroImg', { scale: 1, ease: 'none' }, 0)
  .to('.hero-copy', { y: -120, opacity: 0, ease: 'none' }, 0.15)
  .to('.hero-shade', { opacity: .55, ease: 'none' }, 0);

// STATEMENT: words light up one by one
const lt = document.querySelector('[data-light]');
lt.innerHTML = lt.textContent.trim().split(/\s+/).map(w => '<span class="w">' + w + '</span>').join(' ');
const words = lt.querySelectorAll('.w');
ScrollTrigger.create({
  trigger: lt, start: 'top 80%', end: 'bottom 45%', scrub: true,
  onUpdate: s => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); }
});

// STATS: count up
document.querySelectorAll('[data-count]').forEach(el => {
  const end = +el.dataset.count, suf = el.dataset.suffix || '', plain = 'plain' in el.dataset;
  const o = { v: plain ? end - 60 : 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => el.textContent = Math.round(o.v) + suf })
  });
});
gsap.from('.stat', { y: 60, opacity: 0, stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.stats', start: 'top 80%' } });

// Scroll controls video time (videos are encoded with dense keyframes for smooth seeking)
function scrubVideo(v, trigger, onProg) {
  let tgt = 0, cur = -1;
  ScrollTrigger.create({ trigger, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: s => { if (v.duration) tgt = s.progress * (v.duration - 0.05); onProg && onProg(s.progress); } });
  (function tick() {
    if (v.readyState >= 1 && !v.seeking && Math.abs(tgt - cur) > 0.01) { cur += (tgt - cur) * 0.2; if (cur < 0) cur = 0; try { v.currentTime = cur; } catch (e) {} }
    requestAnimationFrame(tick);
  })();
}
scrubVideo(document.getElementById('heroImg'), '.hero');

const vid = document.getElementById('scrubVideo');
const caps = gsap.utils.toArray('.cap');
const bar = document.getElementById('scrubBar');
let lastIdx = -2;
scrubVideo(vid, '.scrub', p => {
  bar.style.width = (p * 100) + '%';
  let idx = -1; caps.forEach((c, i) => { if (p >= +c.dataset.at) idx = i; });
  if (idx !== lastIdx) { lastIdx = idx;
    caps.forEach((c, i) => gsap.to(c, { opacity: i === idx ? 1 : 0, y: i === idx ? 0 : (i < idx ? -40 : 40), duration: .6, overwrite: true })); }
});

// Section text rising in
gsap.utils.toArray('.up').forEach(el => gsap.to(el, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));

// PROGRAMME switcher
document.querySelectorAll('.sw').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.sw').forEach(x => x.classList.toggle('active', x === b));
  document.querySelectorAll('.cards-rail').forEach(r => r.classList.toggle('hidden', r.dataset.panel !== b.dataset.tab));
  const rail = document.querySelector('.cards-rail[data-panel="' + b.dataset.tab + '"]');
  rail.scrollLeft = 0;
  gsap.fromTo(rail.children, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, stagger: .06, duration: .7, ease: 'back.out(1.4)' });
}));
gsap.from('.cards-rail[data-panel="ug"] .pcard', { opacity: 0, scale: .88, stagger: .07, duration: .9, ease: 'back.out(1.3)', scrollTrigger: { trigger: '.cards-rail', start: 'top 85%' } });

// FULL PHOTO: starts zoomed on the students, pulls back to show the whole picture
gsap.fromTo('#panoTrack img', { scale: 1.8, transformOrigin: '62% 72%' }, { scale: 1, ease: 'none',
  scrollTrigger: { trigger: '.pano', start: 'top top', end: '70% bottom', scrub: true } });
gsap.from('.pano-copy', { y: 80, opacity: 0, scrollTrigger: { trigger: '.pano', start: 'top 30%', end: 'top -20%', scrub: true } });

// JOURNEY: line draws, steps light up
const path = document.getElementById('tlPath');
const len = 1000;
path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: true } });
document.querySelectorAll('.step').forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 70%', onEnter: () => s.classList.add('lit'), onLeaveBack: () => s.classList.remove('lit') }));

// FACILITIES tiles
gsap.to('.tile', { opacity: 1, y: 0, scale: 1, stagger: .08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.grid', start: 'top 80%' } });

// CLOSING title
gsap.from('.closing-title', { scale: .7, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top 90%', end: 'center 60%', scrub: true } });

addEventListener('load', () => ScrollTrigger.refresh());
