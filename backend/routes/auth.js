const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ruta para registro de usuarios
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // fijarse si el usuario ya existe
        const [existingUsers] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'el usuario ya existe' });
        }

        // encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // meter el nuevo usuario
        const [result] = await pool.query(
            'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'usuario registrado exitosamente' });
    } catch (error) {
        console.error('error en registro:', error);
        res.status(500).json({ message: 'error en el servidor' });
    }
});

// ruta para inicio de sesion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // buscar el usuario
        const [users] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'credenciales invalidas' });
        }

        const user = users[0];

        // verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'credenciales invalidas' });
        }

        // generar el token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'login exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('error en login:', error);
        res.status(500).json({ message: 'error en el servidor' });
    }
});

module.exports = router; 