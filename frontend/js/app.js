// variables globales
let currentSong = null;
let isPlaying = false;
let audioContext = null;

// elementos del DOM
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');

// inicializacion de p5.js
function setup() {
    // crear canvas para visualizacion de audio
    createCanvas(800, 200);
    // inicializar el contexto de audio
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function draw() {
    background(18, 18, 18); // color de fondo oscuro
    
    if (currentSong && isPlaying) {
        // aca va a ir la visualizacion de ondas de audio
        stroke(29, 185, 84); // color verde de Spotify
        strokeWeight(2);
        noFill();
        beginShape();
        for (let i = 0; i < width; i++) {
            let x = map(i, 0, width, 0, TWO_PI);
            let y = sin(x) * 50 + height/2;
            vertex(i, y);
        }
        endShape();
    }
}

// event listeners
playBtn.addEventListener('click', togglePlay);
volumeSlider.addEventListener('input', adjustVolume);
progressBar.addEventListener('click', seekTo);

// funciones de control
function togglePlay() {
    if (!currentSong) {
        // aca va a ir la logica para cargar una cancion
        console.log('No hay cancion seleccionada');
        return;
    }

    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? 'Pausar' : 'Reproducir';
    
    if (isPlaying) {
        audioContext.resume();
    } else {
        audioContext.suspend();
    }
}

function adjustVolume(e) {
    const volume = e.target.value / 100;
    if (currentSong) {
        // aca va a ir la logica para ajustar el volumen
        console.log('Volumen ajustado a:', volume);
    }
}

function seekTo(e) {
    if (!currentSong) return;
    
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    // aca va a ir la logica para buscar en la cancion
    console.log('Buscando a:', pos * 100, '%');
}

// funciones de autenticacion
document.getElementById('loginBtn').addEventListener('click', () => {
    // aca va a ir la logica de inicio de sesion
    console.log('Iniciar sesion');
});

document.getElementById('registerBtn').addEventListener('click', () => {
    // aca va a ir la logica de registro
    console.log('Registrarse');
});

class App {
    constructor() {
        this.setupEventListeners();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Búsqueda
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('input', debounce((e) => this.handleSearch(e.target.value), 300));

        // Cargar más contenido al hacer scroll
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 200));
    }

    async loadInitialData() {
        try {
            // Cargar canciones destacadas
            const featuredSongs = await this.fetchSongs();
            this.renderFeaturedSongs(featuredSongs);

            // Cargar canciones recientes
            const recentSongs = await this.fetchRecentSongs();
            this.renderRecentSongs(recentSongs);

            // Cargar playlists del usuario si está autenticado
            if (auth.isAuthenticated()) {
                const playlists = await this.fetchPlaylists();
                this.renderPlaylists(playlists);
            }
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
        }
    }

    async fetchSongs() {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.SONGS.LIST}`);
            if (!response.ok) throw new Error('Error al cargar canciones');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async fetchRecentSongs() {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.SONGS.LIST}?sort=recent`);
            if (!response.ok) throw new Error('Error al cargar canciones recientes');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async fetchPlaylists() {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.PLAYLISTS.LIST}`, {
                headers: auth.getAuthHeader()
            });
            if (!response.ok) throw new Error('Error al cargar playlists');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    renderFeaturedSongs(songs) {
        const container = document.getElementById('featured-songs');
        container.innerHTML = songs.map(song => this.createSongCard(song)).join('');
    }

    renderRecentSongs(songs) {
        const container = document.getElementById('recent-songs');
        container.innerHTML = songs.map(song => this.createSongItem(song)).join('');
    }

    renderPlaylists(playlists) {
        const container = document.getElementById('playlists-list');
        container.innerHTML = playlists.map(playlist => this.createPlaylistItem(playlist)).join('');
    }

    createSongCard(song) {
        return `
            <div class="song-card" data-id="${song.id}">
                <img src="${song.coverImage || 'assets/default-cover.png'}" alt="${song.title}">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <button class="play-btn" onclick="app.playSong(${song.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
    }

    createSongItem(song) {
        return `
            <div class="song-item" data-id="${song.id}">
                <img src="${song.coverImage || 'assets/default-cover.png'}" alt="${song.title}">
                <div class="song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
                <button class="play-btn" onclick="app.playSong(${song.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
    }

    createPlaylistItem(playlist) {
        return `
            <li class="playlist-item" data-id="${playlist.id}">
                <a href="#" onclick="app.loadPlaylist(${playlist.id})">
                    <i class="fas fa-music"></i>
                    ${playlist.name}
                </a>
            </li>
        `;
    }

    async playSong(songId) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.SONGS.GET(songId)}`);
            if (!response.ok) throw new Error('Error al cargar la canción');
            const song = await response.json();
            
            // Cargar la canción en el reproductor
            await player.loadSong(song);
            player.togglePlay();
        } catch (error) {
            console.error('Error al reproducir canción:', error);
        }
    }

    async loadPlaylist(playlistId) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.PLAYLISTS.GET(playlistId)}`, {
                headers: auth.getAuthHeader()
            });
            if (!response.ok) throw new Error('Error al cargar la playlist');
            const playlist = await response.json();
            
            // Cargar la playlist en el reproductor
            await player.loadPlaylist(playlist.songs);
        } catch (error) {
            console.error('Error al cargar playlist:', error);
        }
    }

    async handleSearch(query) {
        if (query.length < 2) return;

        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.SONGS.LIST}?search=${query}`);
            if (!response.ok) throw new Error('Error en la búsqueda');
            const results = await response.json();
            
            // Actualizar la vista con los resultados
            this.renderFeaturedSongs(results);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
        }
    }

    handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            this.loadMoreContent();
        }
    }

    async loadMoreContent() {
        // Implementar carga infinita si es necesario
    }
}

// Utilidad para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Inicializar aplicación
const app = new App(); 