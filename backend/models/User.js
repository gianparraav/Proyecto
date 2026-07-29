const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,        
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Correo electrónico inválido']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  activo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);