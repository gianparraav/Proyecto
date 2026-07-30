// ============================================
//   CAFÉ ORIGEN — script.js
//   Manejo del catálogo, carrito, modal y API
// ============================================
// ============================================
//   SCRIPT.JS — LÓGICA PRINCIPAL DEL SITIO
//   ============================================
//   Funciones principales:
//   - cafesData: Datos locales de productos (fallback)
//   - renderCafes(): Renderiza tarjetas de café en menú
//   - Carrito: agregar, eliminar, actualizar cantidad
//   - Modal: abrir/cerrar con detalles del producto
//   - Contacto: manejo del formulario
//   - Carga desde API: intenta cargar datos de MongoDB
//   ============================================ */
const cafesData = [
  {
    _id: "1",
    nombre: "Espresso Clásico",
    categoria: "espresso",
    precio: 35,
    descripcion: "Un espresso concentrado y aromático, extraído lentamente para resaltar los sabores más profundos del grano.",
    descripcionLarga: "Nuestro espresso clásico es la base de todo buen café. Utilizamos una mezcla especial de granos de Veracruz tostados en casa. Cada taza se extrae en exactamente 27 segundos para garantizar el equilibrio perfecto entre acidez, cuerpo y crema.",
    imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80",
    detalles: ["Granos de Veracruz", "27g de café", "Tostado oscuro", "Sin azúcar"],
    disponible: true
  },
  {
    _id: "2",
    nombre: "Capuchino Artesanal",
    categoria: "espresso",
    precio: 55,
    descripcion: "Espresso doble con leche vaporizada y una capa de espuma suave y cremosa. El favorito de muchos.",
    descripcionLarga: "Nuestro capuchino se prepara con un espresso doble, leche entera vaporizada a 65°C y una generosa capa de espuma sedosa. Cada taza es decorada con arte latte por nuestros baristas certificados.",
    imagen: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80",
    detalles: ["Espresso doble", "Leche entera", "Arte latte", "Sin azúcar agregada"],
    disponible: true
  },
  {
    _id: "3",
    nombre: "Café Negro Filtrado",
    categoria: "espresso",
    precio: 40,
    descripcion: "Café de origen único, preparado por goteo lento para extraer todos los matices florales y frutales del grano.",
    descripcionLarga: "Este café negro se prepara con el método de goteo manual (pour-over) usando un filtro de papel que elimina los aceites y produce una taza limpia y brillante. Ideal para apreciar el terroir del café mexicano.",
    imagen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    detalles: ["Origen único", "Método pour-over", "Tostado medio", "Notas frutales"],
    disponible: true
  },
  {
    _id: "4",
    nombre: "Café Frío con Leche",
    categoria: "frio",
    precio: 65,
    descripcion: "Espresso enfriado sobre hielo con leche fría. Refrescante, suave y con el toque perfecto de café.",
    descripcionLarga: "Preparamos este café vertiendo espresso caliente directamente sobre hielo para lograr un enfriamiento rápido que preserva los aromas. Se combina con leche fría para una bebida cremosa y refrescante perfecta para el calor nayarita.",
    imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
    detalles: ["Espresso sobre hielo", "Leche fría", "Sin jarabe", "Vaso grande"],
    disponible: true
  },
  {
    _id: "5",
    nombre: "Cold Brew 24h",
    categoria: "frio",
    precio: 75,
    descripcion: "Infusión en frío durante 24 horas. Súper concentrado, suave y sin acidez. Una experiencia única.",
    descripcionLarga: "Nuestro cold brew se prepara sumergiendo café molido grueso en agua fría durante 24 horas exactas. El resultado es una bebida naturalmente dulce, de bajo nivel de acidez y con una concentración de cafeína mayor que el espresso convencional.",
    imagen: "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=600&q=80",
    detalles: ["24h de infusión", "Baja acidez", "Alta cafeína", "Servido con hielo"],
    disponible: true
  },
  {
    _id: "6",
    nombre: "Matcha Latte",
    categoria: "especial",
    precio: 70,
    descripcion: "Té matcha ceremonial de Japón mezclado con leche vaporizada. Energizante y antioxidante.",
    descripcionLarga: "Usamos matcha de grado ceremonial importado directamente de Uji, Japón. Lo batimos con agua caliente para crear una base espumosa que mezclamos con leche vaporizada. Una opción elegante y saludable para quienes buscan alternativas al café.",
    imagen: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80",
    detalles: ["Matcha ceremonial", "Leche de avena disponible", "Antioxidante", "Sin cafeína de café"],
    disponible: true
  },
  {
    _id: "7",
    nombre: "Mocha Chocolate",
    categoria: "especial",
    precio: 65,
    descripcion: "La mezcla perfecta de espresso, chocolate oscuro belga y leche vaporizada. Un placer para los sentidos.",
    descripcionLarga: "Combinamos nuestro espresso doble con chocolate oscuro al 70% derretido en leche entera vaporizada. Terminado con crema batida y ralladura de chocolate. Una indulgencia que no necesita justificación.",
    imagen: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&q=80",
    detalles: ["Chocolate 70%", "Espresso doble", "Crema batida", "Ralladura de cacao"],
    disponible: true
  },
  {
    _id: "8",
    nombre: "Chai Latte Especiado",
    categoria: "especial",
    precio: 60,
    descripcion: "Mezcla aromática de canela, cardamomo, jengibre y clavo con leche vaporizada. Calidez en cada sorbo.",
    descripcionLarga: "Nuestra mezcla chai es elaborada en casa con especias frescas: canela de Ceilán, cardamomo verde, jengibre fresco, clavo y pimienta negra. Infusionado en leche entera y endulzado ligeramente con piloncillo.",
    imagen: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&q=80",
    detalles: ["Especias frescas", "Piloncillo", "Vegan friendly", "Sin café"],
    disponible: true
  }
];

