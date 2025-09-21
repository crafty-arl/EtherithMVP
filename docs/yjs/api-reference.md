# Yjs API Reference

## Y.Doc

The `Y.Doc` is the main container for all shared types and represents a single collaborative document.

### Constructor
```javascript
const ydoc = new Y.Doc()
```

### Methods

#### `getMap(string)`
Get or create a Y.Map shared type.
```javascript
const ymap = ydoc.getMap('my-map')
```

#### `getArray(string)`
Get or create a Y.Array shared type.
```javascript
const yarray = ydoc.getArray('my-array')
```

#### `getText(string)`
Get or create a Y.Text shared type.
```javascript
const ytext = ydoc.getText('my-text')
```

#### `transact(function)`
Execute multiple operations atomically.
```javascript
ydoc.transact(() => {
    ymap.set('key1', 'value1')
    yarray.push(['item'])
})
```

#### Document State Management
```javascript
// Get current state as update
const update = Y.encodeStateAsUpdate(ydoc)

// Apply update to document
Y.applyUpdate(ydoc, update)

// Get state vector
const stateVector = Y.encodeStateVector(ydoc)

// Get diff update
const diffUpdate = Y.encodeStateAsUpdate(ydoc, stateVector)
```

### Events
```javascript
// Listen for document updates
ydoc.on('update', (update, origin) => {
    console.log('Document updated')
})

// Listen for subdocument changes
ydoc.on('subdocs', ({ added, removed }) => {
    console.log('Subdocuments changed')
})
```

## Y.Map

A shared map type similar to JavaScript's Map, but collaborative.

### Methods

#### `set(key, value)`
Set a key-value pair.
```javascript
ymap.set('username', 'Alice')
ymap.set('age', 30)
```

#### `get(key)`
Get value by key.
```javascript
const username = ymap.get('username') // 'Alice'
```

#### `has(key)`
Check if key exists.
```javascript
if (ymap.has('username')) {
    console.log('User has username')
}
```

#### `delete(key)`
Delete a key-value pair.
```javascript
ymap.delete('age')
```

#### `clear()`
Remove all entries.
```javascript
ymap.clear()
```

#### `size`
Get number of entries.
```javascript
console.log(ymap.size) // 1
```

#### `keys()`, `values()`, `entries()`
Iterate over map.
```javascript
for (const key of ymap.keys()) {
    console.log(key)
}

for (const value of ymap.values()) {
    console.log(value)
}

for (const [key, value] of ymap.entries()) {
    console.log(key, value)
}
```

#### `forEach(callback)`
Execute function for each entry.
```javascript
ymap.forEach((value, key) => {
    console.log(key, value)
})
```

### Events
```javascript
// Observe changes
ymap.observe((event) => {
    console.log('Map changed:', event.changes)
})

// Deep observe (including nested changes)
ymap.observeDeep((events) => {
    events.forEach(event => {
        console.log('Deep change:', event)
    })
})
```

## Y.Array

A shared array type for collaborative list operations.

### Methods

#### `push(items)`
Add items to end of array.
```javascript
yarray.push(['item1', 'item2'])
```

#### `unshift(items)`
Add items to beginning of array.
```javascript
yarray.unshift(['first-item'])
```

#### `insert(index, items)`
Insert items at specific index.
```javascript
yarray.insert(1, ['inserted-item'])
```

#### `delete(index, length)`
Delete items starting at index.
```javascript
yarray.delete(0, 1) // Delete first item
```

#### `get(index)`
Get item at index.
```javascript
const firstItem = yarray.get(0)
```

#### `slice(start, end)`
Get portion of array.
```javascript
const subset = yarray.slice(1, 3)
```

#### `length`
Get array length.
```javascript
console.log(yarray.length)
```

#### `toArray()`
Convert to regular JavaScript array.
```javascript
const regularArray = yarray.toArray()
```

#### `forEach(callback)`
Execute function for each item.
```javascript
yarray.forEach((item, index) => {
    console.log(index, item)
})
```

### Events
```javascript
// Observe changes
yarray.observe((event) => {
    console.log('Array changed:', event.changes)
})

// Deep observe
yarray.observeDeep((events) => {
    events.forEach(event => {
        console.log('Deep change:', event)
    })
})
```

## Y.Text

A shared text type for collaborative text editing.

### Methods

#### `insert(index, text)`
Insert text at position.
```javascript
ytext.insert(0, 'Hello ')
ytext.insert(6, 'World!')
```

#### `delete(index, length)`
Delete text at position.
```javascript
ytext.delete(0, 5) // Delete first 5 characters
```

#### `format(index, length, attributes)`
Apply formatting to text range.
```javascript
ytext.format(0, 5, { bold: true })
```

#### `insertEmbed(index, embed)`
Insert embedded object.
```javascript
ytext.insertEmbed(0, { image: 'url' })
```

#### `applyDelta(delta)`
Apply delta operations.
```javascript
ytext.applyDelta([
    { insert: 'Hello ' },
    { insert: 'World', attributes: { bold: true } }
])
```

#### `toDelta()`
Get text as delta format.
```javascript
const delta = ytext.toDelta()
```

#### `toString()`
Get plain text string.
```javascript
const text = ytext.toString()
```

#### `length`
Get text length.
```javascript
console.log(ytext.length)
```

### Events
```javascript
// Observe changes
ytext.observe((event) => {
    console.log('Text changed:', event.changes)
})

// Deep observe
ytext.observeDeep((events) => {
    events.forEach(event => {
        console.log('Deep change:', event)
    })
})
```

## Best Practices

### Transactions
Use transactions for multiple related operations:
```javascript
ydoc.transact(() => {
    ymap.set('user', 'Alice')
    yarray.push(['message'])
    ytext.insert(0, 'Hello')
})
```

### Event Handling
```javascript
// Avoid infinite loops
let isLocalChange = false

ymap.observe((event) => {
    if (isLocalChange) return
    // Handle remote changes only
})

function localUpdate() {
    isLocalChange = true
    ymap.set('key', 'value')
    isLocalChange = false
}
```

### Memory Management
```javascript
// Clean up event listeners
const observer = (event) => { /* handle event */ }
ymap.observe(observer)

// Later, remove observer
ymap.unobserve(observer)
```

### Subdocuments
For large applications, use subdocuments:
```javascript
const subdoc = new Y.Doc()
ymap.set('subdoc', subdoc)

// Handle subdocument events
ydoc.on('subdocs', ({ added, removed }) => {
    added.forEach(subdoc => {
        // Setup subdocument
    })
})
```