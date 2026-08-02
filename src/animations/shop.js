import { gsap, prefersReducedMotion } from "../lib/gsap.js";
import { getLenis } from "../lib/lenis.js";
import { PRODUCTS, SIZES, getProduct } from "../data/products.js";

const CART_KEY = "wrapp-cart";
const EASE = "power3.out";

let cart = [];
let activeProductId = null;
let activeSize = "M";
let openOverlay = null; // "product" | "cart" | "checkout" | null

function formatPrice(n) {
  return "$" + n.toLocaleString("en-US");
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    cart = raw ? JSON.parse(raw) : [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // localStorage unavailable (private browsing, etc.) — cart just won't persist.
  }
}

/* ---------- overlay show/hide (shared) ---------- */

function lockScroll(locked) {
  document.body.style.overflow = locked ? "hidden" : "";
  const lenis = getLenis();
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

function showOverlay(el, animateIn) {
  const scrim = document.getElementById("overlay-scrim");
  scrim.hidden = false;
  el.hidden = false;
  lockScroll(true);

  if (prefersReducedMotion()) {
    gsap.set(scrim, { opacity: 1 });
    gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
    return;
  }
  gsap.to(scrim, { opacity: 1, duration: 0.35, ease: EASE });
  animateIn();
}

function hideOverlay(el, animateOut, onDone) {
  const scrim = document.getElementById("overlay-scrim");
  const finish = () => {
    el.hidden = true;
    scrim.hidden = true;
    lockScroll(false);
    onDone?.();
  };

  if (prefersReducedMotion()) {
    finish();
    return;
  }
  gsap.to(scrim, { opacity: 0, duration: 0.3, ease: EASE });
  animateOut(finish);
}

/* ---------- product modal ---------- */

function renderMeasurements(product) {
  const table = document.getElementById("pm-measurements");
  const { rows } = product.measurements;
  const head = `<tr><th></th>${SIZES.map((s) => `<th>${s}</th>`).join("")}</tr>`;
  const body = rows
    .map((label, i) => {
      const cells = SIZES.map((s) => `<td>${product.measurements[s][i]}</td>`).join("");
      return `<tr><th>${label}</th>${cells}</tr>`;
    })
    .join("");
  table.innerHTML = head + body;
}

function renderSizes() {
  const wrap = document.getElementById("pm-sizes");
  wrap.innerHTML = SIZES.map(
    (s) => `<button type="button" class="pm-size" data-size="${s}" aria-pressed="${s === activeSize}">${s}</button>`
  ).join("");
}

function fillProductModal(product) {
  document.getElementById("pm-image").src = product.image;
  document.getElementById("pm-image").alt = product.name;
  document.getElementById("pm-index").textContent = `${product.index} / 06`;
  document.getElementById("pm-name").textContent = product.name;
  document.getElementById("pm-price").textContent = `${formatPrice(product.price)} — ${product.material}, ${product.detail.toLowerCase()}`;
  document.getElementById("pm-description").textContent = product.description;
  document.getElementById("pm-add-price").textContent = formatPrice(product.price);
  document.getElementById("pm-added").hidden = true;
  renderMeasurements(product);
  renderSizes();
}

function openProductModal(id) {
  const product = getProduct(id);
  if (!product) return;
  activeProductId = id;
  activeSize = "M";
  fillProductModal(product);

  const modal = document.getElementById("product-modal");
  openOverlay = "product";
  showOverlay(modal, () => {
    gsap.fromTo(modal, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: EASE });
  });
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  hideOverlay(
    modal,
    (finish) => gsap.to(modal, { opacity: 0, y: 16, duration: 0.3, ease: EASE, onComplete: finish }),
    () => {
      openOverlay = null;
      activeProductId = null;
    }
  );
}

/* ---------- cart ---------- */

function addToCart(id, size, qty = 1) {
  const existing = cart.find((item) => item.id === id && item.size === size);
  if (existing) existing.qty += qty;
  else cart.push({ id, size, qty });
  saveCart();
  renderCartCount();
  renderCartItems();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartCount();
  renderCartItems();
}

function changeQty(index, delta) {
  const item = cart[index];
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCartCount();
  renderCartItems();
}

function cartTotal() {
  return cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function renderCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = count;
}

