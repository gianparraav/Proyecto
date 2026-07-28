let editandoCafeId = null;
let _cafesAdminAll = [];

function debounce(fn, wait = 200) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cafeForm').addEventListener('submit', guardarCafe);
  document.getElementById('cafeCancelEdit').addEventListener('click', resetFormularioCafe);
  document.getElementById('btnRecargarCafes').addEventListener('click', cargarCafesAdmin);
  const searchInput = document.getElementById('adminSearch');
  if (searchInput) searchInput.addEventListener('input', debounce(() => filtrarCafes(searchInput.value), 180));
  document.getElementById('btnNuevoProducto').addEventListener('click', () => {
    resetFormularioCafe();
    abrirModalCafe();
  });
  document.getElementById('adminModalClose').addEventListener('click', resetFormularioCafe);
  document.getElementById('adminModal').addEventListener('click', event => {
    if (event.target.id === 'adminModal') resetFormularioCafe();
  });
  cargarCafesAdmin();
  cargarResenasAdmin();
});

async function cargarCafesAdmin() {
  const tbody = document.getElementById('tablaCafesBody');
  tbody.innerHTML = '<tr><td colspan="6">Cargando…</td></tr>';
  try {
    const cafes = await API.get('/api/cafes?todos=true');
    if (!cafes.length) {
      tbody.innerHTML = '<tr><td colspan="6">No hay productos. Agrega el primero con el formulario.</td></tr>';
      return;
    }
    // Guardar todos los cafés en memoria para búsquedas locales
    _cafesAdminAll = cafes;
    // Mostrar contador inicial (todos)
    const contador = document.getElementById('adminCount');
    if (contador) contador.textContent = `${cafes.length} productos`;

    const mapCategoria = c => {
      if (!c) return '';
      const m = String(c).toLowerCase();
      if (m === 'espresso') return 'Café';
      if (m === 'frio') return 'Frío';
      if (m === 'especial') return 'Especial';
      return m.replace(/^./, s => s.toUpperCase());
    };

    tbody.innerHTML = cafes.map(cafe => `
      <tr data-id="${cafe._id}">
        <td>
          <img class="thumb" src="${escapeHtml(cafe.imagen || 'https://via.placeholder.com/56') }" alt="${escapeHtml(cafe.nombre)}" width="56" height="56"/>
        </td>
        <td>
          <div class="product-cell">
            <div class="product-info">
              <div class="product-name">${escapeHtml(cafe.nombre)}</div>
              <div class="product-desc">${escapeHtml((cafe.descripcion || '').slice(0,60))}${(cafe.descripcion||'').length>60? '…':''}</div>
            </div>
          </div>
        </td>
        <td><span class="badge">${escapeHtml(mapCategoria(cafe.categoria))}</span></td>
        <td class="price-cell">$${Number(cafe.precio).toFixed(2)}</td>
        <td><span class="status-pill ${cafe.disponible ? 'available' : 'unavailable'}">${cafe.disponible ? 'Disponible' : 'No disponible'}</span></td>
        <td class="table-actions">
          <button type="button" class="btn-table btn-icon" title="Editar" data-action="edit" data-id="${cafe._id}">✎</button>
          <button type="button" class="btn-table btn-icon btn-danger" title="Eliminar" data-action="delete" data-id="${cafe._id}">🗑</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (btn.dataset.action === 'edit') editarCafe(id, cafes);
        if (btn.dataset.action === 'delete') eliminarCafe(id);
      });
    });
      // Después de renderizar, actualizar el contador si hay búsqueda activa
      const searchInputNow = document.getElementById('adminSearch');
      if (searchInputNow && searchInputNow.value.trim()) {
        const filtered = filterArrayByTerm(_cafesAdminAll, searchInputNow.value.trim());
        if (contador) contador.textContent = `${filtered.length} de ${_cafesAdminAll.length} productos`;
      }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6">Error: ${escapeHtml(err.message)}</td></tr>`;
    mostrarNotificacion(err.message, true);
  }
}

  function filterArrayByTerm(arr, term) {
    if (!term) return arr.slice();
    const q = term.trim().toLowerCase();
    return arr.filter(c => {
      const nombre = String(c.nombre || '').toLowerCase();
      const categoria = String(c.categoria || '').toLowerCase();
      const descripcion = String(c.descripcion || '').toLowerCase();
      const detalles = (c.detalles || []).join(' ').toLowerCase();
      return nombre.includes(q) || categoria.includes(q) || descripcion.includes(q) || detalles.includes(q);
    });
  }

  function filtrarCafes(term) {
    const tbody = document.getElementById('tablaCafesBody');
    if (!Array.isArray(_cafesAdminAll) || !_cafesAdminAll.length) return;
    const t = String(term || '').trim();
    const contador = document.getElementById('adminCount');
    if (!t) {
      // mostrar todos
      cargarCafesAdmin();
      return;
    }
    const filtered = filterArrayByTerm(_cafesAdminAll, t);
    if (contador) contador.textContent = `${filtered.length} de ${_cafesAdminAll.length} productos`;
    tbody.innerHTML = filtered.map(cafe => `
      <tr data-id="${cafe._id}">
        <td>
          <img class="thumb" src="${escapeHtml(cafe.imagen || 'https://via.placeholder.com/56') }" alt="${escapeHtml(cafe.nombre)}" width="56" height="56"/>
        </td>
        <td>
          <div class="product-cell">
            <div class="product-info">
              <div class="product-name">${escapeHtml(cafe.nombre)}</div>
              <div class="product-desc">${escapeHtml((cafe.descripcion || '').slice(0,60))}${(cafe.descripcion||'').length>60? '…':''}</div>
            </div>
          </div>
        </td>
        <td><span class="badge">${escapeHtml(String(cafe.categoria || '').replace(/^./, s => s.toUpperCase()))}</span></td>
        <td class="price-cell">$${Number(cafe.precio).toFixed(2)}</td>
        <td><span class="status-pill ${cafe.disponible ? 'available' : 'unavailable'}">${cafe.disponible ? 'Disponible' : 'No disponible'}</span></td>
        <td class="table-actions">
          <button type="button" class="btn-table btn-icon" title="Editar" data-action="edit" data-id="${cafe._id}">✎</button>
          <button type="button" class="btn-table btn-icon btn-danger" title="Eliminar" data-action="delete" data-id="${cafe._id}">🗑</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (btn.dataset.action === 'edit') editarCafe(id, _cafesAdminAll);
        if (btn.dataset.action === 'delete') eliminarCafe(id);
      });
    });
  }

async function guardarCafe(e) {
  e.preventDefault();
  limpiarErroresFormulario(e.target);

  const payload = {
    nombre: document.getElementById('cafeNombre').value.trim(),
    categoria: document.getElementById('cafeCategoria').value,
    precio: Number(document.getElementById('cafePrecio').value),
    descripcion: document.getElementById('cafeDescripcion').value.trim(),
    descripcionLarga: document.getElementById('cafeDescripcionLarga').value.trim(),
    imagen: document.getElementById('cafeImagen').value.trim(),
    detalles: document.getElementById('cafeDetalles').value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
    disponible: document.getElementById('cafeDisponible').checked
  };

  const errores = Validaciones.cafe(payload);
  Object.entries(errores).forEach(([field, msg]) => mostrarErrorCampo(field, msg));
  if (Object.keys(errores).length) return;

  try {
    if (editandoCafeId) {
      await API.put(`/api/cafes/${editandoCafeId}`, payload);
      mostrarNotificacion('Producto actualizado (PUT)');
    } else {
      await API.post('/api/cafes', payload);
      mostrarNotificacion('Producto creado (POST)');
    }
    resetFormularioCafe();
    await cargarCafesAdmin();
  } catch (err) {
    mostrarNotificacion(err.message, true);
  }
}

function editarCafe(id, cafes) {
  const cafe = cafes.find(c => c._id === id);
  if (!cafe) return;
  editandoCafeId = id;
  document.getElementById('formTitle').textContent = 'Editar producto';
  document.getElementById('cafeSubmitBtn').textContent = 'Actualizar producto';
  document.getElementById('cafeCancelEdit').classList.remove('hidden');
  document.getElementById('cafeNombre').value = cafe.nombre;
  document.getElementById('cafeCategoria').value = cafe.categoria;
  document.getElementById('cafePrecio').value = cafe.precio;
  document.getElementById('cafeDescripcion').value = cafe.descripcion;
  document.getElementById('cafeDescripcionLarga').value = cafe.descripcionLarga || '';
  document.getElementById('cafeImagen').value = cafe.imagen;
  document.getElementById('cafeDetalles').value = (cafe.detalles || []).join(', ');
  document.getElementById('cafeDisponible').checked = cafe.disponible !== false;
  abrirModalCafe();
}

async function eliminarCafe(id) {
  if (!confirm('¿Eliminar este producto del menú? Esta acción no se puede deshacer.')) return;
  try {
    await API.delete(`/api/cafes/${id}`);
    mostrarNotificacion('Producto eliminado (DELETE)');
    if (editandoCafeId === id) resetFormularioCafe();
    await cargarCafesAdmin();
  } catch (err) {
    mostrarNotificacion(err.message, true);
  }
}

function resetFormularioCafe() {
  editandoCafeId = null;
  document.getElementById('cafeForm').reset();
  document.getElementById('cafeDisponible').checked = true;
  document.getElementById('formTitle').textContent = 'Agregar producto al menú';
  document.getElementById('cafeSubmitBtn').textContent = 'Guardar producto';
  document.getElementById('cafeCancelEdit').classList.add('hidden');
  limpiarErroresFormulario(document.getElementById('cafeForm'));
  document.getElementById('adminModal').classList.add('hidden');
}

function abrirModalCafe() {
  document.getElementById('adminModal').classList.remove('hidden');
  document.getElementById('cafeNombre').focus();
}

async function cargarResenasAdmin() {
  const cont = document.getElementById('listaResenasAdmin');
  cont.innerHTML = '<p>Cargando reseñas…</p>';
  try {
    const resenas = await API.get('/api/resenas');
    if (!resenas.length) {
      cont.innerHTML = '<p>No hay reseñas registradas.</p>';
      return;
    }
    cont.innerHTML = resenas.map(r => `
      <div class="admin-resena-item" data-id="${r._id}">
        <div>
          <strong>${escapeHtml(r.cafe)}</strong> — ${escapeHtml(r.nombre)}
          <span class="resena-estrellas">${'★'.repeat(r.calificacion)}</span>
          <p>${escapeHtml(r.comentario)}</p>
        </div>
        <div class="table-actions">
          <button type="button" class="btn-table" data-resena-edit="${r._id}">Editar</button>
          <button type="button" class="btn-table btn-danger" data-resena-del="${r._id}">Eliminar</button>
        </div>
      </div>
    `).join('');

    cont.querySelectorAll('[data-resena-edit]').forEach(btn => {
      btn.addEventListener('click', () => editarResena(btn.dataset.resenaEdit, resenas));
    });
    cont.querySelectorAll('[data-resena-del]').forEach(btn => {
      btn.addEventListener('click', () => eliminarResena(btn.dataset.resenaDel));
    });
  } catch (err) {
    cont.innerHTML = `<p>Error: ${escapeHtml(err.message)}</p>`;
  }
}

async function editarResena(id, resenas) {
  const r = resenas.find(x => x._id === id);
  if (!r) return;
  const comentario = prompt('Editar comentario:', r.comentario);
  if (comentario === null) return;
  const calStr = prompt('Calificación (1-5):', String(r.calificacion));
  if (calStr === null) return;
  const calificacion = parseInt(calStr, 10);
  if (calificacion < 1 || calificacion > 5) {
    mostrarNotificacion('La calificación debe ser entre 1 y 5', true);
    return;
  }
  try {
    await API.put(`/api/resenas/${id}`, { ...r, comentario: comentario.trim(), calificacion });
    mostrarNotificacion('Reseña actualizada (PUT)');
    cargarResenasAdmin();
  } catch (err) {
    mostrarNotificacion(err.message, true);
  }
}

async function eliminarResena(id) {
  if (!confirm('¿Eliminar esta reseña?')) return;
  try {
    await API.delete(`/api/resenas/${id}`);
    mostrarNotificacion('Reseña eliminada (DELETE)');
    cargarResenasAdmin();
  } catch (err) {
    mostrarNotificacion(err.message, true);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
