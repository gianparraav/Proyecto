const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  nombre:     { type: String, required: true, trim: true },
  cafe:       { type: String, required: true },
  calificacion: { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Resena', resenaSchema);