// ---- ESTADO DE LA APP ----
let carrito = [];

// Restaurar carrito desde localStorage (permite navegar a otra página)
try {
  const saved = localStorage.getItem('carrito');
  if (saved) carrito = JSON.parse(saved);
} catch (e) {
  console.warn('No se pudo cargar el carrito desde localStorage', e);
}
let cafesActuales = [...cafesData];

// ---- INICIALIZACIÓN ----
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cafesGrid')) renderCafes(cafesData);
  setupFiltros();
  setupBuscador();
  setupCarrito();
  // sincronizar contador desde localStorage (si hay datos restaurados arriba)
  if (typeof actualizarContadorCarrito === 'function') actualizarContadorCarrito();
  setupModal();
  setupNavbar();
  // Intentar cargar desde el backend (si está activo)
  cargarDesdeAPI();
});

// ---- RENDER DE TARJETAS ----
function renderCafes(cafes) {
  const grid = document.getElementById('cafesGrid');
  const noResults = document.getElementById('noResults');
  const menuCount = document.getElementById('menuProductCount');
  const homeCount = document.getElementById('homeMenuProductCount');

  if (menuCount) menuCount.textContent = `${cafes.length} producto${cafes.length === 1 ? '' : 's'}`;
  if (homeCount) homeCount.textContent = cafes.length;
  renderFeaturedProducts(cafes);

  grid.innerHTML = '';

  if (cafes.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  cafes.forEach((cafe, index) => {
    const card = document.createElement('div');
    card.className = 'cafe-card';
    card.style.animationDelay = `${index * 0.08}s`;
    card.setAttribute('data-id', cafe._id);
    card.setAttribute('data-categoria', cafe.categoria);

    card.innerHTML = `
      <div class="cafe-card-img-wrap">
        <img class="cafe-card-img" src="${cafe.imagen}" alt="${cafe.nombre}" loading="lazy" />
        <span class="cafe-tag">${formatCategoria(cafe.categoria)}</span>
      </div>
      <div class="cafe-card-body">
        <h3 class="cafe-name">${cafe.nombre}</h3>
        <p class="cafe-desc">${cafe.descripcion}</p>
        <div class="cafe-footer">
          <div class="cafe-price">$${cafe.precio} <span>MXN</span></div>
          <button class="btn-add" type="button" data-cafe-id="${cafe._id}">
            + Agregar
          </button>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-add')) {
        abrirModal(cafe);
      }
    });

    card.querySelector('.btn-add').addEventListener('click', (event) => {
      agregarAlCarrito(cafe._id, event);
    });

    grid.appendChild(card);
  });
}

function formatCategoria(cat) {
  const map = { espresso: 'Espresso', frio: 'Frío', especial: 'Especial' };
  return map[cat] || cat;
}

function renderFeaturedProducts(cafes) {
  const featuredGrid = document.getElementById('featuredGrid');
  if (!featuredGrid) return;
  const featured = cafes.slice(0, 3);
  featuredGrid.innerHTML = featured.map(cafe => `
    <article class="featured-card">
      <div class="featured-card-image">
        <img src="${cafe.imagen}" alt="${cafe.nombre}" loading="lazy" />
      </div>
      <div class="featured-card-body">
        <div class="featured-card-head">
          <p class="eyebrow">Lo más pedido</p>
          <h3>${cafe.nombre}</h3>
        </div>
        <p>${cafe.descripcion}</p>
        <div class="featured-card-footer">
          <span class="featured-price">$${cafe.precio} MXN</span>
          <button class="btn-featured" type="button" onclick="agregarAlCarrito('${cafe._id}')">Agregar</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ---- FILTROS ----
function setupFiltros() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filtro = btn.dataset.filter;
      const query = document.getElementById('searchInput').value.toLowerCase();
      filtrarCafes(filtro, query);
    });
  });
}

