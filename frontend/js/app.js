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
        // aqui ira la visualizacion de ondas de audio
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
        // aqui ira la logica para cargar una cancion
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
        // aqui ira la logica para ajustar el volumen
        console.log('Volumen ajustado a:', volume);
    }
}

function seekTo(e) {
    if (!currentSong) return;
    
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    // aqui ira la logica para buscar en la cancion
    console.log('Buscando a:', pos * 100, '%');
}

// funciones de autenticacion
document.getElementById('loginBtn').addEventListener('click', () => {
    // aqui ira la logica de inicio de sesion
    console.log('Iniciar sesion');
});

document.getElementById('registerBtn').addEventListener('click', () => {
    // aqui ira la logica de registro
    console.log('Registrarse');
}); 