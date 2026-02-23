// script.js

/* =====================================
   WHOLEMART - PROFESSIONAL B2B LOGIC
   Inspired by Jumbotail-style workflow
===================================== */

/* ========= STATE MANAGEMENT ========= */

const state = {
  user: null,
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  orders: JSON.parse(localStorage.getItem("orders")) || [],
  notifyNumber: localStorage.getItem('notifyNumber') || null,
  products: [],
  filteredProducts: []
};

/* ========= PRODUCT DATABASE (DEMO) ========= */

state.products = [
  // Replaced product list with items from provided screenshots.
  // Images are public placeholders; they'll be cropped in CSS for uniform cards.
  {
    id: 101,
    name: "Balrampur Sulphitation White Sugar, 50Kg Bag",
    category: "Sugar",
    price: 2277.28,
    stock: 250,
    image: "7.jpeg",
    minOrderQty: 10,
  },
  {
    id: 102,
    name: "Surajmukhi Masoor Malka, 30Kg Bag",
    category: "Pulses",
    price: 2070.31,
    stock: 300,
    image: "1.jpeg",
    minOrderQty: 1,
  },
  {
    id: 103,
    name: "Best Choice Refined Palmolein Oil, 1L Pouch",
    category: "Oils",
    price: 97.83,
    stock: 120,
    image: "2.jpeg",
    minOrderQty: 10,
  },
  {
    id: 104,
    name: "Everest Meat Masala, 500g Pouch",
    category: "Spices",
    price: 82.47,
    stock: 200,
    image: "3.jpeg",
    minOrderQty: 12,
  },
  {
    id: 105,
    name: "Beauty Queen Sonam Boiled Rice, 25Kg Bag",
    category: "Grains",
    price: 1338.1,
    stock: 100,
    image: "4.jpeg",
    minOrderQty: 1,
  },
  {
    id: 106,
    name: "Dhara Mustard Oil, 1L Pouch",
    category: "Oils",
    price: 166,
    stock: 600,
    image: "5.jpeg",
    minOrderQty: 15,
  },
  {
    id: 107,
    name: "Scooter Special Mustard Oil, 1L Pouch",
    category: "Oils",
    price: 144.73,
    stock: 400,
    image: "8.jpeg",
    minOrderQty: 12,
  },
  {
    id: 108,
    name: "Puja Food Sharbati Atta, 25Kg Bag",
    category: "Flour",
    price: 835,
    stock: 55,
    image: "6.jpeg",
    minOrderQty: 1,
  },
  {
    id: 109,
    name: "Baba Special Sonam Steamed Rice, 25Kg Bag",
    category: "Grains",
    price: 1448.69,
    stock: 50,
    image: "10.jpeg",
    minOrderQty: 1,
  },
  {
    id: 110,
    name: "TATA salt, 1Kg Pack",
    category: "Grains",
    price: 25.88,
    stock: 320,
    image: "9.jpeg",
    minOrderQty: 12,
  }
  ,
  {
    id: 111,
    name: "Everest Chaat Masala, 500g Pouch",
    category: "Spices",
    price: 66.73,
    stock: 100,
    image: "11.jpeg",
    minOrderQty: 12,
  },
  {
    id: 112,
    name: "Ambe Whole Wheat Atta, 26Kg Bag",
    category: "Flour",
    price: 815,
    stock: 40,
    image: "12.jpeg",
    minOrderQty: 1,
  },
  {
    id: 113,
    name: "Narayani Ka 7 Star Steamed Rice, 26Kg Bag",
    category: "Grains",
    price: 1250,
    stock: 25,
    image: "14.jpeg",
    minOrderQty: 1,
  },
  {
    id: 114,
    name: "Dhara Refined Soyabean Oil, 1L Pouch",
    category: "Oils",
    price: 150.5,
    stock: 300,
    image: "13.jpeg",
    minOrderQty: 12,
  },
  {
    id: 115,
    name: "Himani Best Choice REfined Palmolein Oil, 15Kg Tin",
    category: "Oils",
    price: 2235,
    stock: 200,
    image: "15.jpeg",
    minOrderQty: 2,
  },
  {
    id: 116,
    name: "Veer Toor Dal, 30Kg Bag",
    category: "Pulses",
    price: 3389.64,
    stock: 50,
    image: "16.jpeg",
    minOrderQty: 1,
  },
  {
    id: 117,
    name: "Puja Food Shuddh Chakki Atta, 49Kg Bag",
    category: "Flour",
    price: 1530,
    stock: 10,
    image: "17.jpeg",
    minOrderQty: 1,
  }
];

