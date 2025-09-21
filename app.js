// Yjs PWA Demo - Comprehensive Collaborative Application
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';
import * as awarenessProtocol from 'y-protocols/awareness';
import Quill from 'quill';

class YjsPWADemo {
  constructor() {
    this.deferredPrompt = null;
    this.yjsDoc = null;
    this.provider = null;
    this.awareness = null;

    // Shared types
    this.ymap = null;
    this.yarray = null;
    this.ytext = null;
    this.quillText = null;

    // UI state
    this.currentDemo = 'editor';
    this.quillEditor = null;
    this.quillBinding = null;

    // User state
    this.userId = this.generateUserId();
    this.userProfile = {
      name: `User-${this.userId.slice(-4)}`,
      color: this.generateRandomColor()
    };

    this.init();
  }

  async init() {
    console.log('Yjs PWA Demo: Initializing...');

    // Register service worker
    await this.registerServiceWorker();

    // Setup UI navigation
    this.setupNavigation();

    // Initialize Yjs collaboration
    this.initYjs();

    // Setup demo sections
    this.setupEditorDemo();
    this.setupDataStructuresDemo();
    this.setupAwarenessDemo();

    // Setup install prompt
    this.setupInstallPrompt();

    // Update UI with initial state
    this.updateFooterInfo();

    console.log('Yjs PWA Demo: Initialization complete');
  }

  // Utility functions
  generateUserId() {
    return Math.random().toString(36).substr(2, 9);
  }

  generateRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Library availability checker
  checkLibraryAvailability() {
    return {
      yjs: typeof Y !== 'undefined',
      quill: typeof Quill !== 'undefined',
      quillBinding: typeof QuillBinding !== 'undefined',
      websocketProvider: typeof WebsocketProvider !== 'undefined',
      awarenessProtocol: typeof awarenessProtocol !== 'undefined'
    };
  }

  // Show library loading error with helpful information
  showLibraryLoadingError() {
    const libraryStatus = this.checkLibraryAvailability();
    const missingLibraries = Object.entries(libraryStatus)
      .filter(([name, available]) => !available)
      .map(([name]) => name);

    console.warn('Missing libraries:', missingLibraries);

    // Update UI to show degraded state
    this.showDegradedModeMessage(missingLibraries);
  }

  // Show degraded mode message to user
  showDegradedModeMessage(missingLibraries) {
    const demoSections = document.querySelectorAll('.demo-section');
    demoSections.forEach(section => {
      const warningDiv = document.createElement('div');
      warningDiv.className = 'library-warning';
      warningDiv.style.cssText = `
        background: #FFF3CD;
        border: 1px solid #FFEAA7;
        color: #856404;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      `;
      warningDiv.innerHTML = `
        ⚠️ <strong>Limited Functionality</strong><br>
        Some collaborative features are unavailable due to library loading issues.<br>
        Missing: ${missingLibraries.join(', ')}<br>
        <small>The app will work in demonstration mode with reduced features.</small>
      `;
      section.insertBefore(warningDiv, section.firstChild);
    });
  }

