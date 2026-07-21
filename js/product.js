/* ==========================================================================
   PRODUCT.JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || CATALOG[0].id;
  const p = findProduct(id) || CATALOG[0];
  let qty = 1;
  let selectedColor = p.colors[0];
  let selectedSize = p.sizes.find(s => !p.oos.includes(s)) || p.sizes[0];

  Store.addRecentlyViewed(p.id);

  /* ---------------- Breadcrumb ---------------- */
  document.getElementById('pdBreadcrumb').innerHTML = `
    <a href="index.html">Home</a><span class="sep">/</span>
    <a href="collection.html">Shop</a><span class="sep">/</span>
    <a href="collection.html?cat=${p.category}">${p.category.replace('-',' ')}</a><span class="sep">/</span>
    <span class="current">${p.name}</span>`;

  /* ---------------- Gallery ---------------- */
  const images = [p.img1, p.img2, p.img1, p.img2];
  document.getElementById('pdThumbs').innerHTML = images.map((img, i) =>
    `<div class="pd-thumb ${i===0?'active':''}" data-idx="${i}"><img src="${img}" alt="${p.name} view ${i+1}"></div>`
  ).join('');
  const mainImg = document.getElementById('pdMainImg');
  mainImg.src = images[0];
  mainImg.alt = p.name;

  document.getElementById('pdThumbs').addEventListener('click', (e) => {
    const thumb = e.target.closest('.pd-thumb');
    if (!thumb) return;
    document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    mainImg.src = images[thumb.dataset.idx];
  });

  /* ---------------- Zoom on hover ---------------- */
  const mainMedia = document.getElementById('pdMainMedia');
  mainMedia.addEventListener('mousemove', (e) => {
    const rect = mainMedia.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mainImg.style.transformOrigin = `${x}% ${y}%`;
    mainMedia.classList.add('zoomed');
  });
  mainMedia.addEventListener('mouseleave', () => mainMedia.classList.remove('zoomed'));

  /* ---------------- Info fill ---------------- */
  const offPct = Math.round((1 - p.price/p.mrp)*100);
  document.getElementById('pdBrand').textContent = p.brand;
  document.getElementById('pdBrandSeller').textContent = p.brand;
  document.getElementById('pdName').textContent = p.name;
  document.getElementById('pdRatingBadge').innerHTML = `${p.rating} <i class="fa-solid fa-star" style="font-size:.65rem;"></i>`;
  document.getElementById('pdReviewCount').textContent = `${p.reviews} Ratings & Reviews`;
  document.getElementById('pdStock').textContent = p.stock === 'low' ? '· Only a few left!' : '· In Stock';
  document.getElementById('pdPrice').textContent = fmtPrice(p.price);
  document.getElementById('pdMrp').textContent = fmtPrice(p.mrp);
  document.getElementById('pdOff').textContent = offPct + '% off';
  document.getElementById('pdEmi').textContent = fmtPrice(Math.round(p.price/6));
  document.title = p.name + ' — Rovaire';

  document.getElementById('pdDescription').textContent =
    `The ${p.name} from ${p.brand} blends considered tailoring with everyday comfort. Designed for versatility, ` +
    `it moves easily from one part of your day to the next without losing its shape or finish. A wardrobe staple built to last.`;

  document.getElementById('pdSpecTable').innerHTML = `
    <tr><td>Brand</td><td>${p.brand}</td></tr>
    <tr><td>Category</td><td style="text-transform:capitalize;">${p.category.replace('-',' ')}</td></tr>
    <tr><td>Occasion</td><td style="text-transform:capitalize;">${p.occasion.replace('-',' ')}</td></tr>
    <tr><td>Available Sizes</td><td>${p.sizes.join(', ')}</td></tr>
    <tr><td>Country of Origin</td><td>India</td></tr>
    <tr><td>Care</td><td>Machine wash</td></tr>`;

  /* ---------------- Colors ---------------- */
  const colorNames = { '#1A2333':'Midnight', '#FFFFFF':'White', '#7C8AA5':'Steel Blue', '#2B3A55':'Navy', '#111111':'Black', '#5B4636':'Espresso', '#FF4D6D':'Rose', '#C9B48A':'Sand', '#556B2F':'Olive', '#5B6B7C':'Slate', '#8A0F1A':'Maroon', '#4A2E1E':'Brown', '#F4EDE1':'Ivory', '#B8C4D6':'Powder Blue', '#334155':'Charcoal', '#5B5B5B':'Grey', '#2B6CB0':'Cobalt' };
  document.getElementById('pdColorName').textContent = colorNames[selectedColor] || '';
  document.getElementById('pdColors').innerHTML = p.colors.map(c =>
    `<span class="pd-color ${c===selectedColor?'active':''}" style="background:${c};" data-color="${c}" title="${colorNames[c]||c}"></span>`
  ).join('');
  document.getElementById('pdColors').addEventListener('click', (e) => {
    const sw = e.target.closest('.pd-color');
    if (!sw) return;
    selectedColor = sw.dataset.color;
    document.querySelectorAll('.pd-color').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    document.getElementById('pdColorName').textContent = colorNames[selectedColor] || '';
  });

  /* ---------------- Sizes ---------------- */
  document.getElementById('pdSizes').innerHTML = p.sizes.map(s => {
    const oos = p.oos.includes(s);
    return `<button class="pd-size ${s===selectedSize?'active':''} ${oos?'oos':''}" data-size="${s}" ${oos?'disabled':''}>${s}</button>`;
  }).join('');
  document.getElementById('pdSizes').addEventListener('click', (e) => {
    const btn = e.target.closest('.pd-size');
    if (!btn || btn.disabled) return;
    selectedSize = btn.dataset.size;
    document.querySelectorAll('.pd-size').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
  document.getElementById('sizeGuideLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.pd-tab-btn[data-tab="size"]').click();
    document.querySelector('.pd-tabs').scrollIntoView({ behavior:'smooth', block:'start' });
  });

  /* ---------------- Quantity ---------------- */
  const qtyVal = document.getElementById('qtyVal');
  document.getElementById('qtyMinus').addEventListener('click', () => { if (qty>1){ qty--; qtyVal.textContent = qty; } });
  document.getElementById('qtyPlus').addEventListener('click', () => { if (qty<10){ qty++; qtyVal.textContent = qty; } });

  /* ---------------- Wishlist ---------------- */
  const wishBtn = document.getElementById('pdWishlistBtn');
  const isWished = Store.getWishlist().includes(p.id);
  wishBtn.classList.toggle('active', isWished);
  wishBtn.innerHTML = `<i class="fa-${isWished?'solid':'regular'} fa-heart"></i>`;
  wishBtn.addEventListener('click', () => {
    const active = Store.toggleWishlist(p.id);
    wishBtn.classList.toggle('active', active);
    wishBtn.innerHTML = `<i class="fa-${active?'solid':'regular'} fa-heart"></i>`;
    showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
  });

  /* ---------------- Add to cart / Buy now ---------------- */
  function buildCartItem(){
    return { id:p.id, name:p.name, brand:p.brand, price:p.price, mrp:p.mrp, img:p.img1, size:selectedSize, color:selectedColor, qty };
  }
  document.getElementById('pdAddCartBtn').addEventListener('click', () => {
    Store.addToCart(buildCartItem());
    showToast(p.name + ' added to cart');
  });
  document.getElementById('pdBuyNowBtn').addEventListener('click', () => {
    Store.addToCart(buildCartItem());
    window.location.href = 'cart.html';
  });

  /* ---------------- Pincode delivery check ---------------- */
  document.getElementById('pincodeCheckBtn').addEventListener('click', () => {
    const val = document.getElementById('pincodeInput').value.trim();
    const resultEl = document.getElementById('pincodeResult');
    if (!/^\d{6}$/.test(val)){
      showToast('Please enter a valid 6-digit pincode', 'warn');
      return;
    }
    resultEl.querySelector('span').textContent = `Delivery available — expected in 2-4 business days to ${val}.`;
    resultEl.classList.add('show');
  });

  /* ---------------- Tabs ---------------- */
  document.querySelectorAll('.pd-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pd-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.pd-tab-panel').forEach(pnl => pnl.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`.pd-tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    });
  });

  /* ---------------- Reviews ---------------- */
  document.getElementById('pdReviewScore').textContent = p.rating;
  document.getElementById('pdReviewStars').innerHTML = starString(p.rating);
  document.getElementById('pdReviewTotal').textContent = `${p.reviews} ratings`;
  const sampleReviews = [
    { name:'Aravind K.', rating:5, days:6, text:'Excellent fit and the fabric feels premium. Delivery was quick too.' },
    { name:'Sanjay M.', rating:4, days:14, text:'Good quality overall, sizing runs slightly large so consider one size down.' },
    { name:'Deepak R.', rating:5, days:22, text:'Exactly as pictured. Have ordered two more in different colors already.' },
  ];
  document.getElementById('pdReviewsList').innerHTML = sampleReviews.map(r => `
    <div class="review-item">
      <div class="review-item-head"><span class="stars">${r.rating}★</span><b>${r.name}</b><span>${r.days} days ago</span></div>
      <p>${r.text}</p>
    </div>`).join('');

  /* ---------------- Frequently bought together ---------------- */
  const fbt = CATALOG.filter(x => x.id !== p.id && x.occasion === p.occasion).slice(0,4);
  document.getElementById('fbtRow').innerHTML = (fbt.length ? fbt : CATALOG.filter(x=>x.id!==p.id).slice(0,4)).map(renderProductCard).join('');

  /* ---------------- Similar products ---------------- */
  const similar = CATALOG.filter(x => x.id !== p.id && x.category === p.category);
  const similarFallback = CATALOG.filter(x => x.id !== p.id).slice(0,5);
  document.getElementById('similarRow').innerHTML = (similar.length ? similar : similarFallback).slice(0,5).map(renderProductCard).join('');

  /* ---------------- Recently viewed ---------------- */
  const recentIds = Store.getRecentlyViewed().filter(rid => rid !== p.id);
  if (recentIds.length){
    document.getElementById('recentlyViewedSection').style.display = 'block';
    document.getElementById('recentlyViewedRow').innerHTML = recentIds.map(findProduct).filter(Boolean).map(renderProductCard).join('');
  }

});
