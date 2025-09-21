# Y.UndoManager

[Edit](https://github.com/yjs/docs/blob/main/api/undo-manager.md)

# Y.UndoManager

A selective Undo/Redo manager for Yjs.

Yjs ships with a selective Undo/Redo manager. The changes can be optionally scoped to transaction origins.

Copy

`**const undoManager = new Y.UndoManager(scope: Y.AbstractType | Array <Y.AbstractType> [, {captureTimeout: number, trackedOrigins: Set<any>, deleteFilter: function(item):boolean}])**` Creates a new Y.UndoManager on a scope of shared types. If any of the specified types, or any of its children is modified, the UndoManager adds a reverse-operation on its stack. Optionally, you may specify `trackedOrigins` to track changes from different sources. By default, all local changes that don't specify a transaction `origin` will be tracked. The UndoManager merges edits that are created within a certain `captureTimeout` (defaults to 500ms). Set it to 0 to capture each change individually.

`**undoManager.undo()**` Undo the last operation on the UndoManager stack. The reverse operation will be put on the redo-stack.

`**undoManager.redo()**` Redo the last operation on the redo-stack. I.e. the previous undo is reversed.

`**undoManager.stopCapturing()**` Call `stopCapturing()` to ensure that the next operation that is put on the UndoManager is not merged with the previous operation.

`**undoManager.clear()**` Delete all captured operations from the undo & redo stack.

`**undoManager.on('stack-item-added', function({stackItem, origin, type:'undo'|'redo', changedParentTypes}, undoManager))**` Register an event handler that is called when a `StackItem` is added to the undo- or the redo-stack.

`**undoManager.on('stack-item-popped', function({stackItem, origin, type:'undo'|'redo', changedParentTypes}, undoManager))**` Register an event handler that is called when a `StackItem` is popped from the undo- or the redo-stack.

`**undoManager.on('stack-item-updated', function({stackItem, origin, type:'undo'|'redo', changedParentTypes}, undoManager))**` Register an event handler that is called when a `StackItem` is updated in the undo- or the redo-stack.

### 

[](#example-stop-capturing)

**Example: Stop Capturing**

UndoManager merges Undo-StackItems if they are created within time-gap smaller than `options.captureTimeout`. Call `um.stopCapturing()` so that the next StackItem won't be merged.

Copy

### 

[](#example-specify-tracked-origins)

**Example: Specify tracked origins**

Every change on the shared document has an origin. If no origin was specified, it defaults to `null`. By specifying `trackedOrigins` you can selectively specify which changes should be tracked by `UndoManager`. The UndoManager instance is always added to `trackedOrigins`.

Copy

### 

[](#example-add-additional-information-to-the-stackitems)

**Example: Add additional information to the StackItems**

When undoing or redoing a previous action, it is often expected to restore additional meta information like the cursor location or the view on the document. You can assign meta-information to Undo-/Redo-StackItems.

Copy

[PreviousY.XmlText](/api/shared-types/y.xmltext)[NextY.Event](/api/y.event)

Last updated 3 months ago

Was this helpful?

Source: https://docs.yjs.dev/api/undo-manager
