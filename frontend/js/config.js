const CONFIG = {
    API_URL: 'http://localhost:3000/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            PROFILE: '/auth/profile'
        },
        SONGS: {
            LIST: '/songs',
            UPLOAD: '/songs',
            GET: (id) => `/songs/${id}`,
            UPDATE: (id) => `/songs/${id}`,
            DELETE: (id) => `/songs/${id}`
        },
        PLAYLISTS: {
            LIST: '/playlists',
            CREATE: '/playlists',
            GET: (id) => `/playlists/${id}`,
            UPDATE: (id) => `/playlists/${id}`,
            DELETE: (id) => `/playlists/${id}`,
            ADD_SONG: (playlistId, songId) => `/playlists/${playlistId}/songs/${songId}`,
            REMOVE_SONG: (playlistId, songId) => `/playlists/${playlistId}/songs/${songId}`
        }
    },
    STORAGE_KEYS: {
        TOKEN: 'spotifake_token',
        USER: 'spotifake_user'
    },
    AUDIO: {
        DEFAULT_VOLUME: 0.7,
        FADE_DURATION: 0.5
    },
    VISUALIZER: {
        COLORS: ['#1DB954', '#1ED760', '#1AA34A'],
        BAR_COUNT: 32,
        BAR_WIDTH: 4,
        BAR_GAP: 2
    }
}; 