/* ==========================================================================
   CART.JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const COUPONS = { 'ROVAIRE10': { pct:10, label:'ROVAIRE10 applied — 10% off' }, 'WELCOME50': { flat:500, label:'WELCOME50 applied — ₹500 off' } };
  let appliedCoupon = null;

  function getSaved(){ return Store.read('mf_saved'); }
  function setSaved(s){ Store.write('mf_saved', s); }

  function renderCartItem(item, idx){
    return `
    <div class="cart-item" data-idx="${idx}">
      <a href="product.html?id=${item.id}"><img src="${item.img}" alt="${item.name}"></a>
      <div>
        <a href="product.html?id=${item.id}"><div class="cart-item-name">${item.name}</div></a>
        <div class="cart-item-meta">
          <span><i class="fa-solid fa-ruler"></i> Size: ${item.size}</span>
          <span><i class="fa-solid fa-palette"></i> <span style="width:12px;height:12px;border-radius:50%;background:${item.color};display:inline-block;border:1px solid var(--line);"></span></span>
        </div>
        <div class="cart-item-actions">
          <div class="qty-selector">
            <button class="js-qty-minus" data-idx="${idx}">−</button>
            <span>${item.qty}</span>
            <button class="js-qty-plus" data-idx="${idx}">+</button>
          </div>
          <button class="link-btn js-save-later" data-idx="${idx}"><i class="fa-regular fa-bookmark"></i> Save for later</button>
          <button class="link-btn remove js-remove" data-idx="${idx}"><i class="fa-solid fa-trash"></i> Remove</button>
        </div>
      </div>
      <div class="cart-item-price">
        <span class="price">${fmtPrice(item.price * item.qty)}</span>
        <span class="mrp">${fmtPrice(item.mrp * item.qty)}</span>
      </div>
    </div>`;
  }

  function renderSavedItem(item, idx){
    return `
    <div class="cart-item saved-item" data-idx="${idx}">
      <a href="product.html?id=${item.id}"><img src="${item.img}" alt="${item.name}"></a>
      <div>
        <a href="product.html?id=${item.id}"><div class="cart-item-name">${item.name}</div></a>
        <div class="cart-item-meta"><span>Size: ${item.size}</span></div>
        <div class="cart-item-actions">
          <button class="link-btn js-move-to-cart" data-idx="${idx}"><i class="fa-solid fa-cart-plus"></i> Move to Bag</button>
          <button class="link-btn remove js-remove-saved" data-idx="${idx}"><i class="fa-solid fa-trash"></i> Remove</button>
        </div>
      </div>
      <div class="cart-item-price"><span class="price">${fmtPrice(item.price)}</span></div>
    </div>`;
  }

  function render(){
    const cart = Store.getCart();
    const saved = getSaved();

    document.getElementById('cartPanel').style.display = cart.length ? 'block' : 'none';
    document.getElementById('emptyCart').classList.toggle('show', cart.length === 0);
    document.getElementById('summaryCard').style.display = cart.length ? 'block' : 'none';

    document.getElementById('cartItemCount').textContent = cart.length + (cart.length===1?' item':' items');
    document.getElementById('cartItemsWrap').innerHTML = cart.map(renderCartItem).join('');

    document.getElementById('savedPanel').style.display = saved.length ? 'block' : 'none';
    document.getElementById('savedItemCount').textContent = saved.length + (saved.length===1?' item':' items');
    document.getElementById('savedItemsWrap').innerHTML = saved.map(renderSavedItem).join('');

    // Totals
    const totalMrp = cart.reduce((s,c) => s + c.mrp*c.qty, 0);
    const totalPrice = cart.reduce((s,c) => s + c.price*c.qty, 0);
    const discount = totalMrp - totalPrice;
    let couponOff = 0;
    if (appliedCoupon){
      couponOff = appliedCoupon.pct ? Math.round(totalPrice * appliedCoupon.pct/100) : appliedCoupon.flat;
      couponOff = Math.min(couponOff, totalPrice);
    }
    const finalTotal = Math.max(0, totalPrice - couponOff);

    document.getElementById('summaryQtyLabel').textContent = `Price (${cart.reduce((s,c)=>s+c.qty,0)} items)`;
    document.getElementById('summaryPrice').textContent = fmtPrice(totalMrp);
    document.getElementById('summaryDiscount').textContent = '−' + fmtPrice(discount);
    document.getElementById('summaryCoupon').textContent = '−' + fmtPrice(couponOff);
    document.getElementById('summaryTotal').textContent = fmtPrice(finalTotal);
    const totalSavings = discount + couponOff;
    document.getElementById('summarySavings').textContent = totalSavings > 0 ? `You will save ${fmtPrice(totalSavings)} on this order` : '';

    document.getElementById('couponApplied').classList.toggle('show', !!appliedCoupon);
    document.getElementById('couponBox').style.display = appliedCoupon ? 'none' : 'flex';
    if (appliedCoupon) document.getElementById('couponLabel').textContent = appliedCoupon.label;
  }

  document.addEventListener('click', (e) => {
    const idxAttr = (sel) => { const el = e.target.closest(sel); return el ? parseInt(el.dataset.idx,10) : null; };

    let idx;
    if ((idx = idxAttr('.js-qty-plus')) !== null){
      const cart = Store.getCart(); cart[idx].qty = Math.min(10, cart[idx].qty+1); Store.setCart(cart); render();
    }
    if ((idx = idxAttr('.js-qty-minus')) !== null){
      const cart = Store.getCart();
      if (cart[idx].qty > 1) cart[idx].qty--; else cart.splice(idx,1);
      Store.setCart(cart); render();
    }
    if ((idx = idxAttr('.js-remove')) !== null){
      const cart = Store.getCart();
      const removed = cart.splice(idx,1)[0];
      Store.setCart(cart); render();
      showToast(removed.name + ' removed from cart');
    }
    if ((idx = idxAttr('.js-save-later')) !== null){
      const cart = Store.getCart();
      const item = cart.splice(idx,1)[0];
      const saved = getSaved(); saved.push(item); setSaved(saved);
      Store.setCart(cart); render();
      showToast('Saved for later');
    }
    if ((idx = idxAttr('.js-move-to-cart')) !== null){
      const saved = getSaved();
      const item = saved.splice(idx,1)[0];
      setSaved(saved);
      Store.addToCart(item); render();
      showToast('Moved to bag');
    }
    if ((idx = idxAttr('.js-remove-saved')) !== null){
      const saved = getSaved();
      saved.splice(idx,1); setSaved(saved); render();
    }
  });

  document.getElementById('couponApplyBtn').addEventListener('click', () => {
    const code = document.getElementById('couponInput').value.trim().toUpperCase();
    if (COUPONS[code]){
      appliedCoupon = COUPONS[code];
      render();
      showToast('Coupon applied successfully!');
    } else {
      showToast('Invalid coupon code', 'warn');
    }
  });
  document.getElementById('couponRemoveBtn').addEventListener('click', () => {
    appliedCoupon = null;
    document.getElementById('couponInput').value = '';
    render();
  });

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (!Store.getCart().length) return;
    showToast('This is a front-end demo — checkout is not connected to payments.', 'warn');
  });

  render();
});
