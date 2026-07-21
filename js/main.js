/* ==========================================================================
   MAIN.JS — Global store + shared UI behaviours used on every page
   ========================================================================== */

/* ---------------------------------------------------------------
   PRODUCT CATALOG — single source of truth used across all pages
   --------------------------------------------------------------- */
const CATALOG = [
  { id:'p01', name:'Classic Oxford Shirt', brand:'URBAN THREAD', category:'shirts', occasion:'formal-wear', age:['18-25','26-35','36-45'], price:1299, mrp:2199, rating:4.3, reviews:842, colors:['#1A2333','#FFFFFF','#7C8AA5'], sizes:['S','M','L','XL','XXL'], oos:['XXL'], img1:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop', tag:'Bestseller', delivery:'2-day delivery', stock:'in' },
  { id:'p02', name:'Slim Fit Denim Jeans', brand:'DENIM CO.', category:'jeans', occasion:'casual-wear', age:['teens','18-25','26-35'], price:1799, mrp:2999, rating:4.1, reviews:1204, colors:['#2B3A55','#111111'], sizes:['30','32','34','36','38'], oos:[], img1:'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=600&auto=format&fit=crop', tag:'New', delivery:'3-day delivery', stock:'in' },
  { id:'p03', name:'Premium Wool Blazer', brand:'SAVILE HOUSE', category:'blazers', occasion:'formal-wear', age:['26-35','36-45','45+'], price:5499, mrp:8999, rating:4.6, reviews:356, colors:['#1A2333','#5B4636'], sizes:['M','L','XL'], oos:[], img1:'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=600&auto=format&fit=crop', tag:'Premium', delivery:'4-day delivery', stock:'in' },
  { id:'p04', name:'Graphic Print Tee', brand:'STREET LOOM', category:'tshirts', occasion:'casual-wear', age:['kids','teens','18-25'], price:599, mrp:999, rating:4.0, reviews:2103, colors:['#FFFFFF','#111111','#FF4D6D'], sizes:['XS','S','M','L','XL'], oos:['XS'], img1:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=600&auto=format&fit=crop', tag:'Sale', delivery:'2-day delivery', stock:'in' },
  { id:'p05', name:'Chino Trouser', brand:'URBAN THREAD', category:'trousers', occasion:'casual-wear', age:['18-25','26-35','36-45'], price:1499, mrp:2299, rating:4.2, reviews:678, colors:['#C9B48A','#1A2333','#556B2F'], sizes:['30','32','34','36'], oos:[], img1:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop', tag:'', delivery:'2-day delivery', stock:'in' },
  { id:'p06', name:'Zip-Up Hoodie', brand:'NORTH FIELD', category:'hoodies', occasion:'casual-wear', age:['teens','18-25','26-35'], price:1999, mrp:3199, rating:4.4, reviews:945, colors:['#5B6B7C','#111111','#8A0F1A'], sizes:['S','M','L','XL'], oos:[], img1:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=600&auto=format&fit=crop', tag:'Trending', delivery:'3-day delivery', stock:'in' },
  { id:'p07', name:'Leather Biker Jacket', brand:'RIDGE & CO', category:'jackets', occasion:'casual-wear', age:['18-25','26-35'], price:6499, mrp:9999, rating:4.7, reviews:289, colors:['#111111','#4A2E1E'], sizes:['M','L','XL'], oos:['XL'], img1:'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop', tag:'Premium', delivery:'4-day delivery', stock:'low' },
  { id:'p08', name:'Ivory Silk Sherwani', brand:'HERITAGE LOOM', category:'ethnic-wear', occasion:'ethnic-wear', age:['26-35','36-45','45+'], price:8999, mrp:14999, rating:4.8, reviews:167, colors:['#F4EDE1','#8A0F1A'], sizes:['M','L','XL','XXL'], oos:[], img1:'https://images.unsplash.com/photo-1610189844772-a5b48db8b301?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1610030181087-540a4bde3e6d?q=80&w=600&auto=format&fit=crop', tag:'Bestseller', delivery:'5-day delivery', stock:'in' },
  { id:'p09', name:'Formal Dress Shirt', brand:'SAVILE HOUSE', category:'shirts', occasion:'formal-wear', age:['26-35','36-45','45+'], price:1699, mrp:2599, rating:4.3, reviews:512, colors:['#FFFFFF','#B8C4D6'], sizes:['S','M','L','XL'], oos:[], img1:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop', tag:'', delivery:'2-day delivery', stock:'in' },
  { id:'p10', name:'Straight Fit Jeans', brand:'DENIM CO.', category:'jeans', occasion:'casual-wear', age:['26-35','36-45'], price:1899, mrp:2799, rating:4.0, reviews:433, colors:['#334155'], sizes:['32','34','36','38'], oos:[], img1:'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop', tag:'', delivery:'3-day delivery', stock:'in' },
  { id:'p11', name:'Double-Breasted Coat', brand:'SAVILE HOUSE', category:'jackets', occasion:'formal-wear', age:['36-45','45+'], price:7499, mrp:11999, rating:4.5, reviews:198, colors:['#1A2333','#5B5B5B'], sizes:['M','L','XL'], oos:[], img1:'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=600&auto=format&fit=crop', tag:'Premium', delivery:'4-day delivery', stock:'in' },
  { id:'p12', name:'Bandhgala Wedding Set', brand:'HERITAGE LOOM', category:'ethnic-wear', occasion:'ethnic-wear', age:['26-35','36-45'], price:10999, mrp:17999, rating:4.7, reviews:143, colors:['#111111','#8A0F1A'], sizes:['M','L','XL'], oos:[], img1:'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1610189844772-a5b48db8b301?q=80&w=600&auto=format&fit=crop', tag:'New', delivery:'5-day delivery', stock:'in' },

  /* ---- Boys' / Kids line ---- */
  { id:'p13', name:'Boys Cotton Printed Tee', brand:'LITTLE THREAD', category:'tshirts', occasion:'casual-wear', age:['kids'], price:399, mrp:699, rating:4.4, reviews:512, colors:['#2B6CB0','#FFFFFF','#FF4D6D'], sizes:['3-4Y','5-6Y','7-8Y','9-10Y','11-12Y'], oos:[], img1:'https://picsum.photos/seed/boys-tee-01/600/750', img2:'https://picsum.photos/seed/boys-tee-01b/600/750', tag:'New', delivery:'2-day delivery', stock:'in' },
  { id:'p14', name:'Boys Denim Jacket', brand:'LITTLE THREAD', category:'jackets', occasion:'casual-wear', age:['kids'], price:999, mrp:1599, rating:4.5, reviews:214, colors:['#2B3A55','#111111'], sizes:['3-4Y','5-6Y','7-8Y','9-10Y'], oos:[], img1:'https://picsum.photos/seed/boys-jacket-01/600/750', img2:'https://picsum.photos/seed/boys-jacket-01b/600/750', tag:'Bestseller', delivery:'3-day delivery', stock:'in' },
  { id:'p15', name:'Boys Checked Shirt', brand:'JUNIOR CLOSET', category:'shirts', occasion:'casual-wear', age:['kids'], price:549, mrp:899, rating:4.2, reviews:178, colors:['#7C8AA5','#FFFFFF'], sizes:['3-4Y','5-6Y','7-8Y','9-10Y','11-12Y'], oos:[], img1:'https://picsum.photos/seed/boys-shirt-01/600/750', img2:'https://picsum.photos/seed/boys-shirt-01b/600/750', tag:'', delivery:'2-day delivery', stock:'in' },
  { id:'p16', name:'Boys Jogger Pants', brand:'JUNIOR CLOSET', category:'trousers', occasion:'casual-wear', age:['kids'], price:649, mrp:999, rating:4.3, reviews:301, colors:['#556B2F','#111111','#5B6B7C'], sizes:['3-4Y','5-6Y','7-8Y','9-10Y'], oos:[], img1:'https://picsum.photos/seed/boys-jogger-01/600/750', img2:'https://picsum.photos/seed/boys-jogger-01b/600/750', tag:'Sale', delivery:'2-day delivery', stock:'in' },
  { id:'p17', name:'Boys Hooded Sweatshirt', brand:'LITTLE THREAD', category:'hoodies', occasion:'casual-wear', age:['kids'], price:849, mrp:1299, rating:4.6, reviews:389, colors:['#8A0F1A','#1A2333'], sizes:['5-6Y','7-8Y','9-10Y','11-12Y'], oos:[], img1:'https://picsum.photos/seed/boys-hoodie-01/600/750', img2:'https://picsum.photos/seed/boys-hoodie-01b/600/750', tag:'Trending', delivery:'3-day delivery', stock:'in' },
  { id:'p18', name:'Boys Festive Kurta Set', brand:'HERITAGE LOOM', category:'ethnic-wear', occasion:'ethnic-wear', age:['kids'], price:1199, mrp:1899, rating:4.7, reviews:96, colors:['#F4EDE1','#8A0F1A'], sizes:['3-4Y','5-6Y','7-8Y','9-10Y','11-12Y'], oos:[], img1:'https://picsum.photos/seed/boys-kurta-01/600/750', img2:'https://picsum.photos/seed/boys-kurta-01b/600/750', tag:'New', delivery:'4-day delivery', stock:'in' },

  /* ---- New additions ---- */
  { id:'p19', name:'Linen Button-Down Shirt', brand:'URBAN THREAD', category:'shirts', occasion:'casual-wear', age:['18-25','26-35','36-45'], price:1599, mrp:2499, rating:4.5, reviews:276, colors:['#F4EDE1','#7C8AA5','#556B2F'], sizes:['S','M','L','XL'], oos:[], img1:'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop', tag:'New', delivery:'2-day delivery', stock:'in' },
  { id:'p20', name:'Tapered Fit Track Pants', brand:'NORTH FIELD', category:'trousers', occasion:'casual-wear', age:['teens','18-25','26-35'], price:999, mrp:1699, rating:4.3, reviews:521, colors:['#111111','#334155','#5B6B7C'], sizes:['S','M','L','XL'], oos:[], img1:'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=600&auto=format&fit=crop', tag:'Trending', delivery:'2-day delivery', stock:'in' },
  { id:'p21', name:'Crew Neck Essential Tee', brand:'STREET LOOM', category:'tshirts', occasion:'casual-wear', age:['teens','18-25','26-35'], price:449, mrp:799, rating:4.1, reviews:1560, colors:['#FFFFFF','#111111','#334155','#8A0F1A'], sizes:['S','M','L','XL','XXL'], oos:[], img1:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=600&auto=format&fit=crop', tag:'Sale', delivery:'2-day delivery', stock:'in' },
  { id:'p22', name:'Quilted Puffer Jacket', brand:'RIDGE & CO', category:'jackets', occasion:'casual-wear', age:['18-25','26-35','36-45'], price:3499, mrp:5999, rating:4.4, reviews:198, colors:['#1A2333','#8A0F1A','#111111'], sizes:['M','L','XL','XXL'], oos:['XXL'], img1:'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop', tag:'New', delivery:'3-day delivery', stock:'in' },
  { id:'p23', name:'Two-Piece Formal Suit', brand:'SAVILE HOUSE', category:'blazers', occasion:'formal-wear', age:['26-35','36-45','45+'], price:8999, mrp:13999, rating:4.7, reviews:112, colors:['#1A2333','#334155'], sizes:['M','L','XL'], oos:[], img1:'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop', tag:'Premium', delivery:'5-day delivery', stock:'low' },
  { id:'p24', name:'Nehru Collar Kurta', brand:'HERITAGE LOOM', category:'ethnic-wear', occasion:'ethnic-wear', age:['18-25','26-35','36-45','45+'], price:1899, mrp:2999, rating:4.5, reviews:322, colors:['#F4EDE1','#556B2F','#1A2333'], sizes:['S','M','L','XL','XXL'], oos:[], img1:'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=600&auto=format&fit=crop', img2:'https://images.unsplash.com/photo-1610030181087-540a4bde3e6d?q=80&w=600&auto=format&fit=crop', tag:'Bestseller', delivery:'4-day delivery', stock:'in' },
];

/* ---------------------------------------------------------------
   STORE — cart / wishlist / recently viewed, persisted to localStorage
   --------------------------------------------------------------- */
const Store = {
  read(key){ try{ return JSON.parse(localStorage.getItem(key)) || []; }catch(e){ return []; } },
  write(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} },

  getCart(){ return this.read('mf_cart'); },
  setCart(c){ this.write('mf_cart', c); this.syncCounts(); },
  addToCart(item){
    const cart = this.getCart();
    const existing = cart.find(c => c.id === item.id && c.size === item.size && c.color === item.color);
    if (existing) existing.qty += item.qty || 1;
    else cart.push(Object.assign({ qty: 1 }, item));
    this.setCart(cart);
  },

  getWishlist(){ return this.read('mf_wishlist'); },
  setWishlist(w){ this.write('mf_wishlist', w); this.syncCounts(); },
  toggleWishlist(id){
    let w = this.getWishlist();
    if (w.includes(id)) w = w.filter(x => x !== id);
    else w.push(id);
    this.setWishlist(w);
    return w.includes(id);
  },

  getRecentlyViewed(){ return this.read('mf_recent'); },
  addRecentlyViewed(id){
    let r = this.getRecentlyViewed().filter(x => x !== id);
    r.unshift(id);
    r = r.slice(0, 8);
    this.write('mf_recent', r);
  },

  getCompare(){ return this.read('mf_compare'); },
  toggleCompare(id){
    let c = this.getCompare();
    if (c.includes(id)) c = c.filter(x => x !== id);
    else if (c.length < 4) c.push(id);
    else return { added:false, full:true };
    this.write('mf_compare', c);
    return { added:c.includes(id), full:false };
  },

  syncCounts(){
    document.querySelectorAll('.cart-count').forEach(el => {
      const n = this.getCart().reduce((s,c) => s + c.qty, 0);
      el.textContent = n;
      el.style.display = n > 0 ? 'flex' : 'none';
    });
    document.querySelectorAll('.wishlist-count').forEach(el => {
      const n = this.getWishlist().length;
      el.textContent = n;
      el.style.display = n > 0 ? 'flex' : 'none';
    });
  }
};

function findProduct(id){ return CATALOG.find(p => p.id === id); }

function fmtPrice(n){ return '₹' + n.toLocaleString('en-IN'); }

function starString(rating){
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = '';
  for (let i=0;i<full;i++) s += '<i class="fa-solid fa-star"></i>';
  if (half) s += '<i class="fa-solid fa-star-half-stroke"></i>';
  for (let i=full+(half?1:0); i<5; i++) s += '<i class="fa-regular fa-star"></i>';
  return s;
}

/* ---------------------------------------------------------------
   TOASTS
   --------------------------------------------------------------- */
function showToast(msg, type){
  let stack = document.getElementById('toastStack');
  if (!stack){
    stack = document.createElement('div');
    stack.id = 'toastStack';
    document.body.appendChild(stack);
  }
  const t = document.createElement('div');
  t.className = 'toast' + (type === 'warn' ? ' warn' : '');
  t.innerHTML = `<i class="fa-solid ${type === 'warn' ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i><span>${msg}</span>`;
  stack.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 3200);
}
window.showToast = showToast;

/* ---------------------------------------------------------------
   DOM READY — shared header/footer behaviours
   --------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  Store.syncCounts();

  /* ---------- Page loader ---------- */
  const loader = document.getElementById('pageLoader');
  if (loader){
    window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 350));
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.querySelector('.site-header');
  const onScrollHeader = () => header && header.classList.toggle('scrolled', window.scrollY > 20);
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive:true });

  /* ---------- Dark mode toggle ---------- */
  const themeToggle = document.querySelector('.theme-toggle');
  const applyTheme = (mode) => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('mf_theme', mode);
    if (themeToggle) themeToggle.innerHTML = mode === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  };
  applyTheme(localStorage.getItem('mf_theme') || 'light');
  themeToggle && themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Mobile drawer ---------- */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileClose = document.querySelector('.mobile-drawer-close');
  mobileToggle && mobileToggle.addEventListener('click', () => mobileDrawer.classList.add('open'));
  mobileClose && mobileClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));
  mobileDrawer && mobileDrawer.querySelector('.mobile-drawer-backdrop').addEventListener('click', () => mobileDrawer.classList.remove('open'));

  /* ---------- Live search (header) ---------- */
  const searchInput = document.querySelector('.search-bar input');
  const searchPanel = document.querySelector('.live-search-panel');
  if (searchInput && searchPanel){
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q){ searchPanel.classList.remove('open'); return; }
      const matches = CATALOG.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.includes(q));
      searchPanel.innerHTML = matches.length
        ? matches.slice(0,6).map(p => `
            <a class="lsp-item" href="product.html?id=${p.id}">
              <img src="${p.img1}" alt="${p.name}">
              <span><span class="lsp-name">${p.name}</span><span class="lsp-cat" style="display:block;">${p.brand}</span></span>
              <span class="lsp-price">${fmtPrice(p.price)}</span>
            </a>`).join('')
        : '<p class="lsp-empty">No products found for "' + q + '"</p>';
      searchPanel.classList.add('open');
    });
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchPanel.contains(e.target)) searchPanel.classList.remove('open');
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold:.12, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop){
    window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 500), { passive:true });
    backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  }

  /* ---------- Newsletter ---------- */
  const newsForm = document.querySelector('.newsletter-form');
  newsForm && newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed! Watch your inbox for offers.');
    newsForm.reset();
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('.current-year').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- Global wishlist / compare buttons (product cards) ---------- */
  document.body.addEventListener('click', (e) => {
    const wbtn = e.target.closest('.p-wishlist');
    if (wbtn){
      e.preventDefault();
      const id = wbtn.dataset.id;
      const active = Store.toggleWishlist(id);
      wbtn.classList.toggle('active', active);
      showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
    }
    const cbtn = e.target.closest('.p-compare');
    if (cbtn){
      e.preventDefault();
      const id = cbtn.dataset.id;
      const res = Store.toggleCompare(id);
      if (res.full){ showToast('You can compare up to 4 products', 'warn'); }
      else {
        cbtn.classList.toggle('active', res.added);
        showToast(res.added ? 'Added to compare' : 'Removed from compare');
      }
    }
    const qbtn = e.target.closest('.p-quick');
    if (qbtn && qbtn.dataset.id){
      e.preventDefault();
      openQuickView(qbtn.dataset.id);
    }
    const cartBtn = e.target.closest('.js-add-cart');
    if (cartBtn){
      e.preventDefault();
      const id = cartBtn.dataset.id;
      const p = findProduct(id);
      if (p){
        Store.addToCart({ id:p.id, name:p.name, brand:p.brand, price:p.price, mrp:p.mrp, img:p.img1, size:p.sizes.find(s=>!p.oos.includes(s))||p.sizes[0], color:p.colors[0], qty:1 });
        showToast(p.name + ' added to cart');
      }
    }
  });

  /* ---------- Quick View Modal ---------- */
  function openQuickView(id){
    const p = findProduct(id);
    if (!p) return;
    let backdrop = document.getElementById('quickViewModal');
    if (!backdrop){
      backdrop = document.createElement('div');
      backdrop.id = 'quickViewModal';
      backdrop.className = 'modal-backdrop';
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.classList.remove('open'); });
    }
    const offPct = Math.round((1-p.price/p.mrp)*100);
    backdrop.innerHTML = `
      <div class="modal-box">
        <button class="icon-btn modal-close"><i class="fa-solid fa-xmark"></i></button>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;">
          <img src="${p.img1}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;min-height:360px;">
          <div style="padding:32px;">
            <span class="p-brand">${p.brand}</span>
            <h3 style="margin:6px 0 10px;font-size:1.3rem;">${p.name}</h3>
            <div class="p-rating" style="margin-bottom:14px;"><span class="stars">${p.rating} <i class="fa-solid fa-star" style="font-size:.65rem;"></i></span><span class="count">${p.reviews} reviews</span></div>
            <div class="p-price-row" style="margin-bottom:18px;">
              <span class="p-price">${fmtPrice(p.price)}</span>
              <span class="p-mrp">${fmtPrice(p.mrp)}</span>
              <span class="p-off">${offPct}% off</span>
            </div>
            <div style="display:flex;gap:10px;margin-bottom:20px;">
              <a href="product.html?id=${p.id}" class="btn outline block">View Full Details</a>
            </div>
            <button class="btn primary block js-add-cart" data-id="${p.id}"><i class="fa-solid fa-cart-shopping"></i> Add to Cart</button>
          </div>
        </div>
      </div>`;
    backdrop.classList.add('open');
    backdrop.querySelector('.modal-close').addEventListener('click', () => backdrop.classList.remove('open'));
  }
  window.openQuickView = openQuickView;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  });
});

