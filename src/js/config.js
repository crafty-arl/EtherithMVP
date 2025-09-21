/**
 * Configuration file for Etherith
 * Manages environment-specific settings
 */

// Detect environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
const isPreview = window.location.hostname.includes('pages.dev') && !window.location.hostname.includes('etherith-mvp.pages.dev');
const isProduction = window.location.hostname === 'etherith-production.pages.dev' || window.location.hostname === 'etherith.app';

// Discord Configuration
export const DISCORD_CONFIG = {
    // Client ID will be set during deployment via environment variables
    // For local development, you can temporarily hardcode your dev app client ID here
    clientId: isDevelopment 
        ? 'YOUR_DEVELOPMENT_DISCORD_CLIENT_ID' // Replace with your dev Discord app client ID
        : '1372269269143916544', // Production Discord app client ID
    
    redirectUri: window.location.origin + '/dashboard.html',
    scope: 'identify email',
    responseType: 'code',
    apiBase: window.location.origin,
    workerEndpoint: '/discord-oauth'
};

// API Configuration
export const API_CONFIG = {
    baseURL: isDevelopment 
        ? 'http://localhost:8787' // Local development
        : 'https://etherith-memory-extractor.carl-6e7.workers.dev', // Production Worker
    
    endpoints: {
        memories: '/api/memories',
        upload: '/api/upload',
        auth: '/discord-oauth'
    }
};

// Environment info
export const ENV_INFO = {
    isDevelopment,
    isPreview, 
    isProduction,
    hostname: window.location.hostname,
    origin: window.location.origin
};

// Debug logging in development
if (isDevelopment) {
    console.log('Environment Configuration:', {
        discord: DISCORD_CONFIG,
        api: API_CONFIG,
        env: ENV_INFO
    });
}
