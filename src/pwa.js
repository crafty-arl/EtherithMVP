// PWA functionality - refactored for ES modules

export class HelloWorldPWA {
  constructor() {
    this.deferredPrompt = null
    this.init()
  }

  async init() {
    console.log('Hello World PWA: Initializing...')
    
    // Register service worker
    await this.registerServiceWorker()
    
    // Setup UI
    this.setupUI()
    
    // Setup network status monitoring
    this.setupNetworkMonitoring()
    
    // Setup install prompt
    this.setupInstallPrompt()
    
    // Start clock
    this.startClock()
    
    console.log('Hello World PWA: Initialization complete')
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        console.log('Service Worker: Registering...')
        const registration = await navigator.serviceWorker.register('/sw.js')
        
        console.log('Service Worker: Registered successfully', registration)
        this.updateSWStatus('Registered ✅')
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          console.log('Service Worker: Update found')
          this.updateSWStatus('Updating...')
          
          const newWorker = registration.installing
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('Service Worker: Updated')
                this.updateSWStatus('Updated ✅')
                this.showUpdateAvailable()
              } else {
                console.log('Service Worker: Installed')
                this.updateSWStatus('Installed ✅')
              }
            }
          })
        })
        
      } catch (error) {
        console.error('Service Worker: Registration failed', error)
        this.updateSWStatus('Failed ❌')
      }
    } else {
      console.log('Service Worker: Not supported')
      this.updateSWStatus('Not supported')
    }
  }

  setupUI() {
    // Install button
    const installBtn = document.getElementById('installBtn')
    if (installBtn) {
      installBtn.addEventListener('click', () => this.installApp())
      installBtn.style.display = 'none' // Initially hide
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn')
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshContent())
    }
  }

  setupNetworkMonitoring() {
    const updateNetworkStatus = () => {
      const statusElement = document.getElementById('networkStatus')
      if (statusElement) {
        if (navigator.onLine) {
          statusElement.textContent = '🌐 Online'
          statusElement.className = 'status-online'
        } else {
          statusElement.textContent = '📴 Offline'
          statusElement.className = 'status-offline'
        }
      }
    }

    // Initial status
    updateNetworkStatus()

    // Listen for changes
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)
  }

  setupInstallPrompt() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: Install prompt available')
      
      // Prevent the mini-infobar from appearing
      e.preventDefault()
      
      // Save the event for later use
      this.deferredPrompt = e
      
      // Show install button
      const installBtn = document.getElementById('installBtn')
      if (installBtn) {
        installBtn.style.display = 'inline-flex'
      }
    })

    // Listen for app installed event
    window.addEventListener('appinstalled', (e) => {
      console.log('PWA: App installed successfully')
      
      // Hide install button
      const installBtn = document.getElementById('installBtn')
      if (installBtn) {
        installBtn.style.display = 'none'
      }
      
      // Clear the deferredPrompt
      this.deferredPrompt = null
      
      // Show success message
      this.showMessage('App installed successfully! 🎉')
    })
  }

  async installApp() {
    if (!this.deferredPrompt) {
      console.log('PWA: No install prompt available')
      this.showMessage('Install not available. Try adding to home screen manually.')
      return
    }

    console.log('PWA: Showing install prompt')
    
    // Show the install prompt
    this.deferredPrompt.prompt()
    
    // Wait for the user to respond
    const { outcome } = await this.deferredPrompt.userChoice
    console.log(`PWA: User response to install prompt: ${outcome}`)
    
    if (outcome === 'accepted') {
      this.showMessage('Thanks for installing! 🎉')
    } else {
      this.showMessage('Maybe next time! 😊')
    }
    
    // Clear the deferredPrompt
    this.deferredPrompt = null
    
    // Hide install button
    const installBtn = document.getElementById('installBtn')
    if (installBtn) {
      installBtn.style.display = 'none'
    }
  }

  refreshContent() {
    console.log('PWA: Refreshing content...')
    
    const refreshBtn = document.getElementById('refreshBtn')
    if (!refreshBtn) return
    
    const originalText = refreshBtn.textContent
    
    refreshBtn.innerHTML = '<span class="loading"></span> Refreshing...'
    refreshBtn.disabled = true
    
    // Simulate content refresh
    setTimeout(() => {
      refreshBtn.textContent = originalText
      refreshBtn.disabled = false
      this.showMessage('Content refreshed! ✨')
      
      // Update the time
      this.updateClock()
    }, 1500)
  }

  startClock() {
    this.updateClock()
    // Update every second
    setInterval(() => this.updateClock(), 1000)
  }

  updateClock() {
    const timeElement = document.getElementById('currentTime')
    if (!timeElement) return
    
    const now = new Date()
    
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    
    timeElement.textContent = now.toLocaleDateString('en-US', options)
  }

  updateSWStatus(status) {
    const statusElement = document.getElementById('swState')
    if (statusElement) {
      statusElement.textContent = status
    }
  }

  showUpdateAvailable() {
    this.showMessage('App update available! Refresh to get the latest version. 🔄')
  }

  showMessage(message) {
    // Create temporary message element
    const messageEl = document.createElement('div')
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      animation: slideInRight 0.3s ease;
      max-width: 300px;
      font-size: 14px;
      line-height: 1.4;
    `
    
    messageEl.textContent = message
    document.body.appendChild(messageEl)
    
    // Remove after 5 seconds
    setTimeout(() => {
      messageEl.style.animation = 'slideOutRight 0.3s ease forwards'
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.parentNode.removeChild(messageEl)
        }
      }, 300)
    }, 5000)
  }
}
