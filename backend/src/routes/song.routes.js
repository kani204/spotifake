const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Song = require('../models/Song');
const auth = require('../middleware/auth');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/songs');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.mp3', '.wav'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de audio MP3 y WAV'));
    }
  }
});

// Obtener todas las canciones
router.get('/', async (req, res) => {
  try {
    const songs = await Song.findAll({
      include: ['User']
    });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener canciones' });
  }
});

// Obtener una canción por ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id, {
      include: ['User']
    });
    if (!song) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la canción' });
  }
});

// Subir una nueva canción
router.post('/', auth, upload.single('song'), async (req, res) => {
  try {
    const { title, artist, album } = req.body;
    const filePath = req.file.path;

    const song = await Song.create({
      title,
      artist,
      album,
      filePath,
      userId: req.user.id
    });

    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: 'Error al subir la canción' });
  }
});

// Actualizar una canción
router.put('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    // Verificar si el usuario es el propietario o admin
    if (song.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await song.update(req.body);
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la canción' });
  }
});

// Eliminar una canción
router.delete('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    // Verificar si el usuario es el propietario o admin
    if (song.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await song.destroy();
    res.json({ message: 'Canción eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la canción' });
  }
});

module.exports = router; 