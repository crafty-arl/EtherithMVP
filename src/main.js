// Main entry point for the Vite-powered PWA
import './styles.css'
import { HelloWorldPWA } from './pwa.js'
import { initSimpleCollaboration } from './collaboration.js'

console.log('🚀 Vite + PWA Starting...')

// Initialize the PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 Initializing PWA...')
  
  // Initialize main PWA functionality
  new HelloWorldPWA()
  
  // Initialize collaboration features
  initSimpleCollaboration()
  
  console.log('✅ PWA and collaboration initialized')
  
  // Show Vite info
  if (import.meta.env.DEV) {
    console.log('🔥 Development mode with Vite HMR enabled')
    console.log('📦 App version:', __APP_VERSION__)
    console.log('🕐 Build time:', __BUILD_TIME__)
  }
})
