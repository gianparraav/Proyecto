// ============================================
//   VALIDACIONES.JS — FUNCIONES DE VALIDACIÓN COMPARTIDAS
//   ============================================
//   Función: Proporciona funciones de validación reutilizables
//   para todo el sitio (contacto, reseñas, productos, email).
//   
//   Validaciones disponibles:
//   - email(email): Verifica formato de correo electrónico
//   - contacto({nombre, email, mensaje}): Valida formulario de contacto
//   - resena({nombre, calificacion, comentario}): Valida reseñas
//   - cafe(payload): Valida campos de productos (admin)
//   
//   Cada función devuelve un objeto con los errores encontrados.
//   Si el objeto está vacío, la validación es exitosa.
//   
//   Uso: Se usa en conjunto con api.js y admin.js para validar
//   los datos antes de enviarlos al servidor.
//   ============================================ */
const Validaciones = {
  email(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  },
  contacto({ nombre, email, mensaje }) {
    const errores = {};
    if (!nombre.trim() || nombre.trim().length < 2) {
      errores.contactName = 'El nombre debe tener al menos 2 caracteres.';
    }
    if (!Validaciones.email(email)) {
      errores.contactEmail = 'Ingresa un correo válido.';
    }
    if (!mensaje.trim() || mensaje.trim().length < 10) {
      errores.contactMsg = 'El mensaje debe tener al menos 10 caracteres.';
    }
    return errores;
  },
  cafe(payload) {
    const errores = {};
    if (!payload.nombre?.trim()) errores.cafeNombre = 'El nombre es obligatorio.';
    if (!['espresso', 'frio', 'especial'].includes(payload.categoria)) {
      errores.cafeCategoria = 'Selecciona una categoría válida.';
    }
    const precio = Number(payload.precio);
    if (Number.isNaN(precio) || precio <= 0) errores.cafePrecio = 'El precio debe ser mayor a 0.';
    if (!payload.descripcion?.trim()) errores.cafeDescripcion = 'La descripción es obligatoria.';
    if (!payload.imagen?.trim()) errores.cafeImagen = 'La URL de imagen es obligatoria.';
    return errores;
  }
};
