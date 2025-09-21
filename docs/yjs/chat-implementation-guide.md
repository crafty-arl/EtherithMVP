# Yjs Chat Implementation Guide

## Overview

This guide explains how to implement a collaborative chat application using Yjs, covering the architecture, implementation patterns, and best practices used in our chat applications.

## Architecture

### Core Components

1. **Y.Doc**: The shared document container
2. **Y.Array**: For storing chat messages
3. **Y.Map**: For user presence and metadata
4. **Synchronization**: Cross-tab and persistence layer
5. **UI Layer**: DOM manipulation and event handling

### Data Structure Design

```javascript
// Document structure
const ydoc = new Y.Doc()
const messagesArray = ydoc.getArray('messages')  // Chat messages
const usersMap = ydoc.getMap('users')           // Active users
const typingMap = ydoc.getMap('typing')         // Typing indicators
```

## Message Structure

### Message Object Schema
```javascript
const message = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    text: 'Hello world!',
    username: 'Alice',
    userId: 'user_12345',
    timestamp: Date.now()
}
```

### Adding Messages
```javascript
function sendMessage(text, username, userId) {
    const message = {
        id: generateMessageId(),
        text: text.trim(),
        username: username,
        userId: userId,
        timestamp: Date.now()
    }

    // Add to shared array
    messagesArray.push([message])
}
```

## User Presence System

### User Object Schema
```javascript
const user = {
    username: 'Alice',
    lastSeen: Date.now(),
    color: '#3498db'  // Generated from username
}
```

### Managing User Presence
```javascript
function updateUserPresence(userId, username) {
    usersMap.set(userId, {
        username: username,
        lastSeen: Date.now(),
        color: generateUserColor(username)
    })
}

function generateUserColor(username) {
    let hash = 0
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 65%, 55%)`
}
```

### Cleanup Inactive Users
```javascript
function cleanupInactiveUsers() {
    const now = Date.now()
    const timeout = 60000 // 1 minute

    Array.from(usersMap.keys()).forEach(userId => {
        const user = usersMap.get(userId)
        if (user && (now - user.lastSeen) > timeout) {
            usersMap.delete(userId)
        }
    })
}
```

## Typing Indicators

### Typing Object Schema
```javascript
const typing = {
    username: 'Alice',
    timestamp: Date.now()
}
```

### Implementation
```javascript
let typingTimer = null

function handleTyping(userId, username) {
    // Clear existing timer
    if (typingTimer) {
        clearTimeout(typingTimer)
    }

    // Show typing indicator
    typingMap.set(userId, {
        username: username,
        timestamp: Date.now()
    })

    // Remove after timeout
    typingTimer = setTimeout(() => {
        typingMap.delete(userId)
    }, 3000)
}
```

## Synchronization

### Local Persistence
```javascript
function setupPersistence() {
    const storageKey = 'yjs-chat-v1'

    // Load existing state
    try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
            const update = new Uint8Array(JSON.parse(saved))
            Y.applyUpdate(ydoc, update)
        }
    } catch (error) {
        console.warn('Could not load saved state:', error)
    }

    // Save on updates
    ydoc.on('update', (update) => {
        try {
            const updateArray = Array.from(update)
            localStorage.setItem(storageKey, JSON.stringify(updateArray))
        } catch (error) {
            console.warn('Could not save state:', error)
        }
    })
}
```

### Cross-Tab Synchronization
```javascript
function setupCrossTabSync() {
    const eventName = 'yjs-chat-update'

    // Broadcast updates to other tabs
    ydoc.on('update', (update) => {
        const updateArray = Array.from(update)
        window.dispatchEvent(new CustomEvent(eventName, {
            detail: { update: updateArray }
        }))
    })

    // Listen for updates from other tabs
    window.addEventListener(eventName, (event) => {
        try {
            const update = new Uint8Array(event.detail.update)
            Y.applyUpdate(ydoc, update)
        } catch (error) {
            console.warn('Could not apply cross-tab update:', error)
        }
    })

    // Listen for storage changes
    window.addEventListener('storage', (event) => {
        if (event.key === storageKey && event.newValue) {
            try {
                const update = new Uint8Array(JSON.parse(event.newValue))
                Y.applyUpdate(ydoc, update)
            } catch (error) {
                console.warn('Could not apply storage update:', error)
            }
        }
    })
}
```

## Event Handling

### Observing Changes
```javascript
function setupObservers() {
    // Listen for message changes
    messagesArray.observe(() => {
        renderMessages()
        updateMessageCount()
    })

    // Listen for user changes
    usersMap.observe(() => {
        renderUsers()
    })

    // Listen for typing changes
    typingMap.observe(() => {
        renderTypingIndicators()
    })
}
```

### UI Rendering
```javascript
function renderMessages() {
    const messages = messagesArray.toArray()
    const container = document.getElementById('messages')

    // Clear existing messages (except system messages)
    const userMessages = container.querySelectorAll('.message:not(.system)')
    userMessages.forEach(msg => msg.remove())

    // Render all messages
    messages.forEach(message => {
        const messageEl = createMessageElement(message)
        container.appendChild(messageEl)
    })

    // Auto-scroll to bottom
    container.scrollTop = container.scrollHeight
}