state.filteredProducts = [...state.products];

/* ========= INITIALIZATION ========= */

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCartCount();
  renderOrders();
  loadAuthState();
  updateHeaderAuth();
  // Ensure we do NOT auto-register the test number 7061732085
  if (localStorage.getItem('notifyNumber') === '7061732085') {
    localStorage.removeItem('notifyNumber');
    state.notifyNumber = null;
  }
  // Initialize mobile menu toggle behavior
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const nav = document.getElementById('nav-menu') || document.querySelector('.navigation');
      if (!nav) return;
      nav.classList.toggle('open');
      const ul = nav.querySelector('ul');
      if (ul) {
        const isShown = getComputedStyle(ul).display !== 'none';
        ul.style.display = isShown ? 'none' : 'flex';
      }
      const expanded = nav.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }
});

/* ========= PRODUCT RENDERING ========= */

function renderProducts() {
  const productList = document.getElementById("product-list");
  if (!productList) return; // page has no product list (e.g., index.html)
  productList.innerHTML = "";

  state.filteredProducts.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <div class="product-media"><img src="${product.image}" alt="${product.name}"/></div>
      <div class="product-body">
        <div>
          <div class="product-title">${product.name}</div>
          <div class="product-seller">Category: ${product.category}</div>
        </div>
        <div class="price-row">
          <div class="price">₹${product.price}</div>
          <div class="muted">Stock: ${product.stock}</div>
        </div>
        <div class="product-cta">
          <button class="btn add" onclick="addToCart(${product.id}, 1)">Add to Cart</button>
          <button class="btn btn-primary" onclick="buyNow(${product.id})">Buy Now</button>
        </div>
      </div>
    `;

    productList.appendChild(div);
  });
}

/* ========= SEARCH FUNCTION ========= */

function searchProducts() {
  const query = document.getElementById("search").value.toLowerCase();

  state.filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );

  renderProducts();
  renderSuggestions(query);
}

function renderSuggestions(query) {
  const suggestionBox = document.getElementById("suggestions");
  suggestionBox.innerHTML = "";

  if (!query) return;

  const matches = state.products.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  matches.forEach(match => {
    const li = document.createElement("li");
    li.textContent = match.name;
    li.onclick = () => {
      document.getElementById("search").value = match.name;
      state.filteredProducts = [match];
      renderProducts();
      suggestionBox.innerHTML = "";
    };
    suggestionBox.appendChild(li);
  });
}

/* ========= CART SYSTEM ========= */

function addToCart(productId) {
  // allow optional quantity: addToCart(id, qty)
  const qty = arguments.length > 1 ? Number(arguments[1]) : 1;
  const product = state.products.find(p => p.id === productId);

  if (!product) { alert("Product not found"); return; }
  if (product.stock <= 0) { alert("Product out of stock"); return; }
  if (!Number.isInteger(qty) || qty <= 0) { alert("Enter a valid quantity"); return; }
  if (qty > product.stock) { alert("Requested quantity exceeds stock"); return; }

  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    state.cart.push({ ...product, quantity: qty });
  }

  saveCart();
  renderCartCount();
}

function buyNow(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) { alert("Product not found"); return; }
  if (product.stock <= 0) { alert("Product out of stock"); return; }

  // ask user for quantity
  let qtyInput = prompt(`Enter quantity for '${product.name}' (min ${product.minOrderQty}):`, "1");
  if (qtyInput === null) return; // user cancelled
  const qty = parseInt(qtyInput, 10);

  if (isNaN(qty) || qty < product.minOrderQty) {
    alert(`Please enter a valid quantity (minimum ${product.minOrderQty})`);
    return;
  }
  if (qty > product.stock) {
    alert("Requested quantity exceeds available stock.");
    return;
  }

  // place order immediately (bypass cart) but keep record
  const order = {
    id: Date.now(),
    items: [{ id: product.id, name: product.name, price: product.price, quantity: qty }],
    total: product.price * qty,
    date: new Date().toLocaleString(),
    status: "Confirmed (Buy Now)"
  };

  // reduce stock
  product.stock -= qty;

  state.orders.push(order);
  localStorage.setItem("orders", JSON.stringify(state.orders));

  // send notification for this order if a number is registered
  try { sendOrderNotification(order); } catch(e) { console.warn('Notification error', e); }

  // update product listing, cart and UI
  saveCart();
  renderProducts();
  renderOrders();
  renderCartCount();

  alert(`Order placed successfully!\nOrder ID: ${order.id}\nTotal: ₹${order.total}`);
}

function renderCartCount() {
  const count = state.cart.reduce((sum, it) => sum + (it.quantity || 0), 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

function openCart() {
  const modal = document.getElementById("cart-modal");
  modal.classList.add("active");
  renderCartItems();
}

function closeCart() {
  document.getElementById("cart-modal").classList.remove("active");
}

function renderCartItems() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";

  if (state.cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;

  state.cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.innerHTML = `
      <p>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</p>
    `;
    cartContainer.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `<strong>Total: ₹${total}</strong>`;
  cartContainer.appendChild(totalDiv);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(state.cart));
}

/* ========= AUTH (CLIENT SIDE DEMO) ========= */

function loadAuthState() {
  const user = JSON.parse(localStorage.getItem('currentUser')) || null;
  state.user = user;
  // ensure users storage exists
  if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
}

function openAuthModal(mode = 'login'){
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.add('active');
  modal.style.display = 'flex';
  if (mode === 'register') showRegister(); else showLogin();
}

function closeAuthModal(){
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.style.display = 'none';
}

function showRegister(){
  const reg = document.getElementById('register-form');
  const log = document.getElementById('login-form');
  if (reg && log){ reg.style.display = 'block'; log.style.display = 'none'; document.getElementById('auth-title').textContent = 'Register'; }
}

function showLogin(){
  const reg = document.getElementById('register-form');
  const log = document.getElementById('login-form');
  if (reg && log){ reg.style.display = 'none'; log.style.display = 'block'; document.getElementById('auth-title').textContent = 'Login'; }
}

function registerUser(){
  const name = (document.getElementById('reg-name')||{}).value || '';
  const email = (document.getElementById('reg-email')||{}).value || '';
  const pass = (document.getElementById('reg-pass')||{}).value || '';
  if (!name || !email || !pass) { alert('Please fill all fields'); return; }
  const users = JSON.parse(localStorage.getItem('users')||'[]');
  if (users.find(u => u.email === email)) { alert('An account with this email already exists'); return; }
  const user = { id: Date.now(), name, email, pass };
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  state.user = { id: user.id, name: user.name, email: user.email };
  closeAuthModal();
  updateHeaderAuth();
  alert('Registration successful — you are now logged in.');
}

function loginUser(){
  const email = (document.getElementById('login-email')||{}).value || '';
  const pass = (document.getElementById('login-pass')||{}).value || '';
  if (!email || !pass) { alert('Please enter email and password'); return; }
  const users = JSON.parse(localStorage.getItem('users')||'[]');
  const user = users.find(u => u.email === email && u.pass === pass);
  if (!user) { alert('Invalid credentials'); return; }
  localStorage.setItem('currentUser', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  state.user = { id: user.id, name: user.name, email: user.email };
  closeAuthModal();
  updateHeaderAuth();
  alert('Logged in as ' + user.name);
}

function logoutUser(){
  localStorage.removeItem('currentUser');
  state.user = null;
  updateHeaderAuth();
  alert('You have been logged out.');
}

function updateHeaderAuth(){
  const btn = document.getElementById('auth-btn');
  if (!btn) return;
  if (state.user){
    btn.style.display = 'none';
    // insert user menu if not exists
    let menu = document.getElementById('user-menu');
    if (!menu){
      menu = document.createElement('div');
      menu.id = 'user-menu';
      menu.style.display = 'inline-flex';
      menu.style.alignItems = 'center';
      menu.style.gap = '8px';
      menu.innerHTML = `<span class="muted">Hello, ${state.user.name}</span><button class="secondary-btn" onclick="logoutUser()">Logout</button>`;
      btn.parentNode && btn.parentNode.insertBefore(menu, btn.parentNode.querySelector('.cart-button'));
    } else {
      menu.innerHTML = `<span class="muted">Hello, ${state.user.name}</span><button class="secondary-btn" onclick="logoutUser()">Logout</button>`;
      menu.style.display = 'inline-flex';
    }
  } else {
    // show auth button and hide menu
    btn.style.display = 'inline-block';
    const menu = document.getElementById('user-menu');
    if (menu) menu.style.display = 'none';
  }
}

/* ========= CHECKOUT ========= */

function checkout() {
  if (state.cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const order = {
    id: Date.now(),
    items: [...state.cart],
    total: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    date: new Date().toLocaleString(),
    status: "Confirmed"
  };

  state.orders.push(order);
  localStorage.setItem("orders", JSON.stringify(state.orders));

  state.cart = [];
  saveCart();
  renderCartCount();
  renderOrders();
  closeCart();

  // notify
  try { sendOrderNotification(order); } catch(e) { console.warn('Notification error', e); }

  alert("Order placed successfully!");
}

/* ========= ORDER HISTORY ========= */

function renderOrders() {
  const orderList = document.getElementById("order-list");
  if (!orderList) return; // no orders section on this page

  if (!state.orders.length) {
    orderList.innerHTML = "No orders placed yet.";
    return;
  }

  orderList.innerHTML = "";

  state.orders.forEach(order => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>Order ID: ${order.id}</h4>
      <p>Date: ${order.date}</p>
      <p>Status: ${order.status}</p>
      <p>Total: ₹${order.total}</p>
      <hr/>
    `;
    orderList.appendChild(div);
  });
}

