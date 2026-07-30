// ============================================
//   CAFÉ ORIGEN — server.js
//   Backend Node.js + Express + MongoDB Atlas
// ============================================
// ✅ AGREGAR ESTO AL PRINCIPIO:
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---- MIDDLEWARES ----
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));  // Sirve el frontend

// ---- CONEXIÓN A MONGODB ATLAS ----
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err.message));

// ---- RUTAS API ----
app.use('/api/cafes',    require('./routes/cafes'));
app.use('/api/pedidos',  require('./routes/pedidos'));
app.use('/api/contacto', require('./routes/contacto'));
app.use('/api/resenas',  require('./routes/resenas'));
app.use('/api/usuarios', require('./routes/usuarios'));

// ---- Manejo de rutas no encontradas ----
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta de API no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

// ---- RUTA PRINCIPAL ----
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ---- INICIAR SERVIDOR ----
app.listen(PORT, () => {
  console.log(`☕ Servidor corriendo en http://localhost:${PORT}`);
});
