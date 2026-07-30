// ============================================
//   CONTACTO.JS — LÓGICA DEL FORMULARIO DE CONTACTO
//   ============================================
//   Funciones principales:
//   - Validación de campos (nombre, email, mensaje)
//   - Envío de datos a la API (/api/contacto) mediante POST
//   - Feedback visual (éxito/error) al usuario
//   - Limpieza del formulario después de enviar
//   - Manejo de errores de red y del servidor
//   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const nombre = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const mensaje = document.getElementById('contactMsg').value.trim();
    
    // Validar que los campos no estén vacíos
    if (!nombre || !email || !mensaje) {
      mostrarFeedback('❌ Por favor, completa todos los campos', 'error');
      return;
    }
    
    // Validar email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      mostrarFeedback('❌ Por favor, ingresa un correo electrónico válido', 'error');
      return;
    }
    
    // Preparar los datos para enviar
    const datos = {
      nombre: nombre,
      email: email,
      mensaje: mensaje
    };
    
    try {
      // Mostrar estado de carga
      const btn = form.querySelector('.btn-primary');
      const textoOriginal = btn.textContent;
      btn.textContent = '⏳ Enviando...';
      btn.disabled = true;
      
      // Enviar a la API
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      
      // Restaurar botón
      btn.textContent = textoOriginal;
      btn.disabled = false;
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al enviar el mensaje');
      }
      
      const data = await response.json();
      console.log('✅ Mensaje guardado en MongoDB:', data);
      
      // Mostrar mensaje de éxito
      mostrarFeedback('✅ ¡Mensaje enviado con éxito!', 'success');
      
      // Limpiar el formulario
      form.reset();
      
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      mostrarFeedback('❌ ' + error.message, 'error');
    }
  });
  
  function mostrarFeedback(mensaje, tipo) {
    const feedback = document.getElementById('formFeedback');
    if (!feedback) return;
    
    feedback.textContent = mensaje;
    feedback.className = 'form-feedback';
    
    if (tipo === 'error') {
      feedback.style.background = '#fcf0ef';
      feedback.style.border = '1px solid #f2d6d6';
      feedback.style.color = '#a4432c';
    } else {
      feedback.style.background = '#eaf6ee';
      feedback.style.border = '1px solid #d6efd6';
      feedback.style.color = '#1b6b3a';
    }
    
    feedback.classList.remove('hidden');
    
    // Ocultar después de 5 segundos
    clearTimeout(feedback._timeout);
    feedback._timeout = setTimeout(() => {
      feedback.classList.add('hidden');
    }, 5000);
  }
});