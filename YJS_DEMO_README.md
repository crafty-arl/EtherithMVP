# Yjs Hello World Demo Integration

This project now includes a working example of [Yjs](https://docs.yjs.dev/) collaborative functionality integrated into your Hello World PWA.

## What's New

### 🤝 Collaborative Features Added

1. **Shared Counter**: A collaborative counter that syncs across all open tabs/windows
2. **Shared Text Area**: A text area where typing is synchronized in real-time
3. **Document State Viewer**: Shows the current state of the Yjs document
4. **Cross-tab Synchronization**: Changes made in one tab instantly appear in others

### 📁 Files Modified

- `package.json` - Added Yjs dependency
- `index.html` - Added collaborative demo section and Yjs script tag
- `styles.css` - Added styling for the Yjs demo components
- `app.js` - Integrated Yjs collaborative functionality

## How to Test the Collaboration

### Local Testing (Multiple Tabs)

1. **Build and start the development server**:
   ```bash
   npm run build
   npm run dev
   ```

2. **Open multiple tabs**:
   - Open your browser to `http://localhost:8788`
   - Open the same URL in 2-3 additional tabs

3. **Test the collaboration**:
   - **Counter**: Click the +1, -1, or Reset buttons in one tab and watch the counter update in all other tabs
   - **Text**: Type in the text area in one tab and see the text appear in all other tabs
   - **Document State**: Watch the JSON state update showing the current document state

### Features Demonstrated

#### ✅ Automatic Conflict Resolution
- Multiple users can modify the counter simultaneously
- Yjs automatically merges changes without conflicts

#### ✅ Real-time Text Synchronization
- Type in any tab and see changes appear instantly in others
- No conflicts even when typing simultaneously

#### ✅ Persistent State
- The state persists across browser refreshes using localStorage
- The collaborative state is maintained between sessions

## Technical Implementation

### Yjs Document Structure

```javascript
// Main Yjs document
const yjsDoc = new Y.Doc()

// Shared data types
const ymap = yjsDoc.getMap('demo')      // For the counter
const ytext = yjsDoc.getText('sharedText') // For the text area
```

### Synchronization Strategy

This demo uses **localStorage** and **browser events** for synchronization:

- Changes are saved to localStorage automatically
- Custom events broadcast changes to other tabs/windows
- Storage events handle cross-tab synchronization

### Real-world Deployment

For production use, you would replace the localStorage sync with:

- **WebSocket provider** (`y-websocket`)
- **WebRTC provider** (`y-webrtc`) 
- **Hosted solutions** (Liveblocks, Y-Sweet, Tiptap Cloud)

## Example Yjs Hello World Code

The core Yjs integration follows the pattern from the [official docs](https://docs.yjs.dev/):

```javascript
import * as Y from 'yjs'

// Create document and shared types
const ydoc = new Y.Doc()
const ymap = ydoc.getMap()
const ytext = ydoc.getText()

// Make changes
ymap.set('counter', 42)
ytext.insert(0, 'Hello, Yjs!')

// Listen for changes
ymap.observe(() => {
  console.log('Map changed:', ymap.toJSON())
})

// Sync between documents
const update = Y.encodeStateAsUpdate(ydoc)
Y.applyUpdate(remoteDoc, update)
```

## Next Steps

To extend this demo:

1. **Add more shared types**: Y.Array for lists, Y.XmlFragment for rich text
2. **Implement real networking**: Replace localStorage with WebSocket/WebRTC
3. **Add user awareness**: Show cursors and selections of other users
4. **Integrate with editors**: Use y-prosemirror, y-codemirror, or y-monaco

## Resources

- [Yjs Documentation](https://docs.yjs.dev/)
- [Yjs GitHub Repository](https://github.com/yjs/yjs)
- [Yjs Examples and Demos](https://github.com/yjs/yjs-demos)
- [CRDT Benchmarks](https://github.com/dmonad/crdt-benchmarks)

## Browser Compatibility

Yjs works in all modern browsers and supports:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ✅ Progressive Web Apps (like this one!)

---

Happy collaborating! 🎉