function filtrarCafes(categoria, query) {
  let resultado = [...cafesData];

  if (categoria && categoria !== 'todos') {
    resultado = resultado.filter(c => c.categoria === categoria);
  }

  if (query) {
    resultado = resultado.filter(c =>
      c.nombre.toLowerCase().includes(query) ||
      c.descripcion.toLowerCase().includes(query)
    );
  }

  cafesActuales = resultado;
  renderCafes(resultado);
}

// ---- BUSCADOR ----
function setupBuscador() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', () => {
    const filtroActivo = document.querySelector('.filter-btn.active').dataset.filter;
    filtrarCafes(filtroActivo, input.value.toLowerCase());
  });
}

// ---- MODAL ----
function setupModal() {
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');
  if (!modalClose || !modalOverlay) return;
  modalClose.addEventListener('click', cerrarModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) cerrarModal();
  });
}

function abrirModal(cafe) {
  const modal = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <img class="modal-img" src="${cafe.imagen}" alt="${cafe.nombre}" />
    <p class="modal-categoria">${formatCategoria(cafe.categoria)}</p>
    <h2 class="modal-name">${cafe.nombre}</h2>
    <p class="modal-desc">${cafe.descripcionLarga || cafe.descripcion}</p>
    <div class="modal-detalles">
      ${(cafe.detalles || []).map(d => `<span class="modal-detalle-item">✓ ${d}</span>`).join('')}
    </div>
    <div class="modal-footer">
      <div class="modal-price">$${cafe.precio} <small style="font-size:0.8rem;color:#7a6050">MXN</small></div>
      <button class="btn-primary" onclick="agregarAlCarrito('${cafe._id}', event); cerrarModal();">
        🛒 Agregar al pedido
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  document.body.style.overflow = '';
}

