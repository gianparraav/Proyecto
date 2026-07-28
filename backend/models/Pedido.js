const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    default: 'Cliente'
  },
  mesa: {
    type: String,
    trim: true
  },
  notas: {
    type: String,
    trim: true
  },
  items: [
    {
      nombre: String,
      precio: Number,
      cantidad: Number
    }
  ],
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'preparando', 'listo', 'entregado'],
    default: 'pendiente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);
