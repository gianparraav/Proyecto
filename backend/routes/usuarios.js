const express = require('express');
const router = express.Router();
const User = require('../models/User');


//   GET /api/usuarios - Obtener todos los usuarios (solo admin)

router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    const filtro = email ? { email: String(email).toLowerCase().trim() } : {};

    // Excluir contraseñas por seguridad
    const usuarios = await User.find(filtro, { password: 0 }).sort({ createdAt: -1 });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});


//   POST /api/usuarios/reset-password - Actualizar contraseña por correo

router.post('/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const emailLower = String(email).toLowerCase().trim();
    const usuario = await User.findOne({ email: emailLower });

    if (!usuario) {
      return res.status(404).json({ error: 'No existe una cuenta con ese correo' });
    }

    usuario.password = password;
    await usuario.save();

    const usuarioResponse = usuario.toObject();
    delete usuarioResponse.password;

    res.json({
      mensaje: 'Contraseña actualizada exitosamente',
      usuario: usuarioResponse
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//   GET /api/usuarios/:id - Obtener un usuario por ID

router.get('/:id', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id, { password: 0 });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});


//   POST /api/usuarios/registro - Registrar nuevo usuario

router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: 'Nombre, correo y contraseña son obligatorios' 
      });
    }

    // Validar formato de email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Correo electrónico inválido' });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el email ya está registrado
    const existe = await User.findOne({ email: email.toLowerCase().trim() });
    if (existe) {
      return res.status(400).json({ error: 'Este correo ya está registrado' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new User({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      password: password, 
      rol: rol || 'usuario'
    });

    const guardado = await nuevoUsuario.save();

    // Devolver usuario sin contraseña
    const usuarioResponse = guardado.toObject();
    delete usuarioResponse.password;

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: usuarioResponse
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//   POST /api/usuarios/login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    // Buscar usuario por email
    const usuario = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña (en producción, usar bcrypt.compare)
    if (usuario.password !== password) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(403).json({ error: 'Usuario desactivado' });
    }

    // Devolver usuario sin contraseña
    const usuarioResponse = usuario.toObject();
    delete usuarioResponse.password;

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: usuarioResponse
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});


//   PUT /api/usuarios/:id - Actualizar usuario

router.put('/:id', async (req, res) => {
  try {
    const { nombre, email, rol, activo } = req.body;
    const updates = {};

    if (nombre) updates.nombre = nombre.trim();
    if (email) updates.email = email.toLowerCase().trim();
    if (rol) updates.rol = rol;
    if (activo !== undefined) updates.activo = activo;

    // Si se actualiza el email, verificar que no exista otro usuario con ese email
    if (email) {
      const existe = await User.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: req.params.id }
      });
      if (existe) {
        return res.status(400).json({ error: 'Este correo ya está registrado por otro usuario' });
      }
    }

    const actualizado = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!actualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: actualizado
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//   PUT /api/usuarios/:id/cambiar-password - Cambiar contraseña

router.put('/:id/cambiar-password', async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;

    if (!passwordActual || !nuevaPassword) {
      return res.status(400).json({ 
        error: 'Contraseña actual y nueva contraseña son obligatorias' 
      });
    }

    if (nuevaPassword.length < 6) {
      return res.status(400).json({ 
        error: 'La nueva contraseña debe tener al menos 6 caracteres' 
      });
    }

    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // aqui verificamos la  contraseña actual
    if (usuario.password !== passwordActual) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    usuario.password = nuevaPassword;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//   DELETE /api/usuarios/:id - Eliminar usuario

router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await User.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      mensaje: 'Usuario eliminado exitosamente',
      id: req.params.id
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

//   POST /api/usuarios/seed - Crear usuarios iniciales (solo para pruebas)

router.post('/seed', async (req, res) => {
  try {
    // Verificar si ya hay usuarios
    const count = await User.countDocuments();
    if (count > 0) {
      return res.status(400).json({ 
        mensaje: 'Ya existen usuarios en la base de datos' 
      });
    }

    const usuariosIniciales = [
      {
        nombre: 'Admin',
        email: 'admin@cafearoma.com',
        password: 'admin123',
        rol: 'admin'
      },
      {
        nombre: 'Juan Pérez',
        email: 'juan@email.com',
        password: '123456',
        rol: 'usuario'
      },
      {
        nombre: 'María García',
        email: 'maria@email.com',
        password: '123456',
        rol: 'usuario'
      }
    ];

    const creados = await User.insertMany(usuariosIniciales);
    const response = creados.map(u => {
      const obj = u.toObject();
      delete obj.password;
      return obj;
    });

    res.status(201).json({
      mensaje: 'Usuarios iniciales creados',
      usuarios: response
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;