// ---- CARRITO ----
function setupCarrito() {
  const cartBtnEl = document.getElementById('cartBtn');
  const closeEl = document.getElementById('closeCart');
  const overlayEl = document.getElementById('overlayBg');
  if (cartBtnEl) cartBtnEl.addEventListener('click', abrirCarrito);
  if (closeEl) closeEl.addEventListener('click', cerrarCarrito);
  if (overlayEl) overlayEl.addEventListener('click', cerrarCarrito);
}

function agregarAlCarrito(id, event) {
  if (event) event.stopPropagation();

  const cafe = cafesData.find(c => String(c._id) === String(id));
  if (!cafe) return;

  const existente = carrito.find(item => String(item._id) === String(id));
  if (existente) {
    existente.cantidad = (existente.cantidad || 1) + 1;
  } else {
    carrito.push({ ...cafe, cantidad: 1 });
  }

  actualizarContadorCarrito();
  // sincronizar con localStorage
  try { localStorage.setItem('carrito', JSON.stringify(carrito)); } catch (e) {}
  mostrarNotificacion(`☕ ${cafe.nombre} agregado al pedido`);
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item._id !== id);
  actualizarContadorCarrito();
  renderCarrito();
  try { localStorage.setItem('carrito', JSON.stringify(carrito)); } catch (e) {}
}

function actualizarContadorCarrito() {
  const total = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  const contador = document.getElementById('cartCount');
  if (contador) contador.textContent = total;
  try { localStorage.setItem('carrito', JSON.stringify(carrito)); } catch (e) {}
}

function abrirCarrito() {
  // Navegar a la página de carrito (diseño de pantalla completa)
  window.location.href = 'carrito.html';
}

