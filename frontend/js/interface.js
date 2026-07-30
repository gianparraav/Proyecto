/* Interfaz compartida de Café Aroma: mantiene una navegación consistente. */
(() => {
  const nav = document.querySelector(".navbar");
  if (!nav) return;
  const page = document.body.dataset.page || "inicio";

  // Obtener usuario actual desde localStorage
  const getUsuarioActual = () => {
    try {
      return JSON.parse(localStorage.getItem("cafeSesion")) || null;
    } catch {
      return null;
    }
  };

  const getCartCount = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("carrito") || "[]");
      if (!Array.isArray(stored)) return 0;
      return stored.reduce((sum, item) => sum + (item.cantidad || 1), 0);
    } catch {
      return 0;
    }
  };

  const usuario = getUsuarioActual();
  const countValue = getCartCount();
  const cartText = `🛒 Carrito <span id="cartCount">${countValue}</span>`;
  const current = (key) => (page === key ? ' aria-current="page"' : "");

  // Si estamos en la página de login, registro o olvidastes, mostrar solo el branding
  if (page === "login" || page === "registro" || page === "olvidastes") {
    nav.outerHTML = `
      <nav class="navbar">
        <div class="nav-logo"><a href="index.html">☕ <span>Café Aroma</span></a></div>
      </nav>
    `;
    return;
  }

  // ============================================
  //   ✅ CONSTRUIR NAVBAR SEGÚN ROL DEL USUARIO
  // ============================================
  let linksHTML = "";

  // ✅ SI EL USUARIO ESTÁ LOGUEADO
  if (usuario) {
    // ✅ SI ES ADMIN: SOLO mostrar Pedidos, Gestión y nombre
    if (usuario.rol === "admin") {
      linksHTML += `
        <li><a href="pedidos.html"${current("pedidos")}>Pedidos</a></li>
        <li><a href="admin.html"${current("admin")}>Gestión</a></li>
        <li style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #d4b07a; font-weight: 700;">👤 ${usuario.nombre}</span>
          <span style="color: #ff6b6b; font-size: 0.7rem; background: #fff; padding: 2px 8px; border-radius: 4px;">🔑 Admin</span>
          <button id="cerrarSesionBtn" style="background: none; border: none; color: #ff6b6b; font-size: 0.85rem; cursor: pointer; font-family: inherit; padding: 4px 8px;">
            Cerrar sesión
          </button>
        </li>
      `;
    } else {
      // ✅ USUARIO NORMAL: mostrar Inicio, Menú, Nosotros, Contacto
      linksHTML += `
        <li><a href="index.html"${current("inicio")}>Inicio</a></li>
        <li><a href="menu.html"${current("menu")}>Menú</a></li>
        <li><a href="nosotros.html"${current("nosotros")}>Nosotros</a></li>
        <li><a href="contacto.html"${current("contacto")}>Contacto</a></li>
        <li style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #d4b07a; font-weight: 700;">👤 ${usuario.nombre}</span>
          <button id="cerrarSesionBtn" style="background: none; border: none; color: #ff6b6b; font-size: 0.85rem; cursor: pointer; font-family: inherit; padding: 4px 8px;">
            Cerrar sesión
          </button>
        </li>
      `;
    }
  } else {
    // ✅ USUARIO NO LOGUEADO: solo mostrar Inicio, Menú, Nosotros, Contacto, Iniciar Sesión
    linksHTML += `
      <li><a href="index.html"${current("inicio")}>Inicio</a></li>
      <li><a href="menu.html"${current("menu")}>Menú</a></li>
      <li><a href="nosotros.html"${current("nosotros")}>Nosotros</a></li>
      <li><a href="contacto.html"${current("contacto")}>Contacto</a></li>
      <li><a href="login.html"${current("login")}>Iniciar Sesión</a></li>
    `;
  }

  // ============================================
  //   ✅ RECONSTRUIR NAVBAR COMPLETO (REEMPLAZAR TODO)
  // ============================================
  const esAdmin = usuario && usuario.rol === "admin";
  const cartHTML = esAdmin
    ? ""
    : `<a class="cart-btn" href="carrito.html">${cartText}</a>`;

  const nuevaNavbar = `
    <nav class="navbar">
      <div class="nav-logo"><a href="index.html">☕ <span>Café Aroma</span></a></div>
      <button type="button" class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
      <ul class="nav-links">
        ${linksHTML}
      </ul>
      ${cartHTML}
    </nav>
  `;

  nav.outerHTML = nuevaNavbar;

  // ============================================
  //   ✅ RE-ASIGNAR REFERENCIAS
  // ============================================
  const nuevoNav = document.querySelector(".navbar");
  if (!nuevoNav) return;

  // ============================================
  //   ✅ EVENTO PARA CERRAR SESIÓN
  // ============================================
  const cerrarBtn = document.getElementById("cerrarSesionBtn");
  if (cerrarBtn) {
    cerrarBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("🔴 Cerrando sesión desde el navbar...");
      localStorage.removeItem("cafeSesion");
      window.location.replace("login.html");
    });
  }

  // ============================================
  //   ✅ MENÚ MÓVIL (hamburguesa)
  // ============================================
  const toggle = document.getElementById("navToggle");
  const links = nuevoNav.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("nav-open"));
  }

  // ============================================
  //   ✅ SECCIÓN DE INICIO
  // ============================================
  if (page === "inicio") {
    document.title = "Café Aroma | Inicio";
    document.body.classList.add("home-without-menu");
    const title = document.querySelector(".hero-title");
    const subtitle = document.querySelector(".hero-sub");
    const description = document.querySelector(".hero-desc");
    if (title) title.textContent = "Café Aroma";
    if (subtitle) subtitle.textContent = "Bienvenido a";
    if (description)
      description.textContent =
        "Experiencias de café artesanal con ingredientes de primera calidad. Cada sorbo, una historia.";
    const menuButton = document.querySelector(".hero-content .btn-primary");
    if (menuButton) {
      menuButton.href = "menu.html";
      menuButton.textContent = "Ver Menú Completo";
    }
  }

  // ============================================
  //   ✅ SECCIÓN DE MENÚ
  // ============================================
  if (page === "menu") {
    const section = document.querySelector(".filter-section");
    const title = section?.querySelector(".section-title");
    const subtitle = section?.querySelector(".section-sub");
    const filters = section?.querySelector(".filters");
    const search = section?.querySelector(".search-wrap");
    if (section && title && filters && search) {
      title.textContent = "Nuestro Menú";
      if (subtitle)
        subtitle.textContent =
          "Ingredientes frescos, preparados con amor cada día.";
      section.insertAdjacentHTML(
        "afterbegin",
        '<p class="menu-eyebrow">Carta del día</p>',
      );
      const toolbar = document.createElement("div");
      toolbar.className = "menu-toolbar";
      search.before(toolbar);
      toolbar.append(search, filters);
      const count = document.createElement("p");
      count.id = "menuProductCount";
      count.className = "menu-product-count";
      count.textContent = "0 productos";
      toolbar.after(count);
      filters.querySelector('[data-filter="todos"]').innerHTML = "☕ Todos";
      filters.querySelector('[data-filter="espresso"]').innerHTML = "☕ Café";
      filters.querySelector('[data-filter="frio"]').innerHTML = "🧊 Bebidas";
      filters.querySelector('[data-filter="especial"]').innerHTML =
        "✨ Especiales";
    }
  }
})();

