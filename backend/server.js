const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// configuracion de variables de entorno
dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// rutas basicas
app.get('/', (req, res) => {
    res.json({ message: 'API de Spotifake funcionando correctamente' });
});

// puerto del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 