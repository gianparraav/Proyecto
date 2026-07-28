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
  resena({ nombre, calificacion, comentario }) {
    const errores = {};
    if (!nombre.trim() || nombre.trim().length < 2) {
      errores.resenaNombre = 'Indica tu nombre (mínimo 2 caracteres).';
    }
    if (!calificacion || calificacion < 1) {
      errores.resenaCalificacion = 'Selecciona una calificación de 1 a 5 estrellas.';
    }
    if (!comentario.trim() || comentario.trim().length < 5) {
      errores.resenaComentario = 'El comentario debe tener al menos 5 caracteres.';
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