// ============================================
//   ✅ OBTENER MESAS OCUPADAS DESDE PEDIDOS
// ============================================
async function getMesasOcupadas() {
  try {
    const response = await fetch("/api/pedidos");
    if (!response.ok) throw new Error("Error al obtener pedidos");
    const pedidos = await response.json();

    // Contar mesas únicas ocupadas (pedidos pendientes o preparando con mesa)
    const mesasOcupadas = new Set();
    pedidos.forEach((p) => {
      if ((p.estado === "pendiente" || p.estado === "preparando") && p.mesa) {
        mesasOcupadas.add(p.mesa);
      }
    });

    return mesasOcupadas.size;
  } catch (err) {
    console.log("ℹ️ Error al obtener mesas ocupadas:", err.message);
    return 0;
  }
}

// ============================================
//   ✅ ACTUALIZAR ESTADÍSTICAS (PRODUCTOS + MESAS)
// ============================================
async function actualizarEstadisticas() {
  try {
    // 1. Obtener productos disponibles
    const responseCafes = await fetch("/api/cafes");
    if (!responseCafes.ok) throw new Error("Error al obtener productos");
    const cafes = await responseCafes.json();
    const disponibles = cafes.filter((c) => c.disponible !== false).length;

    const statsProductos = document.getElementById("statsProductos");
    if (statsProductos) {
      statsProductos.textContent = disponibles;
    }

    // 2. Obtener mesas ocupadas
    const mesasOcupadas = await getMesasOcupadas();
    const totalMesas = 14;
    const mesasDisponibles = totalMesas - mesasOcupadas;

    const statsMesas = document.getElementById("statsMesas");
    if (statsMesas) {
      statsMesas.textContent = `${mesasDisponibles}/${totalMesas}`;
    }

    console.log(
      `✅ Estadísticas: ${disponibles} productos, ${mesasDisponibles}/${totalMesas} mesas disponibles`,
    );
  } catch (err) {
    console.log("ℹ️ Usando datos locales para estadísticas");
    // Fallback: usar datos de cafesData
    if (typeof cafesData !== "undefined" && cafesData.length > 0) {
      const disponibles = cafesData.filter(
        (c) => c.disponible !== false,
      ).length;
      const statsProductos = document.getElementById("statsProductos");
      if (statsProductos) {
        statsProductos.textContent = disponibles;
      }
    }
    // Fallback para mesas: mostrar 14/14
    const statsMesas = document.getElementById("statsMesas");
    if (statsMesas) {
      statsMesas.textContent = "14/14";
    }
  }
}