/* ---------------------------------------------------------------
   Render a product card (shared across home/collection/product rails)
   --------------------------------------------------------------- */
function renderProductCard(p){
  const wishlisted = Store.getWishlist().includes(p.id);
  const compared = Store.getCompare().includes(p.id);
  const offPct = Math.round((1 - p.price / p.mrp) * 100);
  const lowStock = p.stock === 'low';
  return `
  <div class="p-card reveal" data-id="${p.id}" data-category="${p.category}" data-occasion="${p.occasion}" data-age='${JSON.stringify(p.age)}' data-price="${p.price}" data-rating="${p.rating}" data-name="${p.name.toLowerCase()}" data-brand="${p.brand}" data-colors="${p.colors.length}">
    <div class="p-media">
      <a href="product.html?id=${p.id}">
        <img class="img-a" src="${p.img1}" alt="${p.name}" loading="lazy">
        <img class="img-b" src="${p.img2}" alt="${p.name} alternate view" loading="lazy">
      </a>
      <div class="p-badges">
        ${p.tag ? `<span class="badge ${p.tag === 'Sale' ? 'deal' : 'primary'}">${p.tag}</span>` : ''}
        ${offPct >= 30 ? `<span class="badge gold">${offPct}% OFF</span>` : ''}
        ${lowStock ? `<span class="badge low-stock">Only Few Left</span>` : ''}
      </div>
      <div class="p-card-tools">
        <button class="p-wishlist ${wishlisted ? 'active' : ''}" data-id="${p.id}" aria-label="Add to wishlist"><i class="fa-${wishlisted ? 'solid' : 'regular'} fa-heart"></i></button>
        <button class="p-compare ${compared ? 'active' : ''}" data-id="${p.id}" aria-label="Add to compare" title="Compare"><i class="fa-solid fa-code-compare"></i></button>
      </div>
      <button class="p-quick" data-id="${p.id}"><i class="fa-solid fa-eye"></i> Quick View</button>
    </div>
    <div class="p-info">
      <span class="p-brand">${p.brand}</span>
      <a href="product.html?id=${p.id}"><h4 class="p-name">${p.name}</h4></a>
      <div class="p-rating"><span class="stars">${p.rating} <i class="fa-solid fa-star" style="font-size:.6rem;"></i></span><span class="count">(${p.reviews})</span></div>
      <div class="p-price-row">
        <span class="p-price">${fmtPrice(p.price)}</span>
        <span class="p-mrp">${fmtPrice(p.mrp)}</span>
        <span class="p-off">${offPct}% off</span>
      </div>
      <span class="p-delivery"><i class="fa-solid fa-truck-fast"></i> ${p.delivery}</span>
      <div class="p-fit">
        <div class="p-fit-radar">
          ${p.sizes.slice(0,5).map(s => `<span class="${p.oos.includes(s)?'':'avail'}">${s}</span>`).join('')}
        </div>
      </div>
      <div class="p-actions-row">
        <button class="btn outline js-add-cart" data-id="${p.id}"><i class="fa-solid fa-cart-plus"></i> Cart</button>
        <a class="btn primary" href="product.html?id=${p.id}">Buy Now</a>
      </div>
    </div>
  </div>`;
}
window.renderProductCard = renderProductCard;
window.CATALOG = CATALOG;
window.Store = Store;
window.findProduct = findProduct;
window.fmtPrice = fmtPrice;
window.starString = starString;


/* ---------------------------------------------------------------
   Merge any products added via Add Product page (persisted)
   --------------------------------------------------------------- */
(function mergeAddedProducts(){
  try{
    const added = JSON.parse(localStorage.getItem('mf_added_products')) || [];
    added.forEach(p => {
      if (!CATALOG.find(c => c.id === p.id)) CATALOG.push(p);
    });
  }catch(e){}
})();
