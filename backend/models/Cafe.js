const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    enum: ['espresso', 'frio', 'especial'],
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  descripcionLarga: {
    type: String
  },
  imagen: {
    type: String,
    required: true
  },
  detalles: [String],
  disponible: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Cafe', cafeSchema);
