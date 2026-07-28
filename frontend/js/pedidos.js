const ESTADOS = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
let _pedidosAll = [];
let _filtroActual = 'todos';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnRecargarPedidos').addEventListener('click', cargarPedidos);
  document.getElementById('pedidosFilters')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const key = btn.dataset.key || 'todos';
    document.querySelectorAll('#pedidosFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _filtroActual = key;
    renderListaPedidos(_pedidosAll);
  });
  cargarPedidos();
});

async function cargarPedidos() {
  const cont = document.getElementById('pedidosLista');
  cont.innerHTML = '<p>Cargando pedidos…</p>';
  try {
    const pedidos = await API.get('/api/pedidos');
    if (!pedidos.length) {
      cont.innerHTML = '<p>No hay pedidos. Los clientes pueden ordenar desde la pantalla Menú.</p>';
      return;
    }
    _pedidosAll = pedidos.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    renderResumen(_pedidosAll);
    renderFiltros(_pedidosAll);
    renderListaPedidos(_pedidosAll);
  } catch (err) {
    cont.innerHTML = `<p class="field-error">${escapeHtml(err.message)}</p>`;
    mostrarNotificacion(err.message, true);
  }
}

function renderResumen(pedidos) {
  const cont = document.getElementById('pedidosSummary');
  const counts = { pendiente:0, preparando:0, listo:0, entregado:0, cancelado:0 };
  pedidos.forEach(p=> counts[p.estado] = (counts[p.estado]||0)+1);
  cont.innerHTML = `
    <div class="summary-card"><div><small>⌛</small><small> Pendientes</small></div><div><strong>${counts.pendiente||0}</strong></div></div>
    <div class="summary-card"><div><small>👩‍🍳</small><small> Preparando</small></div><div><strong>${counts.preparando||0}</strong></div></div>
    <div class="summary-card"><div><small>✅</small><small> Listos</small></div><div><strong>${counts.listo||0}</strong></div></div>
    <div class="summary-card"><div><small>🎉</small><small> Entregados</small></div><div><strong>${counts.entregado||0}</strong></div></div>
  `;
}

function renderFiltros(pedidos) {
  const cont = document.getElementById('pedidosFilters');
  const counts = { pendiente:0, preparando:0, listo:0, entregado:0, cancelado:0 };
  pedidos.forEach(p=> counts[p.estado] = (counts[p.estado]||0)+1);
  cont.innerHTML = `
    <button class="filter-btn active" data-key="todos">Todos</button>
    <button class="filter-btn" data-key="pendiente">Pendientes <small>(${counts.pendiente||0})</small></button>
    <button class="filter-btn" data-key="preparando">Preparando <small>(${counts.preparando||0})</small></button>
    <button class="filter-btn" data-key="listo">Listos <small>(${counts.listo||0})</small></button>
    <button class="filter-btn" data-key="entregado">Entregados <small>(${counts.entregado||0})</small></button>
    <button class="filter-btn" data-key="cancelado">Cancelados <small>(${counts.cancelado||0})</small></button>
  `;
}

function renderListaPedidos(pedidos) {
  const cont = document.getElementById('pedidosLista');
  let lista = pedidos.slice();
  if (_filtroActual && _filtroActual !== 'todos') lista = lista.filter(p=> p.estado === _filtroActual);
  if (!lista.length) {
    cont.innerHTML = '<p>No hay pedidos para ese filtro.</p>';
    return;
  }
  cont.innerHTML = lista.map(p=> renderPedidoCard(p)).join('');
  // agregar listeners
  cont.querySelectorAll('[data-estado]').forEach(sel => {
    sel.addEventListener('change', () => actualizarEstado(sel.dataset.id, sel.value));
  });
  cont.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => eliminarPedido(btn.dataset.delete));
  });
  cont.querySelectorAll('.pedido-toggle').forEach(btn=> btn.addEventListener('click', e=>{
    const card = e.currentTarget.closest('.pedido-card');
    const caret = e.currentTarget;
    const detail = card.querySelector('.pedido-detail');
    const expanded = card.classList.toggle('expanded');
    if (detail) detail.style.display = expanded ? 'grid' : 'none';
    if (caret) caret.textContent = expanded ? '▴' : '▾';
  }));
  // primary action buttons (Iniciar preparación / Marcar como listo / Marcar como entregado)
  cont.querySelectorAll('.action-primary').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const card = e.currentTarget.closest('.pedido-card');
      const id = card.dataset.id;
      const currentEstado = (card.querySelector('select[data-estado]')?.value) || '';
      let next = '';
      if (currentEstado === 'pendiente') next = 'preparando';
      else if (currentEstado === 'preparando') next = 'listo';
      else if (currentEstado === 'listo') next = 'entregado';
      if (!next) return;
      try {
        await API.put(`/api/pedidos/${id}`, { estado: next });
        mostrarNotificacion('Pedido actualizado');
        cargarPedidos();
      } catch (err) {
        mostrarNotificacion(err.message, true);
      }
    });
  });
}