function renderCartItems() {
  const list = document.getElementById("cart-items");
  const empty = document.getElementById("cart-empty");
  const checkoutBtn = document.getElementById("cart-checkout");

  if (cart.length === 0) {
    list.innerHTML = "";
    empty.hidden = false;
    checkoutBtn.disabled = true;
  } else {
    empty.hidden = true;
    checkoutBtn.disabled = false;
    list.innerHTML = cart
      .map((item, i) => {
        const product = getProduct(item.id);
        if (!product) return "";
        return `
          <li class="cart-item">
            <img src="${product.image}" alt="${product.name}" />
            <div>
              <div class="cart-item-name">${product.name}</div>
              <div class="cart-item-meta">Size ${item.size}</div>
              <div class="cart-item-qty">
                <button type="button" data-qty="-1" data-index="${i}" aria-label="Decrease quantity">−</button>
                <span>${item.qty}</span>
                <button type="button" data-qty="1" data-index="${i}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div class="cart-item-price">${formatPrice(product.price * item.qty)}</div>
            <button type="button" class="cart-item-remove" data-remove="${i}">Remove</button>
          </li>`;
      })
      .join("");
  }

  document.getElementById("cart-subtotal").textContent = formatPrice(cartTotal());
}

function openCart() {
  const drawer = document.getElementById("cart-drawer");
  openOverlay = "cart";
  showOverlay(drawer, () => {
    gsap.fromTo(drawer, { x: "100%" }, { x: "0%", duration: 0.5, ease: EASE });
  });
}

function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  hideOverlay(
    drawer,
    (finish) => gsap.to(drawer, { x: "100%", duration: 0.4, ease: EASE, onComplete: finish }),
    () => (openOverlay = null)
  );
}

/* ---------- checkout ---------- */

function openCheckout() {
  const modal = document.getElementById("checkout-modal");
  document.getElementById("checkout-form").hidden = false;
  document.getElementById("checkout-confirm").hidden = true;
  openOverlay = "checkout";
  showOverlay(modal, () => {
    gsap.fromTo(modal, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.4, ease: EASE });
  });
}

function closeCheckout() {
  const modal = document.getElementById("checkout-modal");
  hideOverlay(
    modal,
    (finish) => gsap.to(modal, { opacity: 0, scale: 0.97, duration: 0.3, ease: EASE, onComplete: finish }),
    () => (openOverlay = null)
  );
}

function submitCheckout(form) {
  const data = new FormData(form);
  const name = (data.get("fullName") || "").toString().trim().split(" ")[0] || "there";
  const orderNumber = "WRAPP-" + Math.floor(100000 + Math.random() * 900000);

  document.getElementById("checkout-confirm-text").textContent =
    `${name}, order ${orderNumber} is noted for ${data.get("city")}, ${data.get("country")}. ` +
    `This is a portfolio demo — nothing was charged and no real order was placed.`;

  form.hidden = true;
  document.getElementById("checkout-confirm").hidden = false;
  form.reset();

  cart = [];
  saveCart();
  renderCartCount();
  renderCartItems();
}

/* ---------- wiring ---------- */

export function initShop() {
  loadCart();
  renderCartCount();
  renderCartItems();

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-product]");
    if (opener) {
      const id = opener.closest("[data-product]")?.dataset.product;
      if (id) openProductModal(id);
      return;
    }

    if (e.target.closest("#cart-open")) {
      openCart();
      return;
    }

    if (e.target.closest("[data-close-product]")) {
      closeProductModal();
      return;
    }
    if (e.target.closest("[data-close-cart]")) {
      closeCart();
      return;
    }
    if (e.target.closest("[data-close-checkout]")) {
      closeCheckout();
      return;
    }

    if (e.target.id === "overlay-scrim") {
      if (openOverlay === "product") closeProductModal();
      else if (openOverlay === "cart") closeCart();
      else if (openOverlay === "checkout") closeCheckout();
      return;
    }

    const sizeBtn = e.target.closest(".pm-size");
    if (sizeBtn) {
      activeSize = sizeBtn.dataset.size;
      renderSizes();
      return;
    }

    if (e.target.closest("#pm-add")) {
      if (!activeProductId) return;
      addToCart(activeProductId, activeSize, 1);
      const added = document.getElementById("pm-added");
      added.hidden = false;
      gsap.fromTo(added, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      return;
    }

    const qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) {
      changeQty(Number(qtyBtn.dataset.index), Number(qtyBtn.dataset.qty));
      return;
    }
    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      removeFromCart(Number(removeBtn.dataset.remove));
      return;
    }

    if (e.target.closest("#cart-checkout")) {
      closeCart();
      openCheckout();
      return;
    }
  });

  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    submitCheckout(e.target);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (openOverlay === "product") closeProductModal();
    else if (openOverlay === "cart") closeCart();
    else if (openOverlay === "checkout") closeCheckout();
  });
}
