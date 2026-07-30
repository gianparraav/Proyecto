// login.js — validación y autenticación (ahora usa auth.js)

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const email = document.getElementById('loginEmail');
  const password = document.getElementById('loginPassword');
  const toggleBtn = document.getElementById('togglePassword');

  if (!form || !email || !password || !toggleBtn) return;
  
  // Mostrar/ocultar contraseña — manejado desde auth.js para evitar duplicidad
  // (handler eliminado aquí para centralizar el comportamiento en js/auth.js)

  // Validación en tiempo real
  email.addEventListener('input', function() {
    validateEmail(this);
  });

  password.addEventListener('input', function() {
    validatePassword(this);
  });

  // El submit ahora se maneja en auth.js, pero mantenemos la validación visual
  // y prevenimos comportamiento duplicado
  form.addEventListener('submit', function(e) {
    // La validación real y envío se maneja en auth.js
    // Solo validamos visualmente aquí
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      e.preventDefault();
      alert('❌ Por favor, corrige los errores del formulario');
      return false;
    }
    // Dejamos que auth.js maneje el submit
  });

  function validateEmail(input) {
    const error = document.getElementById('emailError');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = regex.test(input.value);
    const group = input.closest('.form-group');
    if (group) {
      group.classList.toggle('error', !valid && input.value.length > 0);
      group.classList.toggle('success', valid && input.value.length > 0);
    }
    error.classList.toggle('hidden', valid || input.value.length === 0);
    return valid;
  }

  function validatePassword(input) {
    const error = document.getElementById('passwordError');
    const valid = input.value.length >= 6;
    const group = input.closest('.form-group');
    if (group) {
      group.classList.toggle('error', !valid && input.value.length > 0);
      group.classList.toggle('success', valid);
    }
    error.classList.toggle('hidden', valid || input.value.length === 0);
    return valid;
  }
});