function renderPedidoCard(p) {
  const fecha = p.createdAt ? new Date(p.createdAt).toLocaleString('es-MX') : '—';
  const itemsCount = (p.items || []).reduce((s,i)=> s + (i.cantidad || 1), 0);
  const estadoCls = String(p.estado || 'pendiente').toLowerCase();
  const options = ESTADOS.map(e =>
    `<option value="${e}" ${p.estado === e ? 'selected' : ''}>${e}</option>`
  ).join('');
  const clienteNombre = escapeHtml(p.nombre || p.cliente || 'Cliente');
  const mesaTexto = p.mesa ? ` — Mesa ${escapeHtml(p.mesa)}` : '';
  const nota = p.notas || p.nota || p.note || '';
  let primaryLabel = '';
  if (p.estado === 'pendiente') primaryLabel = 'Iniciar preparación';
  else if (p.estado === 'preparando') primaryLabel = 'Marcar como listo';
  else if (p.estado === 'listo') primaryLabel = 'Marcar como entregado';

  return `
    <article class="pedido-card" data-id="${p._id}">
      <div class="pedido-info">
        <header>
          <div class="pedido-head-left">
            <div class="pedido-meta"># ord_${String(p._id).slice(-6)}</div>
            <span class="pedido-badge ${escapeHtml(estadoCls)}">${escapeHtml(estadoCls.replace(/^./,s=>s.toUpperCase()))}</span>
          </div>
          <div class="pedido-head-right">
            <div class="pedido-amount">$${Number(p.total).toFixed(2)}</div>
            <button type="button" class="btn-table pedido-toggle">▾</button>
          </div>
        </header>
        <div class="pedido-title">${clienteNombre}${mesaTexto}</div>
        <div class="pedido-sub">${itemsCount} artículos · ${fecha}</div>

        <div class="pedido-detail" style="display:none;">
          <div class="detalle-articulos">
            <div class="detalle-header">ARTÍCULOS</div>
            <ul>
              ${(p.items || []).map(i=>`<li><span class="art-count">${i.cantidad || 1}×</span><span class="art-name">${escapeHtml(i.nombre)}</span><span class="art-price">$${Number(i.precio).toFixed(2)}</span></li>`).join('')}
            </ul>
            ${nota ? `<div class="pedido-note"><strong>Nota:</strong> ${escapeHtml(nota)}</div>` : ''}
          </div>
          <div class="detalle-acciones">
            <div class="detalle-header">ACCIONES</div>
            ${primaryLabel ? `<button class="btn-primary action-primary" data-action-next="${p.estado}">${primaryLabel}</button>` : ''}
            <button class="btn-secondary btn-cancel" data-delete="${p._id}">Cancelar pedido</button>
            <div class="estado-actual">Estado actual:
              <select data-estado data-id="${p._id}">${options}</select>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

async function actualizarEstado(id, estado) {
  try {
    await API.put(`/api/pedidos/${id}`, { estado });
    mostrarNotificacion(`Estado actualizado: ${estado}`);
  } catch (err) {
    mostrarNotificacion(err.message, true);
    cargarPedidos();
  }
}

async function eliminarPedido(id) {
  if (!confirm('¿Eliminar este pedido de la base de datos?')) return;
  try {
    await API.delete(`/api/pedidos/${id}`);
    mostrarNotificacion('Pedido eliminado (DELETE)');
    cargarPedidos();
  } catch (err) {
    mostrarNotificacion(err.message, true);
  }
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
