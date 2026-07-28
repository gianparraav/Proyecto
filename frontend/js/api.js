// Cliente API compartido — rutas relativas (mismo origen con Express)
const API = {
  async request(url, options = {}) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    let data = null;
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text };
      }
    }
    if (!res.ok) {
      const msg = data?.error || data?.mensaje || `Error ${res.status}`;
      throw new Error(msg);
    }
    return data;
  },
  get(url) {
    return this.request(url);
  },
  post(url, body) {
    return this.request(url, { method: 'POST', body: JSON.stringify(body) });
  },
  put(url, body) {
    return this.request(url, { method: 'PUT', body: JSON.stringify(body) });
  },
  delete(url) {
    return this.request(url, { method: 'DELETE' });
  }
};

function mostrarNotificacion(mensaje, esError = false) {
  let notif = document.getElementById('notificacion');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notificacion';
    notif.setAttribute('role', 'status');
    notif.setAttribute('aria-live', 'polite');
    document.body.appendChild(notif);
  }
  notif.className = esError ? 'toast toast-error' : 'toast toast-ok';
  notif.textContent = mensaje;
  notif.style.opacity = '1';
  clearTimeout(notif._timeout);
  notif._timeout = setTimeout(() => { notif.style.opacity = '0'; }, 3200);
}

function mostrarErrorCampo(inputId, mensaje) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const errId = `${inputId}-error`;
  let err = document.getElementById(errId);
  if (!err) {
    err = document.createElement('p');
    err.id = errId;
    err.className = 'field-error';
    err.setAttribute('role', 'alert');
    input.after(err);
  }
  err.textContent = mensaje;
  input.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
}

function limpiarErroresFormulario(form) {
  form.querySelectorAll('.field-error').forEach(el => el.remove());
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
}
