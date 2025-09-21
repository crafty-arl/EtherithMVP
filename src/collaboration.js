// Simple collaboration functionality
// This provides basic real-time sync across browser tabs using localStorage

export function initSimpleCollaboration() {
  console.log('🤝 Initializing simple collaboration...')
  
  // Check if collaboration elements exist
  const collaborationElements = {
    counter: document.getElementById('sharedCounter'),
    incrementBtn: document.getElementById('incrementBtn'),
    decrementBtn: document.getElementById('decrementBtn'),
    resetBtn: document.getElementById('resetBtn'),
    sharedText: document.getElementById('sharedText'),
    status: document.getElementById('collaborationStatus'),
    docState: document.getElementById('docState')
  }
  
  // Only initialize if collaboration elements are present
  const hasCollabElements = Object.values(collaborationElements).some(el => el !== null)
  
  if (!hasCollabElements) {
    console.log('⚠️ No collaboration elements found, skipping collaboration setup')
    return
  }
  
  console.log('✅ Collaboration elements found, setting up...')
  
  let isUpdating = false
  
  // Load existing state
  function loadState() {
    try {
      const counter = localStorage.getItem('simple-collab-counter') || '0'
      const text = localStorage.getItem('simple-collab-text') || ''
      
      if (collaborationElements.counter) {
        collaborationElements.counter.textContent = counter
      }
      
      if (collaborationElements.sharedText) {
        collaborationElements.sharedText.value = text
      }
      
      updateDocState()
    } catch (error) {
      console.warn('Could not load collaboration state:', error)
    }
  }
  
  // Save state and broadcast to other tabs
  function saveState() {
    if (isUpdating) return
    
    try {
      const counter = collaborationElements.counter?.textContent || '0'
      const text = collaborationElements.sharedText?.value || ''
      
      localStorage.setItem('simple-collab-counter', counter)
      localStorage.setItem('simple-collab-text', text)
      
      // Broadcast to other tabs
      window.dispatchEvent(new CustomEvent('simple-collab-update', {
        detail: { counter, text, timestamp: Date.now() }
      }))
      
      updateDocState()
    } catch (error) {
      console.warn('Could not save collaboration state:', error)
    }
  }
  
  // Update document state display
  function updateDocState() {
    if (!collaborationElements.docState) return
    
    const counter = collaborationElements.counter?.textContent || '0'
    const text = collaborationElements.sharedText?.value || ''
    
    const state = {
      counter: parseInt(counter),
      textLength: text.length,
      text: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
      timestamp: new Date().toISOString(),
      framework: 'Vite + Vanilla JS'
    }
    
    collaborationElements.docState.textContent = JSON.stringify(state, null, 2)
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Counter buttons
    if (collaborationElements.incrementBtn) {
      collaborationElements.incrementBtn.addEventListener('click', () => {
        const current = parseInt(collaborationElements.counter?.textContent || '0')
        if (collaborationElements.counter) {
          collaborationElements.counter.textContent = current + 1
        }
        saveState()
      })
    }
    
    if (collaborationElements.decrementBtn) {
      collaborationElements.decrementBtn.addEventListener('click', () => {
        const current = parseInt(collaborationElements.counter?.textContent || '0')
        if (collaborationElements.counter) {
          collaborationElements.counter.textContent = Math.max(0, current - 1)
        }
        saveState()
      })
    }
    
    if (collaborationElements.resetBtn) {
      collaborationElements.resetBtn.addEventListener('click', () => {
        if (collaborationElements.counter) {
          collaborationElements.counter.textContent = '0'
        }
        if (collaborationElements.sharedText) {
          collaborationElements.sharedText.value = ''
        }
        saveState()
      })
    }
    
    // Text area changes
    if (collaborationElements.sharedText) {
      collaborationElements.sharedText.addEventListener('input', saveState)
    }
    
    // Listen for updates from other tabs
    window.addEventListener('simple-collab-update', (event) => {
      if (isUpdating) return
      
      isUpdating = true
      
      if (collaborationElements.counter) {
        collaborationElements.counter.textContent = event.detail.counter
      }
      
      if (collaborationElements.sharedText) {
        collaborationElements.sharedText.value = event.detail.text
      }
      
      updateDocState()
      
      setTimeout(() => {
        isUpdating = false
      }, 50)
    })
    
    // Listen for storage changes (cross-tab)
    window.addEventListener('storage', (event) => {
      if (event.key === 'simple-collab-counter' || event.key === 'simple-collab-text') {
        loadState()
      }
    })
  }
  
  // Initialize
  loadState()
  setupEventListeners()
  
  // Update status
  if (collaborationElements.status) {
    collaborationElements.status.textContent = '✅ Simple collaboration active (Vite powered)!'
  }
  
  console.log('🎉 Simple collaboration initialized successfully')
  
  // Show instructions in console
  setTimeout(() => {
    console.log('🎯 COLLABORATION INSTRUCTIONS:')
    console.log('1. Open this page in multiple tabs')
    console.log('2. Click the counter buttons in one tab')
    console.log('3. Type in the text area in another tab')
    console.log('4. Watch everything sync automatically!')
    console.log('5. Powered by Vite for fast development! 🔥')
  }, 1000)
}
