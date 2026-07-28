const express = require('express');
const router  = express.Router();
const Resena  = require('../models/Resena');

// GET /api/resenas - Obtener todas las reseñas
router.get('/', async (req, res) => {
  try {
    const resenas = await Resena.find().sort({ createdAt: -1 });
    res.json(resenas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
});

// POST /api/resenas - Guardar nueva reseña
router.post('/', async (req, res) => {
  try {
    const nuevaResena = new Resena(req.body);
    const guardada    = await nuevaResena.save();
    res.status(201).json({ mensaje: '¡Reseña guardada!', resena: guardada });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/resenas/:id - Editar reseña
router.put('/:id', async (req, res) => {
  try {
    const actualizada = await Resena.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!actualizada) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json({ mensaje: 'Reseña actualizada', resena: actualizada });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/resenas/:id - Eliminar reseña
router.delete('/:id', async (req, res) => {
  try {
    const eliminada = await Resena.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json({ mensaje: 'Reseña eliminada', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar reseña' });
  }
});

module.exports = router;
