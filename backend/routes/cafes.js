const express = require('express');
const router  = express.Router();
const Cafe    = require('../models/Cafe');

// GET /api/cafes - Menú público (?todos=true incluye no disponibles, admin)
router.get('/', async (req, res) => {
  try {
    const filtro = req.query.todos === 'true' ? {} : { disponible: true };
    const cafes = await Cafe.find(filtro).sort({ nombre: 1 });
    res.json(cafes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cafés' });
  }
});

// GET /api/cafes/:id - Obtener un café por ID
router.get('/:id', async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) return res.status(404).json({ error: 'Café no encontrado' });
    res.json(cafe);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el café' });
  }
});

// POST /api/cafes - Crear un café
router.post('/', async (req, res) => {
  try {
    const nuevoCafe = new Cafe(req.body);
    const guardado  = await nuevoCafe.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/cafes/:id - Actualizar café
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Cafe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!actualizado) return res.status(404).json({ error: 'Café no encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/cafes/:id - Eliminar café
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Cafe.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Café no encontrado' });
    res.json({ mensaje: 'Café eliminado correctamente', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el café' });
  }
});

module.exports = router;