  // Navigation
  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const demoSections = document.querySelectorAll('.demo-section');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const demoType = btn.dataset.demo;
        this.switchDemo(demoType);
      });
    });
  }

  switchDemo(demoType) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.demo === demoType);
    });

    // Update sections
    document.querySelectorAll('.demo-section').forEach(section => {
      section.classList.toggle('active', section.id === `${demoType}-demo`);
    });

    this.currentDemo = demoType;

    // Special handling for editor demo
    if (demoType === 'editor' && this.quillEditor) {
      // Refresh Quill editor after becoming visible
      setTimeout(() => this.quillEditor.getModule('toolbar').update(), 100);
    }
  }

  // Yjs initialization with enhanced library detection
  initYjs() {
    console.log('Yjs: Initializing collaborative features...');

    // Enhanced library detection
    const libraryStatus = this.checkLibraryAvailability();
    if (!libraryStatus.yjs) {
      console.error('Yjs: Core library not loaded');
      this.updateConnectionStatus('disconnected', 'Yjs library not found');
      this.showLibraryLoadingError();
      return;
    }

    // Log available libraries
    console.log('Yjs: Library status:', libraryStatus);

    try {
      // Create Yjs document
      this.yjsDoc = new Y.Doc();

      // Setup shared types
      this.ymap = this.yjsDoc.getMap('demo-map');
      this.yarray = this.yjsDoc.getArray('demo-array');
      this.ytext = this.yjsDoc.getText('demo-text');
      this.quillText = this.yjsDoc.getText('quill-content');

      // Try to use WebSocket provider for real collaboration
      this.setupCollaborationProvider();

      // Setup awareness for presence features
      this.setupAwareness();

      // Initialize default values
      this.initializeDefaultValues();

      console.log('Yjs: Initialization complete');
      this.updateConnectionStatus('connected', 'Connected to demo room');

    } catch (error) {
      console.error('Yjs: Initialization failed', error);
      this.updateConnectionStatus('disconnected', 'Failed to initialize');
    }
  }

  setupCollaborationProvider() {
    try {
      // Try to use WebSocket provider for real-time collaboration
      if (typeof WebsocketProvider !== 'undefined') {
        this.provider = new WebsocketProvider('wss://demos.yjs.dev/ws', 'yjs-pwa-demo', this.yjsDoc);
        this.awareness = this.provider.awareness;

        this.provider.on('status', event => {
          console.log('Provider status:', event.status);
          if (event.status === 'connected') {
            this.updateConnectionStatus('connected', 'Connected to collaboration server');
          } else {
            this.updateConnectionStatus('connecting', 'Connecting...');
          }
        });

        this.provider.on('connection-error', error => {
          console.warn('Provider connection error:', error);
          this.updateConnectionStatus('disconnected', 'Connection error');
        });

      } else {
        // Fallback to local storage for demo purposes
        this.setupLocalStorageSync();
        this.setupLocalAwareness();
      }
    } catch (error) {
      console.warn('Provider setup failed, using local storage:', error);
      this.setupLocalStorageSync();
      this.setupLocalAwareness();
    }
  }

  setupLocalStorageSync() {
    // Simplified local collaboration using localStorage
    const storageKey = 'yjs-pwa-demo-state';

    // Load existing state
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const update = new Uint8Array(JSON.parse(savedState));
        Y.applyUpdate(this.yjsDoc, update);
      } catch (error) {
        console.warn('Failed to load saved state:', error);
      }
    }

    // Save state on updates
    this.yjsDoc.on('update', update => {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(update)));
    });

    this.updateConnectionStatus('connected', 'Local demo mode');
  }

  setupLocalAwareness() {
    // Create local awareness instance
    if (typeof awarenessProtocol !== 'undefined') {
      this.awareness = new awarenessProtocol.Awareness(this.yjsDoc);
    }
  }

  setupAwareness() {
    if (!this.awareness) return;

    // Set local user state
    this.awareness.setLocalState({
      user: this.userProfile,
      cursor: null
    });

    // Listen for awareness changes
    this.awareness.on('change', ({ added, updated, removed }) => {
      this.updateUsersList();
    });
  }

  initializeDefaultValues() {
    // Initialize with some demo content if empty - with null checks
    try {
      if (this.yarray && this.yarray.length === 0) {
        this.yarray.push(['Welcome to Yjs!', 'Real-time collaboration', 'Try it in multiple tabs']);
      }

      if (this.ymap && !this.ymap.has('example')) {
        this.ymap.set('example', 'Hello Yjs!');
        this.ymap.set('timestamp', new Date().toISOString());
        this.ymap.set('counter', 0);
      }

      if (this.ytext && this.ytext.length === 0) {
        this.ytext.insert(0, 'Type here to see real-time synchronization!');
      }

      if (this.quillText && this.quillText.length === 0) {
        this.quillText.insert(0, 'Welcome to collaborative editing with Yjs and Quill!\n\nTry opening this page in multiple tabs to see real-time collaboration in action.');
      }
    } catch (error) {
      console.warn('Failed to initialize default values:', error);
    }
  }

  // Editor Demo Setup
  setupEditorDemo() {
    if (typeof Quill === 'undefined') {
      console.warn('Quill editor not available');
      return;
    }

    try {
      // Initialize Quill editor
      this.quillEditor = new Quill('#quill-editor', {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
          ]
        },
        placeholder: 'Start collaborating...'
      });

      // Bind Quill to Yjs if binding is available
      if (typeof QuillBinding !== 'undefined') {
        this.quillBinding = new QuillBinding(this.quillText, this.quillEditor, this.awareness);
        console.log('Quill binding initialized');
      } else {
        console.warn('QuillBinding not available, using manual sync');
        this.setupManualQuillSync();
      }

    } catch (error) {
      console.error('Failed to setup Quill editor:', error);
    }
  }

  setupManualQuillSync() {
    // Manual synchronization between Quill and Yjs - with null checks
    if (!this.quillEditor || !this.quillText) {
      console.warn('Cannot setup manual sync: missing quillEditor or quillText');
      return;
    }

    try {
      let isUpdating = false;

      this.quillEditor.on('text-change', () => {
        if (isUpdating || !this.quillText) return;

        try {
          const content = this.quillEditor.getText();
          this.quillText.delete(0, this.quillText.length);
          if (content.trim()) {
            this.quillText.insert(0, content);
          }
        } catch (error) {
          console.warn('Failed to sync Quill to Yjs:', error);
        }
      });

      this.quillText.observe(() => {
        if (!this.quillEditor) return;

        try {
          isUpdating = true;
          const content = this.quillText.toString();
          this.quillEditor.setText(content);
          isUpdating = false;
        } catch (error) {
          console.warn('Failed to sync Yjs to Quill:', error);
          isUpdating = false;
        }
      });
    } catch (error) {
      console.error('Failed to setup manual Quill sync:', error);
    }
  }

  // Data Structures Demo Setup
  setupDataStructuresDemo() {
    // Y.Map controls
    const mapSet = document.getElementById('mapSet');
    const mapDelete = document.getElementById('mapDelete');
    const mapKey = document.getElementById('mapKey');
    const mapValue = document.getElementById('mapValue');

    if (mapSet) {
      mapSet.addEventListener('click', () => {
        if (!this.ymap) {
          console.warn('Y.Map not available');
          return;
        }

        const key = mapKey.value.trim();
        const value = mapValue.value.trim();
        if (key && value) {
          try {
            this.ymap.set(key, value);
            mapKey.value = '';
            mapValue.value = '';
          } catch (error) {
            console.warn('Failed to set Y.Map value:', error);
          }
        }
      });
    }

    if (mapDelete) {
      mapDelete.addEventListener('click', () => {
        if (!this.ymap) {
          console.warn('Y.Map not available');
          return;
        }

        const key = mapKey.value.trim();
        if (key) {
          try {
            if (this.ymap.has(key)) {
              this.ymap.delete(key);
            }
            mapKey.value = '';
          } catch (error) {
            console.warn('Failed to delete Y.Map value:', error);
          }
        }
      });
    }

    // Y.Array controls
    const arrayPush = document.getElementById('arrayPush');
    const arrayPop = document.getElementById('arrayPop');
    const arrayItem = document.getElementById('arrayItem');

    if (arrayPush) {
      arrayPush.addEventListener('click', () => {
        if (!this.yarray) {
          console.warn('Y.Array not available');
          return;
        }

        const item = arrayItem.value.trim();
        if (item) {
          try {
            this.yarray.push([item]);
            arrayItem.value = '';
          } catch (error) {
            console.warn('Failed to push to Y.Array:', error);
          }
        }
      });
    }

    if (arrayPop) {
      arrayPop.addEventListener('click', () => {
        if (!this.yarray) {
          console.warn('Y.Array not available');
          return;
        }

        try {
          if (this.yarray.length > 0) {
            this.yarray.delete(this.yarray.length - 1, 1);
          }
        } catch (error) {
          console.warn('Failed to pop from Y.Array:', error);
        }
      });
    }

    // Y.Text controls - with null checks
    const textArea = document.getElementById('textArea');
    if (textArea && this.ytext) {
      let isUpdating = false;

      textArea.addEventListener('input', () => {
        if (isUpdating || !this.ytext) return;

        try {
          const content = textArea.value;
          this.ytext.delete(0, this.ytext.length);
          if (content) {
            this.ytext.insert(0, content);
          }
        } catch (error) {
          console.warn('Failed to update Y.Text:', error);
        }
      });

      try {
        this.ytext.observe(() => {
          if (!this.ytext) return;

          try {
            isUpdating = true;
            textArea.value = this.ytext.toString();
            const lengthEl = document.getElementById('textLength');
            if (lengthEl) {
              lengthEl.textContent = this.ytext.length;
            }
            isUpdating = false;
          } catch (error) {
            console.warn('Failed to update text area from Y.Text:', error);
            isUpdating = false;
          }
        });
      } catch (error) {
        console.warn('Failed to setup Y.Text observer:', error);
      }
    }

    // Setup observers for displays - with null checks
    try {
      if (this.ymap) {
        this.ymap.observe(() => this.updateMapDisplay());
      }
      if (this.yarray) {
        this.yarray.observe(() => this.updateArrayDisplay());
      }
    } catch (error) {
      console.warn('Failed to setup data structure observers:', error);
    }

    // Initial display update
    this.updateMapDisplay();
    this.updateArrayDisplay();
    this.updateTextDisplay();
  }

  updateMapDisplay() {
    const display = document.getElementById('mapDisplay');
    if (!display) return;

    if (!this.ymap) {
      display.textContent = '(Y.Map not available)';
      return;
    }

    try {
      const entries = [];
      this.ymap.forEach((value, key) => {
        entries.push(`${key}: ${JSON.stringify(value)}`);
      });
      display.textContent = entries.length > 0 ? entries.join('\n') : '(empty map)';
    } catch (error) {
      console.warn('Failed to update map display:', error);
      display.textContent = '(error updating map display)';
    }
  }

  updateArrayDisplay() {
    const display = document.getElementById('arrayDisplay');
    if (!display) return;

    if (!this.yarray) {
      display.textContent = '(Y.Array not available)';
      return;
    }

    try {
      const items = this.yarray.toArray();
      display.textContent = items.length > 0 ?
        items.map((item, index) => `[${index}] ${item}`).join('\n') :
        '(empty array)';
    } catch (error) {
      console.warn('Failed to update array display:', error);
      display.textContent = '(error updating array display)';
    }
  }

  updateTextDisplay() {
    const lengthEl = document.getElementById('textLength');
    if (!lengthEl) return;

    if (!this.ytext) {
      lengthEl.textContent = '0';
      return;
    }

    try {
      lengthEl.textContent = this.ytext.length;
    } catch (error) {
      console.warn('Failed to update text display:', error);
      lengthEl.textContent = '0';
    }
  }

  // Awareness Demo Setup
  setupAwarenessDemo() {
    // User profile controls
    const userName = document.getElementById('userName');
    const userColor = document.getElementById('userColor');
    const updateProfile = document.getElementById('updateProfile');

    if (userName) userName.value = this.userProfile.name;
    if (userColor) userColor.value = this.userProfile.color;

    if (updateProfile) {
      updateProfile.addEventListener('click', () => {
        if (userName && userColor) {
          this.userProfile.name = userName.value || `User-${this.userId.slice(-4)}`;
          this.userProfile.color = userColor.value;

          if (this.awareness) {
            this.awareness.setLocalState({
              user: this.userProfile,
              cursor: this.awareness.getLocalState()?.cursor || null
            });
          }
        }
      });
    }

    // Cursor tracking
    const cursorArea = document.getElementById('cursorArea');
    if (cursorArea && this.awareness) {
      cursorArea.addEventListener('mousemove', (e) => {
        const rect = cursorArea.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        this.awareness.setLocalStateField('cursor', { x, y });
      });

      cursorArea.addEventListener('mouseleave', () => {
        this.awareness.setLocalStateField('cursor', null);
      });

      // Listen for remote cursors
      this.awareness.on('change', () => {
        this.updateRemoteCursors();
      });
    }

    // Initial users list update
    this.updateUsersList();
  }

  updateUsersList() {
    const usersList = document.getElementById('usersList');
    if (!usersList || !this.awareness) return;

    const users = [];
    this.awareness.getStates().forEach((state, clientId) => {
      if (state.user && clientId !== this.awareness.clientID) {
        users.push({
          id: clientId,
          ...state.user,
          cursor: state.cursor
        });
      }
    });

    if (users.length === 0) {
      usersList.innerHTML = '<div style="color: #999; font-style: italic;">No other users online</div>';
    } else {
      usersList.innerHTML = users.map(user => `
        <div class="user-item">
          <div class="user-color" style="background-color: ${user.color}"></div>
          <span>${user.name}</span>
        </div>
      `).join('');
    }
  }

  updateRemoteCursors() {
    const cursorArea = document.getElementById('cursorArea');
    if (!cursorArea || !this.awareness) return;

    // Remove existing cursors
    cursorArea.querySelectorAll('.remote-cursor').forEach(cursor => cursor.remove());

    // Add remote cursors
    this.awareness.getStates().forEach((state, clientId) => {
      if (clientId !== this.awareness.clientID && state.cursor && state.user) {
        const cursor = document.createElement('div');
        cursor.className = 'remote-cursor';
        cursor.style.left = `${state.cursor.x}%`;
        cursor.style.top = `${state.cursor.y}%`;

        cursor.innerHTML = `
          <div class="cursor-pointer" style="border-left-color: ${state.user.color}"></div>
          <div class="cursor-label" style="background-color: ${state.user.color}">${state.user.name}</div>
        `;

        cursorArea.appendChild(cursor);
      }
    });
  }

  // Connection status
  updateConnectionStatus(status = 'connected', message = 'Connected') {
    const indicator = document.getElementById('connectionStatus');
    const text = document.getElementById('connectionText');

    if (indicator) {
      indicator.className = `status-indicator ${status}`;
    }

    if (text) {
      text.textContent = message;
    }
  }

  // Footer info
  updateFooterInfo() {
    const clientId = document.getElementById('clientId');
    const documentSize = document.getElementById('documentSize');

    if (clientId) {
      clientId.textContent = `Client ID: ${this.userId}`;
    }

    if (documentSize) {
      if (this.yjsDoc && typeof Y !== 'undefined') {
        try {
          const update = Y.encodeStateAsUpdate(this.yjsDoc);
          documentSize.textContent = `Doc Size: ${update.length} bytes`;
        } catch (error) {
          console.warn('Failed to calculate document size:', error);
          documentSize.textContent = 'Doc Size: N/A';
        }
      } else {
        documentSize.textContent = 'Doc Size: N/A (Yjs not loaded)';
      }
    }

    // Update periodically
    setTimeout(() => this.updateFooterInfo(), 5000);
  }

  // PWA functionality
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;

      // Could show install button here
      console.log('PWA install prompt available');
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      this.deferredPrompt = null;
    });
  }

  async installPWA() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    console.log(`PWA install prompt outcome: ${outcome}`);
    this.deferredPrompt = null;
  }
}

// Initialize the demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.yjsDemo = new YjsPWADemo();
});

// Export for potential module usage
export default YjsPWADemo;

// Add global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});