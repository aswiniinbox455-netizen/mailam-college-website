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

// Videos: each plays its own time range of the same file, looping, only while on screen
function loopRange(v) {
  const a = +v.dataset.start || 0, b = +v.dataset.end || 0;
  const toStart = () => { try { v.currentTime = a; } catch (e) {} };
  v.addEventListener('loadedmetadata', toStart);
  if (v.readyState >= 1) toStart();
  v.addEventListener('timeupdate', () => { if ((b && v.currentTime >= b) || v.currentTime < a - 0.2) toStart(); });
  v.addEventListener('ended', () => { toStart(); v.play().catch(() => {}); });
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: .05 }).observe(v);
}
loopRange(document.getElementById('heroImg'));

const vid = document.getElementById('scrubVideo');
const caps = gsap.utils.toArray('.cap');
const bar = document.getElementById('scrubBar');
let lastIdx = -2;
loopRange(vid);
ScrollTrigger.create({ trigger: '.scrub', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => {
  const p = s.progress;
  bar.style.width = (p * 100) + '%';
  gsap.set(vid, { scale: 1.25 - p * 0.25 });
  let idx = -1; caps.forEach((c, i) => { if (p >= +c.dataset.at) idx = i; });
  if (idx !== lastIdx) { lastIdx = idx;
    caps.forEach((c, i) => gsap.to(c, { opacity: i === idx ? 1 : 0, y: i === idx ? 0 : (i < idx ? -40 : 40), duration: .6, overwrite: true })); }
} });

// Section text rising in
gsap.utils.toArray('.up').forEach(el => gsap.to(el, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));

// PROGRAMME switcher
document.querySelectorAll('.sw').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.sw').forEach(x => x.classList.toggle('active', x === b));
  document.querySelectorAll('.cards-rail').forEach(r => r.classList.toggle('hidden', r.dataset.panel !== b.dataset.tab));
  const rail = document.querySelector('.cards-rail[data-panel="' + b.dataset.tab + '"]');
  rail.scrollLeft = 0;
  gsap.fromTo(rail.children, { y: 60, opacity: 0, rotate: 3 }, { y: 0, opacity: 1, rotate: 0, stagger: .06, duration: .8, ease: 'back.out(1.4)' });
}));
gsap.from('.cards-rail[data-panel="ug"] .pcard', { y: 80, opacity: 0, rotate: 4, stagger: .07, duration: 1, ease: 'back.out(1.3)', scrollTrigger: { trigger: '.cards-rail', start: 'top 85%' } });

// PANORAMA: image pans sideways while scrolling down
const track = document.getElementById('panoTrack');
function panDist() { return Math.max(0, track.scrollWidth - innerWidth); }
gsap.fromTo(track, { x: 0, scale: 1.15 }, {
  x: () => -panDist(), scale: 1, ease: 'none',
  scrollTrigger: { trigger: '.pano', start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true }
});
gsap.from('.pano-copy', { y: 80, opacity: 0, scrollTrigger: { trigger: '.pano', start: 'top 30%', end: 'top -20%', scrub: true } });

// JOURNEY: line draws, steps light up
const path = document.getElementById('tlPath');
const len = 1000;
path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: true } });
document.querySelectorAll('.step').forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 70%', onEnter: () => s.classList.add('lit'), onLeaveBack: () => s.classList.remove('lit') }));

// FACILITIES tiles
gsap.to('.tile', { opacity: 1, y: 0, scale: 1, stagger: .08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.grid', start: 'top 80%' } });

// MASCOT: vector student walks in, then waves and throws the cap
const mt = gsap.timeline({ scrollTrigger: { trigger: '.closing', start: 'top 75%' } });
mt.from('#mascot', { x: -260, opacity: 0, duration: 1.2, ease: 'power3.out' })
  .to('#armR', { rotate: -150, svgOrigin: '128 118', duration: .5, ease: 'back.out(2)' })
  .to('#gradCap', { y: -120, rotate: 340, svgOrigin: '100 40', duration: 1, ease: 'power2.out' }, '<.2')
  .to('#gradCap', { y: 0, rotate: 360, svgOrigin: '100 40', duration: .9, ease: 'bounce.out' })
  .to('#armR', { rotate: -120, svgOrigin: '128 118', duration: .35, yoyo: true, repeat: 5, ease: 'sine.inOut' }, '<');
gsap.to('#mascotBody', { y: -4, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
gsap.to('#eyes', { scaleY: .1, transformOrigin: '50% 50%', duration: .08, yoyo: true, repeat: -1, repeatDelay: 3 });

// CLOSING title
gsap.from('.closing-title', { scale: .7, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top 90%', end: 'center 60%', scrub: true } });

addEventListener('load', () => ScrollTrigger.refresh());
