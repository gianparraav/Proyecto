const express  = require('express');
const router   = express.Router();
const Contacto = require('../models/Contacto');

router.get('/', async (req, res) => {
  try {
    const contactos = await Contacto.find().sort({ createdAt: -1 });
    res.json(contactos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevoContacto = new Contacto(req.body);
    const guardado      = await nuevoContacto.save();
    res.status(201).json({ mensaje: '¡Mensaje guardado!', contacto: guardado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
