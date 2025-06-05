class Auth {
    constructor() {
        this.token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
        this.user = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USER));
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Login modal
        const loginBtn = document.getElementById('login-btn');
        const loginModal = document.getElementById('login-modal');
        const loginForm = document.getElementById('login-form');
        const showRegister = document.getElementById('show-register');

        // Register modal
        const registerModal = document.getElementById('register-modal');
        const registerForm = document.getElementById('register-form');
        const showLogin = document.getElementById('show-login');

        // Close buttons
        const closeButtons = document.querySelectorAll('.close');

        loginBtn.addEventListener('click', () => this.showModal(loginModal));
        showRegister.addEventListener('click', () => {
            this.hideModal(loginModal);
            this.showModal(registerModal);
        });
        showLogin.addEventListener('click', () => {
            this.hideModal(registerModal);
            this.showModal(loginModal);
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.hideModal(loginModal);
                this.hideModal(registerModal);
            });
        });

        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    showModal(modal) {
        modal.style.display = 'block';
    }

    hideModal(modal) {
        modal.style.display = 'none';
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            this.setSession(data);
            this.hideModal(document.getElementById('login-modal'));
            this.updateUI();
        } catch (error) {
            alert(error.message);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar usuario');
            }

            this.setSession(data);
            this.hideModal(document.getElementById('register-modal'));
            this.updateUI();
        } catch (error) {
            alert(error.message);
        }
    }

    setSession(data) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.token);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(data.user));
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        this.updateUI();
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const userProfile = document.getElementById('user-profile');
        const username = document.getElementById('username');
        const profileImg = document.getElementById('profile-img');

        if (this.isAuthenticated()) {
            loginBtn.classList.add('hidden');
            userProfile.classList.remove('hidden');
            username.textContent = this.user.username;
            profileImg.src = this.user.profileImage || 'assets/default-avatar.png';
        } else {
            loginBtn.classList.remove('hidden');
            userProfile.classList.add('hidden');
        }
    }

    isAuthenticated() {
        return !!this.token;
    }

    getAuthHeader() {
        return {
            'Authorization': `Bearer ${this.token}`
        };
    }
}

// Inicializar autenticación
const auth = new Auth(); 