/* ==========================================================================
   COLLECTION.JS — age group + category + sidebar filters, sort, pagination
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const grid = document.getElementById('collectionGrid');
  const noResults = document.getElementById('noResultsMsg');
  const resultCount = document.getElementById('resultCount');
  const pagination = document.getElementById('pagination');
  const activeChipsWrap = document.getElementById('activeFilterChips');
  const PAGE_SIZE = 8;
  let currentPage = 1;

  const state = {
    age: 'all',
    cat: 'all',
    brands: new Set(),
    colors: new Set(),
    sizes: new Set(),
    occasions: new Set(),
    maxPrice: 15000,
    minRating: 0,
    minDiscount: 0,
    sort: 'popular'
  };

  /* ---------------- Read URL params on load ---------------- */
  const params = new URLSearchParams(window.location.search);
  if (params.get('cat')) state.cat = params.get('cat');
  if (params.get('occasion')) state.occasions.add(params.get('occasion'));
  if (params.get('age')) state.age = params.get('age');

  /* ---------------- Build dynamic filter bodies ---------------- */
  const brands = [...new Set(CATALOG.map(p => p.brand))];
  document.getElementById('brandFilterBody').innerHTML = brands.map(b =>
    `<label class="check-row"><input type="checkbox" value="${b}" data-role="brand"> ${b} <span class="cnt">${CATALOG.filter(p=>p.brand===b).length}</span></label>`
  ).join('');

  const allColors = [...new Set(CATALOG.flatMap(p => p.colors))];
  document.getElementById('colorFilterBody').innerHTML = allColors.map(c =>
    `<span class="swatch" style="background:${c};" data-color="${c}" title="${c}"></span>`
  ).join('');

  // reflect initial occasion state onto checkboxes
  document.querySelectorAll('#occasionFilterBody input').forEach(cb => {
    if (state.occasions.has(cb.value)) cb.checked = true;
  });

  // reflect initial category tab
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === state.cat));

  // reflect initial age chip (in case of ?age= deep link)
  document.querySelectorAll('.age-chip').forEach(t => t.classList.toggle('active', t.dataset.age === state.age));

  /* ---------------- Filtering logic ---------------- */
  function getFiltered(){
    return CATALOG.filter(p => {
      if (state.age !== 'all' && !p.age.includes(state.age)) return false;
      if (state.cat !== 'all' && p.category !== state.cat) return false;
      if (state.brands.size && !state.brands.has(p.brand)) return false;
      if (state.colors.size && !p.colors.some(c => state.colors.has(c))) return false;
      if (state.sizes.size && !p.sizes.some(s => state.sizes.has(s) && !p.oos.includes(s))) return false;
      if (state.occasions.size && !state.occasions.has(p.occasion)) return false;
      if (p.price > state.maxPrice) return false;
      if (p.rating < state.minRating) return false;
      const discount = (1 - p.price/p.mrp) * 100;
      if (discount < state.minDiscount) return false;
      return true;
    });
  }

  function getSorted(list){
    const arr = [...list];
    switch(state.sort){
      case 'low-high': arr.sort((a,b) => a.price - b.price); break;
      case 'high-low': arr.sort((a,b) => b.price - a.price); break;
      case 'rating': arr.sort((a,b) => b.rating - a.rating); break;
      case 'newest': arr.sort((a,b) => (b.tag==='New') - (a.tag==='New')); break;
      default: arr.sort((a,b) => b.reviews - a.reviews);
    }
    return arr;
  }

  /* ---------------- Active filter chips ---------------- */
  function renderActiveChips(){
    if (!activeChipsWrap) return;
    const chips = [];
    if (state.cat !== 'all') chips.push({ label: state.cat.replace('-',' '), clear: () => { state.cat='all'; document.querySelectorAll('.cat-tab').forEach((b,i)=>b.classList.toggle('active', i===0)); } });
    if (state.age !== 'all') chips.push({ label: state.age, clear: () => { state.age='all'; document.querySelectorAll('.age-chip').forEach((b,i)=>b.classList.toggle('active', i===0)); } });
    state.brands.forEach(b => chips.push({ label: b, clear: () => { state.brands.delete(b); document.querySelectorAll(`#brandFilterBody input[value="${b}"]`).forEach(cb=>cb.checked=false); } }));
    state.occasions.forEach(o => chips.push({ label: o.replace('-',' '), clear: () => { state.occasions.delete(o); document.querySelectorAll(`#occasionFilterBody input[value="${o}"]`).forEach(cb=>cb.checked=false); } }));
    state.sizes.forEach(s => chips.push({ label: 'Size ' + s, clear: () => { state.sizes.delete(s); document.querySelectorAll(`.size-chip[data-size="${s}"]`).forEach(c=>c.classList.remove('active')); } }));
    state.colors.forEach(c => chips.push({ label: 'Color', clear: () => { state.colors.delete(c); document.querySelectorAll(`.swatch[data-color="${c}"]`).forEach(sw=>sw.classList.remove('selected')); } }));
    if (state.maxPrice < 15000) chips.push({ label: 'Under ' + fmtPrice(state.maxPrice), clear: () => { state.maxPrice=15000; document.getElementById('priceSlider').value=15000; document.getElementById('priceSliderVal').textContent='₹15,000'; } });
    if (state.minRating > 0) chips.push({ label: state.minRating + '★ & above', clear: () => { state.minRating=0; document.querySelector('input[name=ratingFilter][value="0"]').checked=true; } });
    if (state.minDiscount > 0) chips.push({ label: state.minDiscount + '% off or more', clear: () => { state.minDiscount=0; document.querySelectorAll('#discountFilterBody input').forEach(cb=>cb.checked=false); } });

    activeChipsWrap.style.display = chips.length ? 'flex' : 'none';
    activeChipsWrap.innerHTML = chips.map((c,i) => `<span class="active-chip" data-idx="${i}">${c.label}<i class="fa-solid fa-xmark"></i></span>`).join('');
    activeChipsWrap.querySelectorAll('.active-chip').forEach((el,i) => {
      el.addEventListener('click', () => { chips[i].clear(); currentPage = 1; render(); });
    });
  }

  function render(){
    const filtered = getSorted(getFiltered());
    resultCount.textContent = filtered.length;
    noResults.classList.toggle('show', filtered.length === 0);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = 1;
    const pageItems = filtered.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);

    grid.innerHTML = pageItems.map(renderProductCard).join('');
    grid.querySelectorAll('.p-card').forEach(el => el.classList.add('in-view')); // already-filtered results show immediately

    renderPagination(totalPages);
    renderActiveChips();
  }

  function renderPagination(totalPages){
    if (totalPages <= 1){ pagination.innerHTML = ''; return; }
    let html = `<button data-p="${currentPage-1}" ${currentPage===1?'disabled':''}><i class="fa-solid fa-chevron-left"></i></button>`;
    for (let i=1;i<=totalPages;i++){
      html += `<button data-p="${i}" class="${i===currentPage?'active':''}">${i}</button>`;
    }
    html += `<button data-p="${currentPage+1}" ${currentPage===totalPages?'disabled':''}><i class="fa-solid fa-chevron-right"></i></button>`;
    pagination.innerHTML = html;
  }

  pagination.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.disabled) return;
    currentPage = parseInt(btn.dataset.p, 10);
    render();
    window.scrollTo({ top: document.querySelector('.collection-toolbar').offsetTop - 100, behavior:'smooth' });
  });

  /* ---------------- Age group buttons ---------------- */
  document.querySelectorAll('.age-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.age-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.age = btn.dataset.age;
      currentPage = 1;
      render();
    });
  });

  /* ---------------- Category tabs ---------------- */
  document.querySelectorAll('.cat-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.cat = btn.dataset.cat;
      currentPage = 1;
      render();
    });
  });

  /* ---------------- Brand / occasion checkboxes ---------------- */
  document.getElementById('brandFilterBody').addEventListener('change', (e) => {
    if (e.target.type !== 'checkbox') return;
    e.target.checked ? state.brands.add(e.target.value) : state.brands.delete(e.target.value);
    currentPage = 1; render();
  });
  document.getElementById('occasionFilterBody').addEventListener('change', (e) => {
    if (e.target.type !== 'checkbox') return;
    e.target.checked ? state.occasions.add(e.target.value) : state.occasions.delete(e.target.value);
    currentPage = 1; render();
  });
  document.getElementById('discountFilterBody').addEventListener('change', (e) => {
    const checked = Array.from(document.querySelectorAll('#discountFilterBody input:checked')).map(c => parseInt(c.value,10));
    state.minDiscount = checked.length ? Math.min(...checked) : 0;
    currentPage = 1; render();
  });
  document.getElementById('ratingFilterBody').addEventListener('change', (e) => {
    state.minRating = parseInt(e.target.value, 10);
    currentPage = 1; render();
  });

  /* ---------------- Color swatches ---------------- */
  document.getElementById('colorFilterBody').addEventListener('click', (e) => {
    const sw = e.target.closest('.swatch');
    if (!sw) return;
    sw.classList.toggle('selected');
    const c = sw.dataset.color;
    sw.classList.contains('selected') ? state.colors.add(c) : state.colors.delete(c);
    currentPage = 1; render();
  });

  /* ---------------- Size chips ---------------- */
  document.querySelectorAll('.size-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const s = chip.dataset.size;
      chip.classList.contains('active') ? state.sizes.add(s) : state.sizes.delete(s);
      currentPage = 1; render();
    });
  });

  /* ---------------- Price slider ---------------- */
  const priceSlider = document.getElementById('priceSlider');
  const priceSliderVal = document.getElementById('priceSliderVal');
  priceSlider.addEventListener('input', () => {
    state.maxPrice = parseInt(priceSlider.value, 10);
    priceSliderVal.textContent = fmtPrice(state.maxPrice);
    currentPage = 1; render();
  });

  /* ---------------- Sort ---------------- */
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    state.sort = e.target.value;
    render();
  });

  /* ---------------- Collapsible filter groups ---------------- */
  document.querySelectorAll('.filter-group-title').forEach(title => {
    title.addEventListener('click', () => title.parentElement.classList.toggle('collapsed'));
  });

  /* ---------------- Clear all filters ---------------- */
  document.getElementById('clearFilters').addEventListener('click', () => {
    state.age='all'; state.cat='all'; state.brands.clear(); state.colors.clear();
    state.sizes.clear(); state.occasions.clear(); state.maxPrice=15000; state.minRating=0; state.minDiscount=0;
    document.querySelectorAll('.age-chip').forEach((b,i) => b.classList.toggle('active', i===0));
    document.querySelectorAll('.cat-tab').forEach((b,i) => b.classList.toggle('active', i===0));
    document.querySelectorAll('#filterSidebar input[type=checkbox]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.swatch.selected').forEach(sw => sw.classList.remove('selected'));
    document.querySelectorAll('.size-chip.active').forEach(sc => sc.classList.remove('active'));
    priceSlider.value = 15000; priceSliderVal.textContent = '₹15,000';
    document.querySelector('input[name=ratingFilter][value="0"]').checked = true;
    currentPage = 1; render();
  });

  noResults.querySelector('.no-results-clear') && noResults.querySelector('.no-results-clear').addEventListener('click', () => {
    document.getElementById('clearFilters').click();
  });

  /* ---------------- Mobile filter drawer ---------------- */
  const filterSidebar = document.getElementById('filterSidebar');
  const filterFab = document.getElementById('filterFab');
  const filterBackdrop = document.querySelector('.filter-backdrop');
  filterFab.addEventListener('click', () => { filterSidebar.classList.add('open'); filterBackdrop.classList.add('open'); });
  filterBackdrop.addEventListener('click', () => { filterSidebar.classList.remove('open'); filterBackdrop.classList.remove('open'); });

  /* ---------------- Recently viewed rail ---------------- */
  const recentIds = Store.getRecentlyViewed();
  if (recentIds.length){
    document.getElementById('recentlyViewedSection').style.display = 'block';
    document.getElementById('recentlyViewedRow').innerHTML = recentIds.map(id => findProduct(id)).filter(Boolean).map(renderProductCard).join('');
  }

  render();
});