function createMessageElement(message) {
    const div = document.createElement('div')
    div.className = `message ${message.userId === currentUserId ? 'own' : 'other'}`

    const time = new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })

    div.innerHTML = `
        <div class="message-header">${escapeHtml(message.username)} • ${time}</div>
        <div class="message-text">${escapeHtml(message.text)}</div>
    `

    return div
}
```

## Error Handling

### Robust Error Handling
```javascript
function safeOperation(operation, fallback = null) {
    try {
        return operation()
    } catch (error) {
        console.warn('Operation failed:', error)
        return fallback
    }
}

// Usage
const messages = safeOperation(() => messagesArray.toArray(), [])
```

### Network Resilience
```javascript
function handleConnectionIssues() {
    // Monitor online/offline status
    window.addEventListener('online', () => {
        updateConnectionStatus('Online', 'success')
    })

    window.addEventListener('offline', () => {
        updateConnectionStatus('Offline', 'warning')
    })
}
```

## Performance Optimization

### Batching Operations
```javascript
function sendMultipleMessages(messages) {
    ydoc.transact(() => {
        messages.forEach(message => {
            messagesArray.push([message])
        })
    })
}
```

### Limiting Message History
```javascript
function limitMessageHistory(maxMessages = 1000) {
    if (messagesArray.length > maxMessages) {
        const excess = messagesArray.length - maxMessages
        messagesArray.delete(0, excess)
    }
}
```

### Debounced Updates
```javascript
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

const debouncedRender = debounce(renderMessages, 100)
```

## Security Considerations

### Input Sanitization
```javascript
function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}

function sanitizeMessage(text) {
    // Remove or escape potentially dangerous content
    return text.trim().slice(0, 1000) // Limit length
}
```

### Validation
```javascript
function validateMessage(message) {
    return (
        message &&
        typeof message.text === 'string' &&
        typeof message.username === 'string' &&
        typeof message.userId === 'string' &&
        typeof message.timestamp === 'number' &&
        message.text.length > 0 &&
        message.text.length <= 1000 &&
        message.username.length > 0 &&
        message.username.length <= 50
    )
}
```

## Testing Strategies

### Multi-Tab Testing
1. Open application in multiple browser tabs
2. Send messages from different tabs
3. Verify real-time synchronization
4. Test typing indicators
5. Test user presence

### Offline Testing
1. Disconnect network
2. Send messages offline
3. Reconnect network
4. Verify messages sync correctly

### Performance Testing
1. Send large number of messages
2. Monitor memory usage
3. Test with multiple concurrent users
4. Measure sync latency

## Deployment Considerations

### Environment Variables
```javascript
const config = {
    storageKey: process.env.STORAGE_KEY || 'yjs-chat-default',
    maxMessages: parseInt(process.env.MAX_MESSAGES) || 1000,
    userTimeout: parseInt(process.env.USER_TIMEOUT) || 60000
}
```

### CDN Fallbacks
```javascript
const YJS_SOURCES = [
    'https://unpkg.com/yjs@13.6.10/dist/yjs.min.js',
    'https://cdn.jsdelivr.net/npm/yjs@13.6.10/dist/yjs.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/yjs/13.6.10/yjs.min.js'
]
```

This guide provides a comprehensive foundation for building robust, collaborative chat applications with Yjs.