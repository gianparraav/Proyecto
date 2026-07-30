// ============================================
//   OLVIDASTES.JS — LÓGICA DE RECUPERACIÓN DE CONTRASEÑA
// ============================================

(function () {
  "use strict";

  const form = document.getElementById("resetForm");
  const emailInput = document.getElementById("resetEmail");
  const passwordInput = document.getElementById("resetPassword");
  const confirmInput = document.getElementById("resetConfirm");
  const togglePassword = document.getElementById("toggleResetPassword");
  const toggleConfirm = document.getElementById("toggleResetConfirm");
  const emailError = document.getElementById("resetEmailError");
  const passwordError = document.getElementById("resetPasswordError");
  const confirmError = document.getElementById("resetConfirmError");
  const feedback = document.getElementById("resetFeedback");
  const submitBtn = document.getElementById("resetSubmitBtn");

  // Si no existe el formulario, salir (no estamos en olvidastes.html)
  if (!form) return;

  // ============================================
  //   MOSTRAR/OCULTAR CONTRASEÑA
  // ============================================

  function setupTogglePassword(button, input) {
    if (!button || !input) return;

    button.addEventListener("click", function (e) {
      e.preventDefault();
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      this.textContent = isPassword ? "👁️‍🗨️" : "👁️";
      this.setAttribute(
        "aria-label",
        isPassword ? "Ocultar contraseña" : "Mostrar contraseña"
      );
      input.focus();
    });
  }

  // Configurar ambos botones
  setupTogglePassword(togglePassword, passwordInput);
  setupTogglePassword(toggleConfirm, confirmInput);

  // ============================================
  //   VALIDACIONES EN TIEMPO REAL
  // ============================================

  function validateEmail() {
    const value = emailInput.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = regex.test(value);
    const group = emailInput.closest(".form-group");

    if (value.length > 0) {
      emailError.classList.toggle("hidden", valid);
      if (group) group.classList.toggle("error", !valid);
    } else {
      emailError.classList.add("hidden");
      if (group) group.classList.remove("error");
    }
    return valid;
  }

  function validatePassword() {
    const value = passwordInput.value;
    const valid = value.length >= 6;
    const group = passwordInput.closest(".form-group");

    if (value.length > 0) {
      passwordError.classList.toggle("hidden", valid);
      if (group) group.classList.toggle("error", !valid);
    } else {
      passwordError.classList.add("hidden");
      if (group) group.classList.remove("error");
    }
    return valid;
  }

  function validateConfirm() {
    const match =
      passwordInput.value === confirmInput.value &&
      confirmInput.value.length > 0;
    const hasValue = confirmInput.value.length > 0;
    const group = confirmInput.closest(".form-group");

    if (hasValue) {
      confirmError.classList.toggle("hidden", match);
      if (group) group.classList.toggle("error", !match);
    } else {
      confirmError.classList.add("hidden");
      if (group) group.classList.remove("error");
    }
    return match || !hasValue;
  }

  // Event listeners para validación en tiempo real
  emailInput.addEventListener("input", validateEmail);
  passwordInput.addEventListener("input", function () {
    validatePassword();
    if (confirmInput.value.length > 0) validateConfirm();
  });
  confirmInput.addEventListener("input", validateConfirm);

  // ============================================
  //   ENVÍO DEL FORMULARIO
  // ============================================

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value;

    // Validar todos los campos
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirm();

    // Validación final
    if (!emailVal) {
      emailError.classList.remove("hidden");
      emailError.textContent = "El correo es obligatorio";
      emailInput.closest(".form-group").classList.add("error");
      return;
    }

    if (!isEmailValid) {
      emailError.classList.remove("hidden");
      emailError.textContent = "Introduce un correo válido";
      return;
    }

    if (!isPasswordValid) {
      passwordError.classList.remove("hidden");
      passwordError.textContent =
        "La contraseña debe tener al menos 6 caracteres";
      return;
    }

    if (!isConfirmValid) {
      confirmError.classList.remove("hidden");
      confirmError.textContent = "Las contraseñas no coinciden";
      return;
    }

    // Deshabilitar botón mientras se procesa
    submitBtn.disabled = true;
    submitBtn.textContent = "Actualizando...";

    try {
      // Primero verificar si el usuario existe en la base de datos
      let usuarioExiste = false;

      try {
        const checkRes = await fetch(
          `/api/usuarios?email=${encodeURIComponent(emailVal)}`
        );
        if (checkRes.ok) {
          const usuarios = await checkRes.json();
          usuarioExiste = usuarios.some(
            (u) => u.email.toLowerCase() === emailVal.toLowerCase()
          );
        }
      } catch (e) {
        // Si falla la verificación, intentamos el reset directamente
        console.log(
          "⚠️ No se pudo verificar usuario, intentando reset directo"
        );
      }

      // Llamar a la función de resetPassword de auth.js
      const resultado = await window.resetPassword(emailVal, passVal);

      if (resultado.success) {
        feedback.classList.remove("hidden");
        feedback.className = "reset-feedback success";
        feedback.textContent =
          "✅ ¡Contraseña actualizada exitosamente! Serás redirigido al login.";

        if (typeof mostrarNotificacion === "function") {
          mostrarNotificacion("✅ Contraseña actualizada correctamente");
        }

        setTimeout(() => {
          window.location.replace("login.html");
        }, 2000);
      } else {
        feedback.classList.remove("hidden");
        feedback.className = "reset-feedback error";

        // Mensaje de error más amigable
        let errorMsg = resultado.error || "No se pudo actualizar la contraseña";
        if (errorMsg.includes("No existe una cuenta")) {
          errorMsg =
            '❌ No existe una cuenta con ese correo. ¿Deseas <a href="registro.html">registrarte</a>?';
        }
        feedback.innerHTML = errorMsg;
      }
    } catch (err) {
      feedback.classList.remove("hidden");
      feedback.className = "reset-feedback error";
      feedback.textContent =
        "❌ Error: " + (err.message || "Ocurrió un error inesperado");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Actualizar contraseña";
    }
  });

  // ============================================
  //   ESTILOS ADICIONALES
  // ============================================

  const style = document.createElement("style");
  style.textContent = `
    .reset-feedback {
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.9rem;
      margin: 4px 0 8px;
      text-align: center;
    }
    .reset-feedback.hidden {
      display: none;
    }
    .reset-feedback.success {
      background: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #a5d6a7;
    }
    .reset-feedback.error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ef9a9a;
    }
    .reset-feedback.error a {
      color: #c62828;
      font-weight: 600;
    }
    .reset-feedback.error a:hover {
      text-decoration: underline;
    }
    .form-group.error input {
      border-color: #c0392b !important;
      box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.08) !important;
    }
    .form-group.error input:focus {
      border-color: #c0392b !important;
      box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.15) !important;
    }
    .form-group .form-error {
      font-size: 0.8rem;
      color: #c0392b;
      margin-top: 4px;
    }
    .form-group .form-error.hidden {
      display: none;
    }
    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }
    .password-wrapper {
      position: relative;
      width: 100%;
    }
    .password-wrapper input {
      width: 100%;
      padding-right: 48px !important;
      box-sizing: border-box;
    }
    .toggle-password {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      color: #9b704b;
      padding: 4px 8px;
      transition: color 0.3s ease;
      z-index: 2;
    }
    .toggle-password:hover {
      color: #2c1a0e;
    }
  `;
  document.head.appendChild(style);

  console.log("📄 olvidastes.js cargado correctamente");
  console.log(
    "🔑 Función resetPassword disponible:",
    typeof window.resetPassword === "function"
  );
})();