/* ========= UTILITIES ========= */

function scrollToMarketplace() {
  document.getElementById("marketplace").scrollIntoView({
    behavior: "smooth"
  });
}

function contactAlert() {
  alert("Our support team will contact you shortly.");
}

// Notification helpers
function setNotifyNumber(number){
  if (!number) return alert('Please provide a phone number');
  const digits = String(number).replace(/\D/g,'');
  if (digits.length < 6) return alert('Enter a valid phone number');
  localStorage.setItem('notifyNumber', digits);
  state.notifyNumber = digits;
  alert('Notification number set to ' + digits);
}

function sendOrderNotification(order){
  const num = state.notifyNumber || localStorage.getItem('notifyNumber');
  if (!num) { console.log('No notification number configured'); return; }

  const message = `Order ${order.id} confirmed. Total: ₹${order.total}. Date: ${order.date}`;

  // Attempt 1: if an SMS API endpoint is configured on window, post to it
  if (window.SMS_API_URL){
    fetch(window.SMS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: num, message, apiKey: window.SMS_API_KEY || '' })
    }).then(res => console.log('SMS API response', res)).catch(err => console.warn('SMS API error', err));
    return;
  }

  // Fallback: try to open device SMS composer (may not work on desktop)
  try {
    const smsUrl = `sms:+${num}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
    // Also show a brief alert to confirm attempt
    setTimeout(()=>alert(`Notification attempted to ${num}.
${message}`), 300);
  } catch(e) {
    console.warn('SMS fallback failed', e);
  }
}