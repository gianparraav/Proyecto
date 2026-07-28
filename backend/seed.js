// seed.js - Poblar MongoDB con los cafés iniciales
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const mongoose = require('mongoose');
const Cafe     = require('./models/Cafe');

const cafes = [
  {
    nombre: "Espresso Clásico",
    categoria: "espresso",
    precio: 35,
    descripcion: "Un espresso concentrado y aromático, extraído lentamente para resaltar los sabores más profundos del grano.",
    descripcionLarga: "Nuestro espresso clásico es la base de todo buen café. Utilizamos una mezcla especial de granos de Veracruz tostados en casa.",
    imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80",
    detalles: ["Granos de Veracruz", "27g de café", "Tostado oscuro", "Sin azúcar"],
    disponible: true
  },
  {
    nombre: "Capuchino Artesanal",
    categoria: "espresso",
    precio: 55,
    descripcion: "Espresso doble con leche vaporizada y una capa de espuma suave y cremosa.",
    descripcionLarga: "Nuestro capuchino se prepara con un espresso doble, leche entera vaporizada a 65°C y una generosa capa de espuma sedosa.",
    imagen: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80",
    detalles: ["Espresso doble", "Leche entera", "Arte latte", "Sin azúcar agregada"],
    disponible: true
  },
  {
    nombre: "Café Negro Filtrado",
    categoria: "espresso",
    precio: 40,
    descripcion: "Café de origen único, preparado por goteo lento para extraer todos los matices florales y frutales.",
    descripcionLarga: "Preparado con el método de goteo manual (pour-over) usando un filtro de papel que elimina los aceites.",
    imagen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    detalles: ["Origen único", "Método pour-over", "Tostado medio", "Notas frutales"],
    disponible: true
  },
  {
    nombre: "Café Frío con Leche",
    categoria: "frio",
    precio: 65,
    descripcion: "Espresso enfriado sobre hielo con leche fría. Refrescante, suave y con el toque perfecto.",
    descripcionLarga: "Espresso vertido directamente sobre hielo para lograr un enfriamiento rápido que preserva los aromas.",
    imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
    detalles: ["Espresso sobre hielo", "Leche fría", "Sin jarabe", "Vaso grande"],
    disponible: true
  },
  {
    nombre: "Cold Brew 24h",
    categoria: "frio",
    precio: 75,
    descripcion: "Infusión en frío durante 24 horas. Súper concentrado, suave y sin acidez.",
    descripcionLarga: "Café molido grueso en agua fría durante 24 horas. Naturalmente dulce, bajo nivel de acidez.",
    imagen: "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=600&q=80",
    detalles: ["24h de infusión", "Baja acidez", "Alta cafeína", "Servido con hielo"],
    disponible: true
  },
  {
    nombre: "Mocha Chocolate",
    categoria: "especial",
    precio: 65,
    descripcion: "La mezcla perfecta de espresso, chocolate oscuro belga y leche vaporizada.",
    descripcionLarga: "Espresso doble con chocolate oscuro al 70% derretido en leche entera vaporizada. Terminado con crema batida.",
    imagen: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&q=80",
    detalles: ["Chocolate 70%", "Espresso doble", "Crema batida", "Ralladura de cacao"],
    disponible: true
  },
  {
    nombre: "Matcha Latte",
    categoria: "especial",
    precio: 70,
    descripcion: "Té matcha ceremonial de Japón mezclado con leche vaporizada. Energizante y antioxidante.",
    descripcionLarga: "Usamos matcha de grado ceremonial importado directamente de Uji, Japón. Lo batimos con agua caliente para crear una base espumosa que mezclamos con leche vaporizada. Una opción elegante y saludable para quienes buscan alternativas al café.",
    imagen: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80",
    detalles: ["Matcha ceremonial", "Leche de avena disponible", "Antioxidante", "Sin cafeína de café"],
    disponible: true
  },
  {
    nombre: "Chai Latte Especiado",
    categoria: "especial",
    precio: 60,
    descripcion: "Mezcla aromática de canela, cardamomo, jengibre y clavo con leche vaporizada. Calidez en cada sorbo.",
    descripcionLarga: "Nuestra mezcla chai es elaborada en casa con especias frescas: canela de Ceilán, cardamomo verde, jengibre fresco, clavo y pimienta negra. Infusionado en leche entera y endulzado ligeramente con piloncillo.",
    imagen: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&q=80",
    detalles: ["Especias frescas", "Piloncillo", "Vegan friendly", "Sin café"],
    disponible: true
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('✅ Conectado a MongoDB Atlas');

    await Cafe.deleteMany({});
    console.log('🗑️  Cafés anteriores eliminados');

    await Cafe.insertMany(cafes);
    console.log('☕ Cafés insertados en MongoDB:', cafes.length);

    mongoose.connection.close();
    console.log('✅ ¡Listo! Base de datos poblada correctamente');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedDB();