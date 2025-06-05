const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const auth = require('../middleware/auth');

// Obtener todas las playlists del usuario
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Song,
        through: { attributes: [] }
      }]
    });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener playlists' });
  }
});

// Obtener una playlist por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id, {
      include: [{
        model: Song,
        through: { attributes: [] }
      }]
    });
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    // Verificar si el usuario es el propietario
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la playlist' });
  }
});

// Crear una nueva playlist
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const playlist = await Playlist.create({
      name,
      description,
      userId: req.user.id
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la playlist' });
  }
});

// Actualizar una playlist
router.put('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    // Verificar si el usuario es el propietario
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await playlist.update(req.body);
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la playlist' });
  }
});

// Eliminar una playlist
router.delete('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    // Verificar si el usuario es el propietario
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await playlist.destroy();
    res.json({ message: 'Playlist eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la playlist' });
  }
});

// Agregar canción a playlist
router.post('/:id/songs/:songId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    const song = await Song.findByPk(req.params.songId);

    if (!playlist || !song) {
      return res.status(404).json({ message: 'Playlist o canción no encontrada' });
    }

    // Verificar si el usuario es el propietario de la playlist
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await playlist.addSong(song);
    res.json({ message: 'Canción agregada a la playlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar canción a la playlist' });
  }
});

// Eliminar canción de playlist
router.delete('/:id/songs/:songId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    const song = await Song.findByPk(req.params.songId);

    if (!playlist || !song) {
      return res.status(404).json({ message: 'Playlist o canción no encontrada' });
    }

    // Verificar si el usuario es el propietario de la playlist
    if (playlist.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await playlist.removeSong(song);
    res.json({ message: 'Canción eliminada de la playlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar canción de la playlist' });
  }
});

module.exports = router; 