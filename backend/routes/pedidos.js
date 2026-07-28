const express = require('express');
const router  = express.Router();
const Pedido  = require('../models/Pedido');

// GET /api/pedidos - Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// GET /api/pedidos/:id - Un pedido
router.get('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
});

// POST /api/pedidos - Crear un pedido
router.post('/', async (req, res) => {
  try {
    const nuevoPedido = new Pedido(req.body);
    const guardado    = await nuevoPedido.save();
    res.status(201).json({ mensaje: '¡Pedido guardado!', pedido: guardado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/pedidos/:id - Actualizar estado del pedido
router.put('/:id', async (req, res) => {
  try {
    const { estado } = req.body;
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ mensaje: 'Pedido actualizado', pedido });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/pedidos/:id - Cancelar / eliminar pedido
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Pedido.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ mensaje: 'Pedido eliminado', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
});

module.exports = router;
