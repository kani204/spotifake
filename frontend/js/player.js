class Player {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 'none'; // none, one, all
        this.volume = CONFIG.AUDIO.DEFAULT_VOLUME;
        this.setupAudio();
        this.setupEventListeners();
    }

    setupAudio() {
        this.audio.volume = this.volume;
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    }

    setupEventListeners() {
        // Botones de control
        document.getElementById('play-pause').addEventListener('click', () => this.togglePlay());
        document.getElementById('prev').addEventListener('click', () => this.playPrevious());
        document.getElementById('next').addEventListener('click', () => this.playNext());
        document.getElementById('shuffle').addEventListener('click', () => this.toggleShuffle());
        document.getElementById('repeat').addEventListener('click', () => this.toggleRepeat());

        // Barra de progreso
        const progress = document.querySelector('.progress');
        progress.addEventListener('click', (e) => this.seekTo(e));

        // Control de volumen
        const volumeControl = document.getElementById('volume');
        volumeControl.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
    }

    async loadSong(song) {
        try {
            this.audio.src = `${CONFIG.API_URL}${CONFIG.ENDPOINTS.SONGS.GET(song.id)}/stream`;
            await this.audio.load();
            this.updateNowPlaying(song);
        } catch (error) {
            console.error('Error al cargar la canción:', error);
        }
    }

    updateNowPlaying(song) {
        document.getElementById('current-title').textContent = song.title;
        document.getElementById('current-artist').textContent = song.artist;
        document.getElementById('current-cover').src = song.coverImage || 'assets/default-cover.png';
    }

    togglePlay() {
        if (this.audio.src) {
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
            this.isPlaying = !this.isPlaying;
            this.updatePlayButton();
        }
    }

    updatePlayButton() {
        const playPauseBtn = document.getElementById('play-pause');
        playPauseBtn.innerHTML = this.isPlaying ? 
            '<i class="fas fa-pause"></i>' : 
            '<i class="fas fa-play"></i>';
    }

    playPrevious() {
        if (this.playlist.length === 0) return;

        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadSong(this.playlist[this.currentIndex]);
        if (this.isPlaying) this.audio.play();
    }

    playNext() {
        if (this.playlist.length === 0) return;

        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadSong(this.playlist[this.currentIndex]);
        if (this.isPlaying) this.audio.play();
    }

    handleSongEnd() {
        switch (this.repeatMode) {
            case 'one':
                this.audio.currentTime = 0;
                this.audio.play();
                break;
            case 'all':
                this.playNext();
                break;
            default:
                if (this.currentIndex < this.playlist.length - 1) {
                    this.playNext();
                } else {
                    this.isPlaying = false;
                    this.updatePlayButton();
                }
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        document.getElementById('shuffle').classList.toggle('active');
        if (this.isShuffled) {
            this.shufflePlaylist();
        }
    }

    shufflePlaylist() {
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
    }

    toggleRepeat() {
        const repeatBtn = document.getElementById('repeat');
        switch (this.repeatMode) {
            case 'none':
                this.repeatMode = 'one';
                repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
                repeatBtn.title = 'Repetir una canción';
                break;
            case 'one':
                this.repeatMode = 'all';
                repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
                repeatBtn.title = 'Repetir todas';
                break;
            default:
                this.repeatMode = 'none';
                repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
                repeatBtn.title = 'Sin repetición';
        }
    }

    seekTo(e) {
        const progress = document.querySelector('.progress');
        const percent = e.offsetX / progress.offsetWidth;
        this.audio.currentTime = percent * this.audio.duration;
    }

    updateProgress() {
        const progress = document.querySelector('.progress-filled');
        const currentTime = document.getElementById('current-time');
        
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        progress.style.width = `${percent}%`;
        
        currentTime.textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        const duration = document.getElementById('duration');
        duration.textContent = this.formatTime(this.audio.duration);
    }

    setVolume(value) {
        this.volume = value;
        this.audio.volume = value;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    async loadPlaylist(playlist) {
        this.playlist = playlist;
        this.currentIndex = 0;
        if (this.playlist.length > 0) {
            await this.loadSong(this.playlist[0]);
        }
    }
}

// Inicializar reproductor
const player = new Player(); 