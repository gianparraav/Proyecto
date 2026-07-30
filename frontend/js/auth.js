// ============================================
//   AUTENTICACIÓN — Café Aroma
// ============================================

const USUARIOS_KEY = 'cafeUsuarios';
const SESION_KEY = 'cafeSesion';

// ============================================
//   FUNCIONES DE LOCALSTORAGE
// ============================================

function getUsuarios() {
  try {
    const data = localStorage.getItem(USUARIOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
}

function getUsuarioActual() {
  try {
    const data = localStorage.getItem(SESION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function guardarSesion(usuario) {
  localStorage.setItem(SESION_KEY, JSON.stringify(usuario));
}

function eliminarSesion() {
  localStorage.removeItem(SESION_KEY);
}

// ============================================
//   ✅ CREAR USUARIOS INICIALES (SI NO EXISTEN)
// ============================================

function crearUsuariosIniciales() {
  let usuarios = getUsuarios();
  
  // Si no hay usuarios, crear los de prueba
  if (usuarios.length === 0) {
    const iniciales = [
      {
        id: '1',
        nombre: 'Admin',
        email: 'admin@aroma.com',
        password: '123456',
        rol: 'admin',
        creado: new Date().toISOString()
      },
      {
        id: '2',
        nombre: 'Juan Pérez',
        email: 'juan@email.com',
        password: 'JuanP@2026!',
        rol: 'usuario',
        creado: new Date().toISOString()
      },
      {
        id: '3',
        nombre: 'María García',
        email: 'maria@email.com',
        password: 'Maria#2026$',
        rol: 'usuario',
        creado: new Date().toISOString()
      }
    ];
    guardarUsuarios(iniciales);
    console.log('✅ Usuarios de prueba creados:', iniciales.map(u => u.email));
    return;
  }
  
  // ✅ VERIFICAR QUE admin@aroma.com EXISTA Y SEA ADMIN
  const adminExistente = usuarios.find(u => u.email === 'admin@aroma.com');
  if (!adminExistente) {
    // Si no existe el admin, agregarlo
    usuarios.push({
      id: Date.now().toString(),
      nombre: 'Admin',
      email: 'admin@aroma.com',
      password: '123456',
      rol: 'admin',
      creado: new Date().toISOString()
    });
    guardarUsuarios(usuarios);
    console.log('✅ Admin creado: admin@aroma.com / 123456');
  } else if (adminExistente.rol !== 'admin') {
    // Si existe pero no es admin, actualizarlo
    adminExistente.rol = 'admin';
    guardarUsuarios(usuarios);
    console.log('✅ Admin actualizado a rol admin');
  }
}

// ✅ EJECUTAR INMEDIATAMENTE (ANTES DE QUE SE CARGUE interface.js)
crearUsuariosIniciales();

// ============================================
//   FUNCIONES GLOBALES (accesibles desde HTML)
// ============================================

// ✅ CERRAR SESIÓN
window.cerrarSesion = function() {
  console.log('🔴 Cerrando sesión...');
  eliminarSesion();
  // Redirigir al login para que el usuario inicie sesión de nuevo
  window.location.replace('login.html');
};

// ✅ OBTENER USUARIO ACTUAL
window.getUsuarioActual = function() {
  return getUsuarioActual();
};

// ✅ VERIFICAR SI ES ADMIN
window.esAdmin = function() {
  const usuario = getUsuarioActual();
  return usuario && usuario.rol === 'admin';
};

// ✅ VERIFICAR SI ESTÁ AUTENTICADO
window.estaAutenticado = function() {
  return getUsuarioActual() !== null;
};

// ✅ REGISTRAR USUARIO
window.registrarUsuario = async function(nombre, email, password) {
  const requestBody = {
    nombre: nombre.trim(),
    email: email.toLowerCase().trim(),
    password: password
  };

  try {
    const response = await fetch('/api/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const error = data?.error || data?.mensaje || `Error ${response.status}`;
      return { success: false, error };
    }

    const usuario = data.usuario;
    if (!usuario) {
      return { success: false, error: 'Error al registrar el usuario' };
    }

    // Guardar sesión con el usuario completo
    guardarSesion(usuario);
    console.log('✅ Usuario registrado en backend:', usuario.email);
    return { success: true, usuario };
  } catch (err) {
    console.warn('⚠️ No se pudo conectar al backend. Intentando localStorage:', err.message);

    const usuarios = getUsuarios();
    const existe = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existe) {
      return { success: false, error: '❌ Este correo ya está registrado. Inicia sesión.' };
    }

    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      rol: 'usuario',
      creado: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    guardarSesion(nuevoUsuario);

    console.log('✅ Usuario registrado localmente:', nuevoUsuario.email);
    return { success: true, usuario: nuevoUsuario };
  }
};

// ✅ INICIAR SESIÓN
window.iniciarSesion = async function(email, password) {
  const requestBody = {
    email: email.toLowerCase().trim(),
    password: password
  };

  try {
    const response = await fetch('/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const error = data?.error || data?.mensaje || `Error ${response.status}`;
      return { success: false, error };
    }

    const usuario = data.usuario;
    if (!usuario) {
      return { success: false, error: 'Error al iniciar sesión' };
    }

    // Guardar sesión con el usuario completo
    guardarSesion(usuario);
    console.log('✅ Usuario logueado en backend:', usuario.email);
    return { success: true, usuario };
  } catch (err) {
    console.warn('⚠️ No se pudo conectar al backend. Intentando localStorage:', err.message);

    const usuarios = getUsuarios();
    const emailLower = email.toLowerCase().trim();
    const usuario = usuarios.find(u => 
      u.email.toLowerCase() === emailLower && 
      u.password === password
    );
    if (!usuario) {
      return { success: false, error: '❌ Correo o contraseña incorrectos' };
    }

    // Guardar sesión con el usuario completo
    guardarSesion(usuario);
    console.log('✅ Usuario logueado localmente:', usuario.email);
    return { success: true, usuario };
  }
};

// ============================================
//   CONFIGURAR FORMULARIOS
// ============================================

// ✅ RECUPERAR / RESETEAR CONTRASEÑA (backend real, fallback a localStorage)
window.resetPassword = async function(email, newPassword) {
  const requestBody = {
    email: (email || '').toLowerCase().trim(),
    password: newPassword
  };

  try {
    const response = await fetch('/api/usuarios/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      const usuarioBackend = data?.usuario || null;

      // Sincronizar localStorage si existe el usuario guardado
      try {
        const usuarios = getUsuarios();
        const u = usuarios.find(x => x.email.toLowerCase() === requestBody.email);
        if (u) {
          u.password = newPassword;
          guardarUsuarios(usuarios);
          console.log('✅ Contraseña actualizada en localStorage para:', u.email);
        }
      } catch (e) {
        console.warn('No se pudo sincronizar localStorage tras reset:', e.message);
      }

      if (usuarioBackend) {
        guardarSesion(usuarioBackend);
        return { success: true, usuario: usuarioBackend, backend: '/api/usuarios/reset-password' };
      }

      return { success: true, backend: '/api/usuarios/reset-password' };
    }

    const errorMessage = data?.error || data?.mensaje || `Error ${response.status}`;
    if (response.status === 404 || /no existe una cuenta/i.test(errorMessage)) {
      return { success: false, error: 'No existe una cuenta con ese correo' };
    }

    return { success: false, error: errorMessage };
  } catch (err) {
    console.warn('Error durante intento de reset en backend:', err.message);
  }

  // Si no hubo backend disponible o fallaron todos los intentos, fallback a localStorage
  try {
    const usuarios = getUsuarios();
    const emailLower = requestBody.email;
    const usuario = usuarios.find(u => u.email.toLowerCase() === emailLower);
    if (!usuario) {
      return { success: false, error: 'No existe una cuenta con ese correo' };
    }

    usuario.password = newPassword;
    guardarUsuarios(usuarios);
    console.log('✅ Contraseña actualizada localmente para:', usuario.email);
    return { success: true, usuario };
  } catch (err) {
    console.error('Error actualizando localStorage en resetPassword:', err.message);
    return { success: false, error: 'Error interno al actualizar contraseña' };
  }
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM cargado, configurando formularios...');
  
  // --- FORMULARIO DE REGISTRO ---
  const regForm = document.getElementById('registroForm');
  if (regForm) {
    console.log('✅ Formulario de registro encontrado');
    
    regForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const nombre = document.getElementById('regNombre');
      const email = document.getElementById('regEmail');
      const password = document.getElementById('regPassword');
      const confirm = document.getElementById('regConfirmPassword');
      
      let valid = true;
      
      // Validar nombre
      if (nombre.value.length < 2) {
        document.getElementById('regNombreError').classList.remove('hidden');
        valid = false;
      } else {
        document.getElementById('regNombreError').classList.add('hidden');
      }
      
      // Validar email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        document.getElementById('regEmailError').classList.remove('hidden');
        valid = false;
      } else {
        document.getElementById('regEmailError').classList.add('hidden');
      }
      
      // Validar contraseña
      if (password.value.length < 6) {
        document.getElementById('regPasswordError').classList.remove('hidden');
        valid = false;
      } else {
        document.getElementById('regPasswordError').classList.add('hidden');
      }
      
      // Validar confirmación
      if (password.value !== confirm.value) {
        document.getElementById('regConfirmError').classList.remove('hidden');
        valid = false;
      } else {
        document.getElementById('regConfirmError').classList.add('hidden');
      }
      
      if (!valid) return;
      
      // Registrar
      const resultado = await window.registrarUsuario(nombre.value, email.value, password.value);
      
      if (resultado.success) {
        alert('✅ ¡Cuenta creada exitosamente!\nBienvenido ' + resultado.usuario.nombre);
        window.location.href = 'index.html';
      } else {
        alert(resultado.error);
      }
    });
    
    // Mostrar/ocultar contraseña en registro
    const toggleRegPass = document.getElementById('toggleRegPassword');
    if (toggleRegPass) {
      toggleRegPass.addEventListener('click', function() {
        const pass = document.getElementById('regPassword');
        const type = pass.type === 'password' ? 'text' : 'password';
        pass.type = type;
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
      });
    }

    // Mostrar/ocultar contraseña en la página de recuperar contraseña
    const toggleResetPass = document.getElementById('toggleResetPassword');
    if (toggleResetPass) {
      toggleResetPass.addEventListener('click', function() {
        const pass = document.getElementById('resetPassword');
        if (!pass) return;
        const type = pass.type === 'password' ? 'text' : 'password';
        pass.type = type;
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        this.setAttribute('aria-label', type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
        pass.focus();
      });
    }

    // Mostrar/ocultar confirmación de contraseña en la página de recuperar contraseña (nuevo)
    const toggleResetConfirm = document.getElementById('toggleResetConfirm');
    if (toggleResetConfirm) {
      toggleResetConfirm.addEventListener('click', function() {
        const conf = document.getElementById('resetConfirm');
        if (!conf) return;
        const type = conf.type === 'password' ? 'text' : 'password';
        conf.type = type;
        // Mantener consistencia con los demás iconos y aria
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        this.setAttribute('aria-label', type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
        conf.focus();
      });
    }
  }

  // --- FORMULARIO DE LOGIN ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    console.log('✅ Formulario de login encontrado');
    
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail');
      const password = document.getElementById('loginPassword');
      
      // Validar email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        document.getElementById('emailError').classList.remove('hidden');
        return;
      } else {
        document.getElementById('emailError').classList.add('hidden');
      }
      
      // Validar contraseña
      if (password.value.length < 6) {
        document.getElementById('passwordError').classList.remove('hidden');
        return;
      } else {
        document.getElementById('passwordError').classList.add('hidden');
      }
      
      const resultado = await window.iniciarSesion(email.value, password.value);
      
      if (resultado.success) {
        alert('✅ ¡Bienvenido ' + resultado.usuario.nombre + '!');
        // Guardar sesión ya se hace dentro de iniciarSesion
        window.location.href = 'index.html';
      } else {
        alert(resultado.error);
      }
    });
    
    // Mostrar/ocultar contraseña en login (comportamiento accesible similar al registro)
    const toggleLoginPass = document.getElementById('togglePassword');
    if (toggleLoginPass) {
      toggleLoginPass.addEventListener('click', function() {
        const pass = document.getElementById('loginPassword');
        if (!pass) return;
        const wasHidden = pass.type === 'password';
        pass.type = wasHidden ? 'text' : 'password';
        // Ajustar icono y etiqueta accesible
        this.textContent = wasHidden ? '👁️‍🗨️' : '👁️';
        this.setAttribute('aria-label', wasHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
        // Mantener foco en el input para mejor UX
        pass.focus();
      });
    }

    // --- OLVIDÉ CONTRASEÑA / RESET ---
    const forgotLink = document.querySelector('.forgot-link');
    const resetOverlay = document.getElementById('resetModalOverlay');
    const resetClose = document.getElementById('resetModalClose');
    const resetForm = document.getElementById('resetForm');
    const resetFeedback = document.getElementById('resetFeedback');

    if (forgotLink && resetOverlay) {
      forgotLink.addEventListener('click', function(e) {
        e.preventDefault();
        resetOverlay.classList.remove('hidden');
        const eField = document.getElementById('resetEmail');
        if (eField) eField.focus();
      });
    }

    if (resetClose) {
      resetClose.addEventListener('click', function() {
        resetOverlay.classList.add('hidden');
      });
    }

    if (resetForm) {
      resetForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail');
        const pass = document.getElementById('resetPassword');
        const conf = document.getElementById('resetConfirm');
        if (!email || !pass || !conf) return;

        // Validaciones simples
        const emailVal = email.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          alert('Introduce un correo válido');
          return;
        }
        if (pass.value.length < 6) {
          alert('La contraseña debe tener al menos 6 caracteres');
          return;
        }
        if (pass.value !== conf.value) {
          alert('Las contraseñas no coinciden');
          return;
        }

        // Intentar reset
        const resultado = await window.resetPassword(emailVal, pass.value);
        if (resultado.success) {
          // Si estamos en la página de recuperar (recuperar.html) o olvidastes.html, redirigir a login
          const currentPage = document.body?.dataset?.page || '';
          if (currentPage === 'recuperar' || currentPage === 'olvidastes') {
            alert('✅ Contraseña actualizada. Serás redirigido para iniciar sesión.');
            // Redirigir al login
            window.location.replace('login.html');
            return;
          }

          // Flujo antiguo (modal dentro de login.html) — mantener compatibilidad
          if (resetFeedback) {
            resetFeedback.classList.remove('hidden');
            resetFeedback.textContent = '✅ Contraseña actualizada. Ahora puedes iniciar sesión.';
          }
          // Prefill login fields si existen
          const loginEmail = document.getElementById('loginEmail');
          const loginPass = document.getElementById('loginPassword');
          if (loginEmail) loginEmail.value = emailVal;
          if (loginPass) loginPass.value = pass.value;

          if (resetOverlay) {
            setTimeout(function() {
              resetOverlay.classList.add('hidden');
              if (resetFeedback) {
                resetFeedback.classList.add('hidden');
                resetFeedback.textContent = '';
              }
            }, 1400);
          }
        } else {
          alert(resultado.error || 'No se pudo actualizar la contraseña');
        }
      });
    }

    // Standalone reset form handler (para olvidastes.html / recuperar.html)
    const standaloneResetForm = document.getElementById('resetForm');
    if (standaloneResetForm) {
      // Mostrar/ocultar contraseña en la página de recuperación (si aplica)
      const toggleResetPassStandalone = document.getElementById('toggleResetPassword');
      if (toggleResetPassStandalone) {
        toggleResetPassStandalone.addEventListener('click', function() {
          const pass = document.getElementById('resetPassword');
          if (!pass) return;
          const wasHidden = pass.type === 'password';
          pass.type = wasHidden ? 'text' : 'password';
          // Usar mismo comportamiento que registro (icono + aria)
          this.textContent = wasHidden ? '👁️‍🗨️' : '👁️';
          this.setAttribute('aria-label', wasHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
          pass.focus();
        });
      }

      // Mostrar/ocultar confirmación en la página de recuperación (si aplica)
      const toggleResetConfirmStandalone = document.getElementById('toggleResetConfirm');
      if (toggleResetConfirmStandalone) {
        toggleResetConfirmStandalone.addEventListener('click', function() {
          const conf = document.getElementById('resetConfirm');
          if (!conf) return;
          const wasHidden = conf.type === 'password';
          conf.type = wasHidden ? 'text' : 'password';
          this.textContent = wasHidden ? '👁️‍🗨️' : '👁️';
          this.setAttribute('aria-label', wasHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
          conf.focus();
        });
      }

      standaloneResetForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail');
        const pass = document.getElementById('resetPassword');
        const conf = document.getElementById('resetConfirm');
        if (!email || !pass || !conf) return;

        const emailVal = email.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          alert('Introduce un correo válido');
          return;
        }
        if (pass.value.length < 6) {
          alert('La contraseña debe tener al menos 6 caracteres');
          return;
        }
        if (pass.value !== conf.value) {
          alert('Las contraseñas no coinciden');
          return;
        }

        const resultado = await window.resetPassword(emailVal, pass.value);
        if (resultado.success) {
          alert('✅ Contraseña actualizada. Serás redirigido para iniciar sesión.');
          window.location.replace('login.html');
          return;
        }

        alert(resultado.error || 'No se pudo actualizar la contraseña');
      });
    }
  }
});

// ============================================
//   DIAGNÓSTICO (para depurar)
// ============================================

console.log('🔐 Auth.js cargado correctamente');
console.log('📊 Usuarios en localStorage:', getUsuarios().length);
console.log('👤 Sesión activa:', getUsuarioActual() ? getUsuarioActual().email : 'Ninguna');