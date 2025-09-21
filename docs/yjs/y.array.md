---
title: Y.Array
source: https://docs.yjs.dev/api/shared-types/y.array
scraped_at: 2025-09-20 19:51:02
---

# Y.Array

[Edit](https://github.com/yjs/docs/blob/main/api/shared-types/y.array.md)

1. [🔧API](/api)
2. [Shared Types](/api/shared-types)

# Y.Array

A shared type to store data in a sequence-like data structure

Copy

```javascript
import * as Y from 'yjs'

const ydoc = new Y.Doc()

// You can define a Y.Array as a top-level type or a nested type

// Method 1: Define a top-level type
const yarray = ydoc.getArray('my array type') 
// Method 2: Define Y.Array that can be included into the Yjs document
const yarrayNested = new Y.Array()

// Nested types can be included as content into any other shared type,
// notice that a shared type can only exist once in a document.
yarray.insert(0, [yarrayNested])

// Common methods
yarray.insert(0, [1, 2, 3]) // insert three elements
yarray.delete(1, 1) // delete second element 
yarray.toArray() // => [1, 3]
```

## API

`Y.Array.from(Array<JSON | Uint8Array | Y.AbstractType>): Y.Array`
An alternative factory function to create a Y.Array based on existing content.

`yarray.doc: Y.Doc | null` (readonly)
The Yjs document that this type is bound to. Is `null` when it is not bound yet.

`yarray.parent: Y.AbstractType | null`
The parent that holds this type. Is `null` if this `yarray` is a top-level type.

`yarray.length: number`
The number of elements that this Y.Array holds.

`yarray.insert(index: number, content: Array<JSON | Uint8Array | Y.AbstractType>)`
Insert content at a specified `index`. Note that - for performance reasons - content is always an array of elements. I.e. `yarray.insert(0, [1])` inserts 1 at position 0.

`yarray.delete(index: number, length: number)`
Delete `length` Y.Array elements starting from `index`.

`yarray.push(content: Array<JSON | Uint8Array | Y.AbstractType>)`
Append content at the end of the Y.Array. Same as `yarray.insert(yarray.length, content)`.

`yarray.unshift(content: Array<JSON | Uint8Array | Y.AbstractType>)`
Prepend content to the beginning of the Y.Array. Same as `yarray.insert(0, content)`.

`yarray.get(index: number): JSON | Uint8Array | Y.AbstractType`
Retrieve the n-th element.

`yarray.slice([start: number [, end: number]]): Array<JSON | Uint8Array | Y.AbstractType>`
Retrieve a range of content starting from index `start` (inclusive) to index `end` (exclusive). Negative indexes can be used to indicate offsets from the end of the Y.Array. I.e. `yarray.slice(-1)` returns the last element. `yarray.slice(0, -1)` returns all but the last element. Works similarly to the [Array.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) method.

`yarray.toArray(): Array<JSON | Uint8Array | Y.AbstractType>`
Copies the content of the Y.Array to a new Array.

`yarray.toJSON(): Array<JSON | Uint8Array>`
Retrieve the JSON representation of this type. The result is a fresh Array that contains all Y.Array elements. Elements that are shared types are transformed to JSON as well, using their `toJSON` method. The result may contain Uint8Arrays which are not JSON-encodable.

`yarray.forEach(function(value: any, index: number, yarray: Y.Array))`
Execute the provided function once on every element.

`yarray.map(function(value: any, index: number, yarray: Y.Array): T): Array<T>`
Creates a new Array filled with the results of calling the provided function on each element in the Y.Array.

`yarray[Symbol.Iterator]: Iterator`
Returns an [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) of values for the Y.Array. This allows you to iterate over the `yarray` using a for..of loop: `for (const value of yarray) { .. }`

`yarray.clone(): Y.Array`
Clone all values into a fresh Y.Array instance. The returned type can be included into the Yjs document.

`yarray.observe(function(YArrayEvent, Transaction))`
Registers a change observer that will be called synchronously every time this shared type is modified. In the case this type is modified in the observer call, the event listener will be called again after the current event listener returns.

`yarray.unobserve(function)`
Unregisters a change observer that has been registered with `yarray.observe`.

`yarray.observeDeep(function(Array<Y.Event>, Transaction))`
Registers a change observer that will be called synchronously every time this type or any of its children is modified. In the case this type is modified in the event listener, the event listener will be called again after the current event listener returns. The event listener receives all Events created by itself or any of its children.

`yarray.unobserveDeep(function)`
Unregisters a change observer that has been registered with `yarray.observeDeep`.

## Observing changes: Y.ArrayEvent

The `yarray.observe` callback fires `Y.ArrayEvent` events that you can use to calculate the changes that happened during a transaction. We use an adaption of the [Quill delta format](https://quilljs.com/docs/delta/) to calculate the differences. Instead of strings, our ArrayDelta works on Arrays. You can find more examples and information about the delta format in our [Y.Event API](/api/y.event#delta-format).

Copy

```javascript
yarray.observe(yarrayEvent => {
  yarrayEvent.target === yarray // => true

  // Find out what changed: 
  // Log the Array-Delta Format to calculate the difference to the last observe-event
  console.log(yarrayEvent.changes.delta)
})

yarray.insert(0, [1, 2, 3]) // => [{ insert: [1, 2, 3] }]
yarray.delete(2, 1) // [{ retain: 2 }, { delete: 1 }]

console.log(yarray.toArray()) // => [1, 2]

// The delta-format is very useful when multiple changes
// are performed in a single transaction
ydoc.transact(() => {
  yarray.insert(1, ['a', 'b'])
  yarray.delete(2, 2) // deletes 'b' and 2
}) // => [{ retain: 1 }, { insert: ['a'] }, { delete: 1 }]

console.log(yarray.toArray()) // => [1, 'a']
```

### Y.ArrayEvent API

See [Y.Event](/api/y.event) API. The API is inherited from Y.Event.I'm still in the process of moving the documentation to this place. For now, you can find the API docs in the README:

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fgithub.com%2Ffluidicon.png&width=20&dpr=4&quality=100&sign=46771325&sv=2)GitHub - yjs/yjs: Shared data types for building collaborative softwareGitHub](https://github.com/yjs/yjs#API)

API DOCS

[PreviousY.Map](/api/shared-types/y.map)[NextY.Text](/api/shared-types/y.text)

Last updated 1 year ago

Was this helpful?