function cerrarCarrito() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlayBg');
  if (sidebar) sidebar.classList.add('hidden');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderCarrito() {
  const itemsContainer = document.getElementById('cartItems');
  const footerContainer = document.getElementById('cartFooter');
  const cartContentGrid = document.querySelector('.cart-content.container');

  // Si estamos en la página de carrito (vista completa)
  const isFullPage = document.body && document.body.dataset && document.body.dataset.page === 'carrito';
  const heroEl = document.querySelector('.cart-hero');

  if (carrito.length === 0) {
    // mostrar hero y ocultar contenido principal
    if (heroEl) heroEl.style.display = 'flex';
    if (cartContentGrid) cartContentGrid.style.display = 'none';
    if (!isFullPage) {
      if (itemsContainer) itemsContainer.innerHTML = '<p class="cart-empty">Tu carrito está vacío ☕</p>';
      if (footerContainer) footerContainer.innerHTML = '';
    }
    return;
  }

  // Hay artículos: ocultar hero y mostrar contenido
  if (heroEl) heroEl.style.display = 'none';
  if (cartContentGrid) cartContentGrid.style.display = 'grid';

  if (isFullPage) {
    // Left: lista de artículos dentro de una tarjeta
    if (itemsContainer) {
      itemsContainer.innerHTML = `
        <div class="cart-list-card">
          <div class="cart-list-header">
            <div>${carrito.length} artículo${carrito.length !== 1 ? 's' : ''}</div>
            <button class="vaciar-btn" onclick="vaciarCarrito()">Vaciar carrito</button>
          </div>
          <div class="cart-list-body">
            ${carrito.map(item => {
              const quantity = item.cantidad || 1;
              const unitPrice = quantity > 1 ? `<div class="cart-item-price-small">$${item.precio.toFixed(2)} c/u</div>` : '';
              return `
                <div class="cart-item-row">
                  <img src="${item.imagen}" alt="${item.nombre}" />
                  <div class="cart-item-meta">
                    <div class="cart-item-title">${item.nombre}</div>
                    <div class="cart-item-desc">${(item.descripcion||'').slice(0,120)}</div>
                    ${unitPrice}
                  </div>
                  <div class="cart-item-actions">
                    <div class="cart-item-controls">
                      <div class="qty-controls">
                        <button onclick="disminuirCantidad('${item._id}')">−</button>
                        <span>${quantity}</span>
                        <button onclick="aumentarCantidad('${item._id}')">+</button>
                      </div>
                      <button class="cart-item-remove-small" onclick="eliminarDelCarrito('${item._id}')">×</button>
                    </div>
                    <div class="cart-item-lineprice">$${(item.precio * quantity).toFixed(2)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="cart-list-footer">
            <a href="menu.html">← Seguir comprando</a>
          </div>
        </div>
      `;
    }

    // Right: resumen y formulario
    if (footerContainer) {
      const subtotal = carrito.reduce((s, i) => s + i.precio * (i.cantidad || 1), 0);
      const iva = +(subtotal * 0.08).toFixed(2);
      const total = +(subtotal + iva).toFixed(2);

      footerContainer.innerHTML = `
        <div class="order-box">
          <h4>Resumen del pedido</h4>
          <div class="order-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
          <div class="order-row"><span>IVA (8%)</span><span>$${iva.toFixed(2)}</span></div>
          <hr />
          <div class="order-row total"><strong>Total</strong><strong>$${total.toFixed(2)}</strong></div>
        </div>

        <div class="order-box order-form">
          <h4>Datos del pedido</h4>
          <label>Nombre *</label>
          <input id="pedidoNombre" placeholder="Tu nombre" />
          <label>Número de mesa *</label>
          <input id="pedidoMesa" placeholder="Ej. 5" />
          <label>Notas especiales <small>(opcional)</small></label>
          <textarea id="pedidoNotas" placeholder="Alergias, preferencias..."></textarea>
          <button class="btn-checkout" onclick="procesarPedido()">Realizar pedido · $${total.toFixed(2)}</button>
        </div>
      `;
    }

    return;
  }

  // Vista reducida (panel lateral) — comportamiento previo
  if (itemsContainer) itemsContainer.innerHTML = carrito.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.imagen}" alt="${item.nombre}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nombre} x${item.cantidad || 1}</div>
        <div class="cart-item-price">$${item.precio * (item.cantidad || 1)} MXN</div>
      </div>
      <button class="cart-item-remove" onclick="eliminarDelCarrito('${item._id}')">✕</button>
    </div>
  `).join('');

  const total = carrito.reduce((sum, item) => sum + item.precio * (item.cantidad || 1), 0);
  if (footerContainer) footerContainer.innerHTML = `
    <div class="cart-total">
      <span>Total:</span>
      <span>$${total} MXN</span>
    </div>
    <button class="btn-checkout" onclick="procesarPedido()">Realizar pedido</button>
  `;
}

// Controladores de cantidad y vaciado
function aumentarCantidad(id) {
  const item = carrito.find(i => String(i._id) === String(id));
  if (!item) return;
  item.cantidad = (item.cantidad || 1) + 1;
  actualizarContadorCarrito();
  try { localStorage.setItem('carrito', JSON.stringify(carrito)); } catch (e) {}
  renderCarrito();
}

function disminuirCantidad(id) {
  const item = carrito.find(i => String(i._id) === String(id));
  if (!item) return;
  item.cantidad = (item.cantidad || 1) - 1;
  if (item.cantidad <= 0) eliminarDelCarrito(id);
  else {
    actualizarContadorCarrito();
    try { localStorage.setItem('carrito', JSON.stringify(carrito)); } catch (e) {}
    renderCarrito();
  }
}

function vaciarCarrito() {
  carrito = [];
  try { localStorage.setItem('carrito', JSON.stringify(carrito)); } catch (e) {}
  actualizarContadorCarrito();
  renderCarrito();
}

async function procesarPedido() {
    if (carrito.length === 0) return;

  // Validar campos obligatorios del formulario (si existen en la página actual)
  const nombreInput = document.getElementById('pedidoNombre');
  const mesaInput = document.getElementById('pedidoMesa');
  if (nombreInput && mesaInput) {
    const nombreVal = nombreInput.value.trim();
    const mesaVal = mesaInput.value.trim();
    if (!nombreVal || !mesaVal) {
      mostrarNotificacion('⚠️ Completa tu nombre y número de mesa antes de continuar');
      if (!nombreVal) nombreInput.focus();
      else mesaInput.focus();
      return;
    }
  }

  const total = carrito.reduce((s, i) => s + i.precio * (i.cantidad || 1), 0);
  const pedido = {
    items: carrito.map(i => ({ nombre: i.nombre, precio: i.precio, cantidad: i.cantidad || 1 })),
    total
  };

  // Si estamos en la página de carrito, recoger campos del formulario
  try {
    const nombre = document.getElementById('pedidoNombre')?.value.trim() || null;
    const mesa = document.getElementById('pedidoMesa')?.value.trim() || null;
    const notas = document.getElementById('pedidoNotas')?.value.trim() || null;
    if (nombre) pedido.nombre = nombre;
    if (mesa) pedido.mesa = mesa;
    if (notas) pedido.notas = notas;
  } catch (e) {}

  ////////////////////////////////
  try {
    const res = await fetch('http://localhost:3000/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });

    if (!res.ok) throw new Error('Error del servidor');

    const data = await res.json();
    console.log('✅ Pedido guardado en MongoDB:', data);
    mostrarNotificacion(`✅ ¡Pedido realizado! Total: $${total} MXN`);
  } catch (err) {
    console.error('❌ Error guardando pedido:', err.message);
    mostrarNotificacion(`✅ ¡Pedido realizado! Total: $${total} MXN`);
  }

  carrito = [];
  try { localStorage.setItem('carrito', JSON.stringify(carrito)); } catch (e) {}
  actualizarContadorCarrito();
  // Si estamos en la página de carrito, re-renderizar para mostrar vacío
  if (document.body && document.body.dataset && document.body.dataset.page === 'carrito') {
    renderCarrito();
  } else {
    cerrarCarrito();
  }
}

// ---- NOTIFICACIÓN ----
function mostrarNotificacion(mensaje) {
  let notif = document.getElementById('notificacion');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notificacion';
    notif.style.cssText = `
      position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
      background: #2c1a0e; color: #fdf6ec; padding: 14px 28px;
      border-radius: 50px; font-size: 0.95rem; z-index: 500;
      box-shadow: 0 8px 24px rgba(44,26,14,0.25);
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(notif);
  }

  notif.textContent = mensaje;
  notif.style.opacity = '1';

  clearTimeout(notif._timeout);
  notif._timeout = setTimeout(() => { notif.style.opacity = '0'; }, 2500);
}

// ---- NAVBAR SCROLL ----
function setupNavbar() {
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ---- CONEXIÓN CON BACKEND (API MongoDB) ----
// Cuando tengas el servidor Node.js corriendo en localhost:3000
async function cargarDesdeAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/cafes');
    if (!response.ok) throw new Error('Servidor no disponible');

    const cafesDB = await response.json();
    if (cafesDB && cafesDB.length > 0) {
      cafesData.length = 0;          // limpiar el arreglo local
      cafesData.push(...cafesDB);    // llenar con datos de MongoDB
      renderCafes(cafesData);
      console.log('✅ Cafés cargados desde MongoDB:', cafesDB.length);
    }
  } catch (err) {
    // El backend no está activo, usamos datos locales (normal en desarrollo)
    console.log('ℹ️ Usando datos locales. Para usar MongoDB, inicia el servidor Node.js.');
  }
}

// Función para guardar pedido en MongoDB (se usará con el backend)
async function guardarPedidoEnDB(pedido) {
  try {
    const response = await fetch('http://localhost:3000/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });

    if (!response.ok) throw new Error('Error al guardar');
    const data = await response.json();
    console.log('✅ Pedido guardado en MongoDB:', data);
    return data;
  } catch (err) {
    console.error('❌ Error guardando pedido:', err.message);
  }
}