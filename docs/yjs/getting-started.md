# Yjs Getting Started Guide

## What is Yjs?

Yjs is a high-performance Conflict-free Replicated Data Type (CRDT) library for building collaborative applications that automatically sync data across multiple users or devices.

## Key Concepts

- **Shared Data Types**: Similar to standard data structures like Map and Array, but designed for collaborative editing
- **Automatic Conflict Resolution**: Allows concurrent manipulation of shared objects without merge conflicts
- **Network Agnostic**: Can work with various communication technologies (WebSocket, WebRTC, etc.)
- **Real-time Collaboration**: Enables applications like Google Docs and Figma

## Quick Start Example

```javascript
import * as Y from 'yjs'

// Create a Yjs document
const ydoc = new Y.Doc()

// Get shared types
const ymap = ydoc.getMap()
const yarray = ydoc.getArray()
const ytext = ydoc.getText()

// Manipulate shared data
ymap.set('keyA', 'valueA')
yarray.push(['item1', 'item2'])
ytext.insert(0, 'Hello World!')

// Merge changes from remote document
const update = Y.encodeStateAsUpdate(ydocRemote)
Y.applyUpdate(ydoc, update)
```

## Core Features

- **Automatic Conflict Resolution**: No merge conflicts
- **Editor Support**: Works with ProseMirror, TipTap, Monaco, Quill, and more
- **Offline Editing**: Full offline capabilities with sync when online
- **Scalable Architecture**: Performance-optimized CRDT implementation
- **Modular Framework**: Flexible connection providers

## Collaborative Application Components

A Yjs collaborative application requires three main elements:

1. **Yjs Document** (`Y.Doc`): The shared document container
2. **Editor Binding**: Connects your editor to Yjs shared types
3. **Connection Provider**: Syncs the document between clients

## Basic Collaborative Editor Setup

```javascript
// 1. Create Yjs document
const ydoc = new Y.Doc()

// 2. Get shared text type
const ytext = ydoc.getText('editor-content')

// 3. Create editor binding (example with Quill)
const binding = new QuillBinding(ytext, quillInstance)

// 4. Setup connection provider (example with WebSocket)
const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-room', ydoc)
```

## Shared Types Overview

### Y.Map
```javascript
const ymap = ydoc.getMap('my-map')
ymap.set('name', 'John')
ymap.get('name') // 'John'
```

### Y.Array
```javascript
const yarray = ydoc.getArray('my-array')
yarray.push(['item1', 'item2'])
yarray.get(0) // 'item1'
```

### Y.Text
```javascript
const ytext = ydoc.getText('my-text')
ytext.insert(0, 'Hello ')
ytext.insert(6, 'World!')
ytext.toString() // 'Hello World!'
```

## Connection Providers

Yjs supports multiple connection providers:

- **y-websocket**: WebSocket-based synchronization
- **y-webrtc**: Peer-to-peer WebRTC connections
- **y-dat**: Dat protocol support
- **y-ipfs**: IPFS integration
- **Custom providers**: Build your own

## Best Practices

1. **Use appropriate shared types** for your data structure
2. **Handle offline scenarios** gracefully
3. **Implement proper error handling** for network issues
4. **Consider using awareness** for user presence features
5. **Optimize updates** by batching operations when possible

## Performance Tips

- Use transactions for multiple operations: `ydoc.transact(() => { /* operations */ })`
- Minimize unnecessary observations
- Consider using subdocuments for large applications
- Implement proper cleanup for event listeners