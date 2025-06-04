const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// configuracion de variables de entorno
dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// rutas
app.use('/api/auth', authRoutes);

// ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'la API de Spotifake esta andando' });
});

// puerto del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`el servidor esta corriendo en el puerto ${PORT}`);
}); 