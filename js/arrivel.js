/* ==========================================================================
   NEW-ARRIVALS.JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const grid = document.getElementById('newArrivalsGrid');
  const noResults = document.getElementById('noResultsMsg');
  const resultCount = document.getElementById('resultCount');
  const sortSelect = document.getElementById('sortSelect');

  function getNewArrivals(){
    // Products tagged "New" — plus anything just added via Add Product page
    return CATALOG.filter(p => p.tag === 'New');
  }

  function getSorted(list, sort){
    const arr = [...list];
    switch(sort){
      case 'low-high': arr.sort((a,b) => a.price - b.price); break;
      case 'high-low': arr.sort((a,b) => b.price - a.price); break;
      case 'rating': arr.sort((a,b) => b.rating - a.rating); break;
      default: break; // newest = catalog order (latest pushed items last, so reverse)
    }
    if (sort === 'newest') arr.reverse();
    return arr;
  }

  function render(){
    const items = getSorted(getNewArrivals(), sortSelect.value);
    resultCount.textContent = items.length;
    noResults.classList.toggle('show', items.length === 0);
    grid.innerHTML = items.map(renderProductCard).join('');
    grid.querySelectorAll('.p-card').forEach(el => el.classList.add('in-view'));
  }

  sortSelect.addEventListener('change', render);

  render();
});

CATALOG.push(newProduct);

// persist so it survives page navigation
try{
  const added = JSON.parse(localStorage.getItem('mf_added_products')) || [];
  added.push(newProduct);
  localStorage.setItem('mf_added_products', JSON.stringify(added));
}catch(e){}