// Import configuration
import { DISCORD_CONFIG } from './config.js';

// Auth state management
class AuthManager {
    constructor() {
        this.user = null;
        this.accessToken = null;
        this.init();
    }

    init() {
        // Load stored auth data
        this.loadStoredAuth();

        // Handle OAuth redirect
        this.handleOAuthRedirect();

        // Set up UI event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginBtn = document.getElementById('discord-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.startLogin());
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    loadStoredAuth() {
        try {
            const storedUser = localStorage.getItem('etherith_user');
            const storedToken = localStorage.getItem('etherith_token');

            if (storedUser && storedToken) {
                this.user = JSON.parse(storedUser);
                this.accessToken = storedToken;

                // Verify token is still valid
                this.verifyToken();
            }
        } catch (error) {
            console.error('Error loading stored auth:', error);
            this.clearStoredAuth();
        }
    }

    async verifyToken() {
        if (!this.accessToken) return false;

        try {
            const response = await fetch(`${DISCORD_CONFIG.apiBase}${DISCORD_CONFIG.workerEndpoint}/user`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                this.user = userData;
                this.saveAuth();
                return true;
            } else {
                this.clearStoredAuth();
                return false;
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            this.clearStoredAuth();
            return false;
        }
    }

    startLogin() {
        const params = new URLSearchParams({
            client_id: DISCORD_CONFIG.clientId,
            redirect_uri: DISCORD_CONFIG.redirectUri,
            response_type: DISCORD_CONFIG.responseType,
            scope: DISCORD_CONFIG.scope
        });

        const authUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
        window.location.href = authUrl;
    }

    async handleOAuthRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            console.error('OAuth error:', error);
            this.showError('Login failed: ' + error);
            return;
        }

        if (code) {
            try {
                await this.exchangeCodeForToken(code);
                // Clear URL parameters
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error('Token exchange failed:', error);
                this.showError('Login failed. Please try again.');
            }
        }
    }

    async exchangeCodeForToken(code) {
        try {
            // Exchange code for token using secure Worker endpoint
            const response = await fetch(`${DISCORD_CONFIG.apiBase}${DISCORD_CONFIG.workerEndpoint}/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    redirect_uri: DISCORD_CONFIG.redirectUri,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Token exchange failed');
            }

            const data = await response.json();
            
            // Store token and user data
            this.accessToken = data.access_token;
            this.user = data.user;
            
            // Save auth data
            this.saveAuth();
            this.updateUI();
            
            console.log('Successfully authenticated with Discord');
            
        } catch (error) {
            console.error('Discord OAuth error:', error);
            throw error;
        }
    }

    saveAuth() {
        if (this.user && this.accessToken) {
            localStorage.setItem('etherith_user', JSON.stringify(this.user));
            localStorage.setItem('etherith_token', this.accessToken);
        }
    }

    clearStoredAuth() {
        localStorage.removeItem('etherith_user');
        localStorage.removeItem('etherith_token');
        this.user = null;
        this.accessToken = null;
    }

    logout() {
        this.clearStoredAuth();
        window.location.href = '/';
    }

    updateUI() {
        // Update user profile display
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (this.user && userAvatar && userName) {
            const avatarUrl = this.user.avatar
                ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png?size=128`
                : `https://cdn.discordapp.com/embed/avatars/${this.user.discriminator % 5}.png`;

            userAvatar.src = avatarUrl;
            userAvatar.alt = `${this.user.username}'s avatar`;
            userName.textContent = this.user.global_name || this.user.username;
        }
    }

    showError(message) {
        // Simple error display - could be enhanced with better UI
        alert(message);
    }

    // Public methods for other modules
    isAuthenticated() {
        return this.user !== null && this.accessToken !== null;
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.accessToken;
    }

    getUserAvatar() {
        if (!this.user) return null;

        return this.user.avatar
            ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png?size=128`
            : `https://cdn.discordapp.com/embed/avatars/${this.user.discriminator % 5}.png`;
    }
}

// Authentication guard for protected pages
function requireAuth() {
    const auth = new AuthManager();

    if (!auth.isAuthenticated()) {
        window.location.href = '/';
        return false;
    }

    return true;
}

// Initialize auth manager
const authManager = new AuthManager();

// Make auth manager available globally
window.authManager = authManager;

export { AuthManager, authManager, requireAuth };