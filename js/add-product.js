/* ==========================================================================
   ADD-PRODUCT.JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('addProductForm');
  const previewWrap = document.getElementById('apPreview');
  const previewCard = document.getElementById('apPreviewCard');

  document.getElementById('apAddColor').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'ap-color-input';
    input.value = '#334155';
    document.getElementById('apColorRow').insertBefore(input, document.getElementById('apAddColor'));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('apName').value.trim();
    const brand = document.getElementById('apBrand').value.trim().toUpperCase();
    const category = document.getElementById('apCategory').value;
    const occasion = document.getElementById('apOccasion').value;
    const price = parseInt(document.getElementById('apPrice').value, 10);
    const mrp = parseInt(document.getElementById('apMrp').value, 10);
    const img1 = document.getElementById('apImg1').value.trim();
    const img2 = document.getElementById('apImg2').value.trim() || img1;
    const tag = document.getElementById('apTag').value;

    const sizes = Array.from(document.querySelectorAll('.ap-size-row input:checked')).map(cb => cb.value);
    const colors = Array.from(document.querySelectorAll('.ap-color-input')).map(c => c.value);

    if (!name || !brand || !category || !occasion || !price || !mrp || !img1){
      showToast('Please fill in all required fields', 'warn');
      return;
    }
    if (!sizes.length){
      showToast('Select at least one size', 'warn');
      return;
    }
    if (mrp <= price){
      showToast('MRP must be greater than selling price', 'warn');
      return;
    }

    const newId = 'p' + String(CATALOG.length + 1).padStart(2, '0') + '-' + Date.now().toString(36);
    const newProduct = {
      id: newId,
      name, brand, category, occasion,
      age: ['18-25','26-35','36-45'],
      price, mrp,
      rating: 4.0,
      reviews: 0,
      colors: colors.length ? colors : ['#1A2333'],
      sizes,
      oos: [],
      img1, img2,
      tag,
      delivery: '3-day delivery',
      stock: 'in'
    };

    CATALOG.push(newProduct);

    previewWrap.style.display = 'block';
    previewCard.innerHTML = renderProductCard(newProduct);
    previewWrap.scrollIntoView({ behavior:'smooth', block:'start' });

    showToast(name + ' added to catalog!');
    form.reset();
    document.querySelectorAll('.ap-size-row input:checked').forEach(cb => cb.checked = false);
  });

});
