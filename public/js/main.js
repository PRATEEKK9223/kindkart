// Basic localStorage cart logic used by catalog + cart pages

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('kindkart_cart') || '[]');
  } catch (e) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem('kindkart_cart', JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  const cart = loadCart();
  const total = cart.reduce((s, it) => s + (it.qty || 0), 0);
  if (countEl) countEl.textContent = total;
}

// add to cart from buttons
document.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('add-to-cart')) {
    const item = JSON.parse(e.target.getAttribute('data-item'));
    const parent = e.target.closest('.card');
    const qtyInput = parent.querySelector('.qty-input');
    const qty = qtyInput ? Number(qtyInput.value || 1) : 1;
    const cart = loadCart();
    const existing = cart.find(c => c._id === item._id);
    if (existing) existing.qty += qty;
    else cart.push({ ...item, qty });
    saveCart(cart);
    alert(item.name + ' added to KindKart');
  }
  // detail page add
  if (e.target && e.target.id === 'addBtn') {
    const item = JSON.parse(e.target.getAttribute('data-item'));
    const qty = Number(document.getElementById('qty').value || 1);
    const cart = loadCart();
    const existing = cart.find(c => c._id === item._id);
    if (existing) existing.qty += qty;
    else cart.push({ ...item, qty });
    saveCart(cart);
    alert(item.name + ' added to KindKart');
  }
});

document.addEventListener('DOMContentLoaded', function(){
  updateCartCount();

  // fill cart table if on cart page
  const tableBody = document.querySelector('#cart-table tbody');
  if (tableBody) {
    const cart = loadCart();
    if (cart.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3">Your KindKart is empty</td></tr>';
      document.getElementById('proceedBtn').disabled = true;
    } else {
      tableBody.innerHTML = '';
      cart.forEach((it, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${it.name}</td><td><input class="form-control item-qty" data-idx="${idx}" value="${it.qty}" style="max-width:100px"></td><td><button class="btn btn-sm btn-danger remove-item" data-idx="${idx}">Remove</button></td>`;
        tableBody.appendChild(tr);
      });
    }

    // wire up remove & qty change
    tableBody.addEventListener('click', (ev) => {
      if (ev.target && ev.target.matches('.remove-item')) {
        const idx = Number(ev.target.getAttribute('data-idx'));
        const cart = loadCart();
        cart.splice(idx, 1);
        saveCart(cart);
        location.reload();
      }
    });
    tableBody.addEventListener('change', (ev) => {
      if (ev.target && ev.target.matches('.item-qty')) {
        const idx = Number(ev.target.getAttribute('data-idx'));
        const val = Number(ev.target.value || 1);
        const cart = loadCart();
        cart[idx].qty = val;
        saveCart(cart);
      }
    });

    // fill donateForm hidden input
    const donateForm = document.getElementById('donateForm');
    if (donateForm) {
      donateForm.addEventListener('submit', (ev) => {
        const itemsInput = document.getElementById('itemsJson');
        const donorNameInput = document.getElementById('donorNameInput');
        const donorContactInput = document.getElementById('donorContactInput');

        itemsInput.value = JSON.stringify(loadCart());
        donorNameInput.value = document.getElementById('donorName')?.value || '';
        donorContactInput.value = document.getElementById('donorContact')?.value || '';

        // if selected NGO in localStorage, set it
        const selectedNGO = localStorage.getItem('selectedNGO');
        if (selectedNGO) {
          document.getElementById('ngoId').value = selectedNGO;
        } else {
          // if no NGO selected, ask user to pick one
          if (!document.getElementById('ngoId').value) {
            ev.preventDefault();
            alert('Please select an NGO from the NGOs page (click "Donate Here") before confirming donation.');
          }
        }
      });
    }
  }
});
