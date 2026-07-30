/* Interfaz compartida de Café Aroma: mantiene una navegación consistente. */
(() => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const page = document.body.dataset.page || 'inicio';
  const getCartCount = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('carrito') || '[]');
      if (!Array.isArray(stored)) return 0;
      return stored.reduce((sum, item) => sum + (item.cantidad || 1), 0);
    } catch {
      return 0;
    }
  };
  const countValue = document.getElementById('cartCount')?.textContent || getCartCount();
  const cartText = `🛒 Carrito <span id="cartCount">${countValue}</span>`;
  const cartMarkup = (page === 'inicio' || page === 'menu' || page === 'carrito')
    ? `<button class="cart-btn" id="cartBtn" type="button">${cartText}</button>`
    : `<a class="cart-btn" href="carrito.html">${cartText}</a>`;
  const current = key => page === key ? ' aria-current="page"' : '';
  nav.innerHTML = `
    <div class="nav-logo"><a href="index.html">☕ <span>Café Aroma</span></a></div>
    <button type="button" class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
    <ul class="nav-links">
      <li><a href="index.html"${current('inicio')}>Inicio</a></li>
      <li><a href="menu.html"${current('menu')}>Menú</a></li>
      <li><a href="admin.html"${current('admin')}>Gestión</a></li>
      <li><a href="pedidos.html"${current('pedidos')}>Pedidos</a></li>
      <li><a href="nosotros.html"${current('nosotros')}>Nosotros</a></li>
      <li><a href="contacto.html"${current('contacto')}>Contacto</a></li>
      <li><a href="login.html"${current('login')}>Iniciar Sesión</a></li>
    </ul>${cartMarkup}`;
  const toggle = document.getElementById('navToggle');
  const links = nav.querySelector('.nav-links');
  toggle.addEventListener('click', () => links.classList.toggle('nav-open'));
  if (page === 'inicio') {
    document.title = 'Café Aroma | Inicio';
    document.body.classList.add('home-without-menu');
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-sub');
    const description = document.querySelector('.hero-desc');
    if (title) title.textContent = 'Café Aroma';
    if (subtitle) subtitle.textContent = 'Bienvenido a';
    if (description) description.textContent = 'Experiencias de café artesanal con ingredientes de primera calidad. Cada sorbo, una historia.';
    const menuButton = document.querySelector('.hero-content .btn-primary');
    if (menuButton) {
      menuButton.href = 'menu.html';
      menuButton.textContent = 'Ver Menú Completo';
    }
    /*
    const hero = document.querySelector('.hero');
    if (hero && !document.querySelector('.quick-stats')) {
      hero.insertAdjacentHTML('afterend', `<section class="quick-stats" aria-label="Resumen de Café Aroma"><div><span>☕</span><strong id="homeMenuProductCount">0</strong><small>Productos en menú</small></div><div><span>🪑</span><strong>14</strong><small>Mesas disponibles</small></div><div><span>⭐</span><strong>6</strong><small>Años de experiencia</small></div><div><span>💗</span><strong>2,400+</strong><small>Clientes satisfechos</small></div></section>`);
    }
    */
  }
  if (page === 'menu') {
    const section = document.querySelector('.filter-section');
    const title = section?.querySelector('.section-title');
    const subtitle = section?.querySelector('.section-sub');
    const filters = section?.querySelector('.filters');
    const search = section?.querySelector('.search-wrap');
    if (section && title && filters && search) {
      title.textContent = 'Nuestro Menú';
      if (subtitle) subtitle.textContent = 'Ingredientes frescos, preparados con amor cada día.';
      section.insertAdjacentHTML('afterbegin', '<p class="menu-eyebrow">Carta del día</p>');
      const toolbar = document.createElement('div');
      toolbar.className = 'menu-toolbar';
      search.before(toolbar);
      toolbar.append(search, filters);
      const count = document.createElement('p');
      count.id = 'menuProductCount';
      count.className = 'menu-product-count';
      count.textContent = '0 productos';
      toolbar.after(count);
      filters.querySelector('[data-filter="todos"]').innerHTML = '☕ Todos';
      filters.querySelector('[data-filter="espresso"]').innerHTML = '☕ Café';
      filters.querySelector('[data-filter="frio"]').innerHTML = '🧊 Bebidas';
      filters.querySelector('[data-filter="especial"]').innerHTML = '✨ Especiales';
    }
  }
})();
