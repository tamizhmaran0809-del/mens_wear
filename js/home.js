/* ==========================================================================
   HOME.JS — hero slider, testimonial slider, product rows, countdown
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Hero slider ---------------- */
  const track = document.getElementById('heroTrack');
  const dotsWrap = document.getElementById('heroDots');
  const slides = track ? Array.from(track.children) : [];
  let heroIdx = 0, heroTimer;

  if (slides.length){
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => { goHero(i); restartHeroAuto(); });
      dotsWrap.appendChild(dot);
    });
    function goHero(i){
      heroIdx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${heroIdx * 100}%)`;
      Array.from(dotsWrap.children).forEach((d, idx) => d.classList.toggle('active', idx === heroIdx));
    }
    function restartHeroAuto(){ clearInterval(heroTimer); heroTimer = setInterval(() => goHero(heroIdx + 1), 5500); }
    document.querySelector('.hero-arrow.next').addEventListener('click', () => { goHero(heroIdx + 1); restartHeroAuto(); });
    document.querySelector('.hero-arrow.prev').addEventListener('click', () => { goHero(heroIdx - 1); restartHeroAuto(); });
    restartHeroAuto();
  }

  /* ---------------- Testimonial slider ---------------- */
  const testiSlides = document.querySelectorAll('.testi-slide');
  let testiIdx = 0;
  function showTesti(i){
    testiIdx = (i + testiSlides.length) % testiSlides.length;
    testiSlides.forEach((s, idx) => s.classList.toggle('active', idx === testiIdx));
  }
  document.querySelector('.testi-next') && document.querySelector('.testi-next').addEventListener('click', () => showTesti(testiIdx + 1));
  document.querySelector('.testi-prev') && document.querySelector('.testi-prev').addEventListener('click', () => showTesti(testiIdx - 1));
  if (testiSlides.length) setInterval(() => showTesti(testiIdx + 1), 6000);

  /* ---------------- Product rows ---------------- */
  const trending = CATALOG.filter(p => ['p01','p03','p06','p08','p11'].includes(p.id));
  const bestsellers = [...CATALOG].sort((a,b) => b.reviews - a.reviews).slice(0,5);
  const newArrivals = CATALOG.filter(p => p.tag === 'New' || p.tag === 'Trending').slice(0,5).concat(CATALOG.slice(0,2)).slice(0,5);
  const flash = CATALOG.filter(p => (1 - p.price/p.mrp) >= 0.35);

  document.getElementById('trendingRow').innerHTML = trending.map(renderProductCard).join('');
  document.getElementById('bestsellerRow').innerHTML = bestsellers.map(renderProductCard).join('');
  document.getElementById('newArrivalsRow').innerHTML = newArrivals.map(renderProductCard).join('');
  document.getElementById('flashRow').innerHTML = flash.map(renderProductCard).join('');

  // re-run reveal observer on freshly injected cards
  const newReveals = document.querySelectorAll('.p-card.reveal:not(.in-view)');
  if ('IntersectionObserver' in window){
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in-view'); io2.unobserve(e.target); } });
    }, { threshold:.1 });
    newReveals.forEach(el => io2.observe(el));
  } else {
    newReveals.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------- Countdown timer ---------------- */
  const target = Date.now() + (1000*60*60*7) + (1000*60*23); // ~7h23m from load, resets per session
  function tick(){
    const diff = Math.max(0, target - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2,'0');
    const eh = document.getElementById('cdH'), em = document.getElementById('cdM'), es = document.getElementById('cdS');
    if (eh) eh.textContent = pad(h);
    if (em) em.textContent = pad(m);
    if (es) es.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

});
