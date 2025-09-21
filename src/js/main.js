// Main application entry point
import { authManager, requireAuth } from './auth.js';
import { storageManager } from './storage.js';

class EtherithApp {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            // Initialize core services
            await this.initializeServices();

            // Set up global event listeners
            this.setupGlobalEventListeners();

            // Initialize page-specific functionality
            this.initializePage();

            // Update app version display
            this.updateVersionDisplay();

            this.initialized = true;
            console.log('Etherith app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Etherith app:', error);
        }
    }

    async initializeServices() {
        // Initialize storage manager
        await storageManager.init();

        // Initialize auth manager (already done in auth.js)
        if (authManager.isAuthenticated()) {
            authManager.updateUI();
        }
    }

    setupGlobalEventListeners() {
        // Handle PWA install prompt
        this.setupPWAInstall();

        // Handle keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Handle navigation
        this.setupNavigation();

        // Handle clipboard operations
        this.setupClipboard();
    }

    setupPWAInstall() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            console.log('Etherith installed as PWA');
            this.hideInstallPrompt();
        });
    }

    showInstallPrompt() {
        // Could add a custom install prompt UI here
        console.log('PWA install available');
    }

    hideInstallPrompt() {
        // Hide custom install prompt
        console.log('PWA install prompt hidden');
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Global keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.focusSearch();
                        break;
                    case 'u':
                        e.preventDefault();
                        if (authManager.isAuthenticated()) {
                            window.location.href = '/upload.html';
                        }
                        break;
                    case 'm':
                        e.preventDefault();
                        if (authManager.isAuthenticated()) {
                            window.location.href = '/memories.html';
                        }
                        break;
                    case 'h':
                        e.preventDefault();
                        if (authManager.isAuthenticated()) {
                            window.location.href = '/dashboard.html';
                        }
                        break;
                }
            }

            // Escape key handling
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    setupNavigation() {
        // Add active states to navigation
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/dashboard.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupClipboard() {
        // Set up copy button functionality
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
                const button = e.target.classList.contains('copy-btn') ? e.target : e.target.closest('.copy-btn');
                const textToCopy = this.getTextToCopy(button);

                if (textToCopy) {
                    try {
                        await navigator.clipboard.writeText(textToCopy);
                        this.showCopyFeedback(button);
                    } catch (error) {
                        console.error('Failed to copy to clipboard:', error);
                        this.fallbackCopy(textToCopy);
                    }
                }
            }
        });
    }

    getTextToCopy(button) {
        // Find the text to copy based on button context
        const parent = button.closest('.cid-container, .detail-item');
        if (parent) {
            const codeElement = parent.querySelector('code, .cid-display');
            if (codeElement) {
                return codeElement.textContent.trim();
            }
        }
        return null;
    }

    showCopyFeedback(button) {
        const originalText = button.textContent;
        button.textContent = '✅';
        button.style.color = '#22c55e';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.color = '';
        }, 2000);
    }

    fallbackCopy(text) {
        // Fallback copy method for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            console.log('Text copied using fallback method');
        } catch (error) {
            console.error('Fallback copy failed:', error);
        }
        document.body.removeChild(textArea);
    }

    focusSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal:not(.hidden)');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    initializePage() {
        const page = this.getCurrentPage();
        console.log(`Initializing ${page} page`);

        // Page-specific initialization
        switch (page) {
            case 'index':
                this.initIndexPage();
                break;
            case 'dashboard':
                this.initDashboardPage();
                break;
            case 'upload':
                this.initUploadPage();
                break;
            case 'memories':
                this.initMemoriesPage();
                break;
            case 'shared':
                this.initSharedPage();
                break;
            case 'peers':
                this.initPeersPage();
                break;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'index';
        if (path === '/dashboard.html') return 'dashboard';
        if (path === '/upload.html') return 'upload';
        if (path === '/memories.html') return 'memories';
        if (path === '/shared.html') return 'shared';
        if (path === '/peers.html') return 'peers';
        return 'unknown';
    }

    initIndexPage() {
        // Login page is handled by auth.js
        console.log('Index page initialized');
    }

    initDashboardPage() {
        if (!requireAuth()) return;
        console.log('Dashboard page initialized');
    }

    initUploadPage() {
        if (!requireAuth()) return;
        console.log('Upload page initialized');
    }

    initMemoriesPage() {
        if (!requireAuth()) return;
        console.log('Memories page initialized');
    }

    initSharedPage() {
        if (!requireAuth()) return;
        console.log('Shared page initialized');
    }

    initPeersPage() {
        if (!requireAuth()) return;
        console.log('Peers page initialized');
    }

    updateVersionDisplay() {
        const versionElements = document.querySelectorAll('#appVersion');
        versionElements.forEach(element => {
            element.textContent = this.version;
        });
    }

    // Utility methods
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    formatDate(date) {
        if (!date) return 'Unknown';
        if (typeof date === 'string') date = new Date(date);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    debounce(func, wait) {
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

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize the app
const app = new EtherithApp();

// Make app available globally for debugging
window.etherithApp = app;

export { app as etherithApp };