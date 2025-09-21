# Y.Text

[Edit](https://github.com/yjs/docs/blob/main/api/shared-types/y.text.md)

# Y.Text

A shared type that represents Text & RichText

Copy

## 

[](#api)

API

`**ytext = new Y.Text(initialContent): Y.Text**` Create an instance of Y.Text with existing content.

`**ytext.doc: Y.Doc | null**` (readonly) The Yjs document that this type is bound to. Is `null` when it is not bound yet.

`**ytext.parent: Y.AbstractType | null**` (readonly) The parent that holds this type. Is `null` if this `ytext` is a top-level type.

`**ytext.length: number**` (readonly) The length of the string in UTF-16 code units. Since JavaScripts' String implementation uses the same character encoding `ytext.toString().length === ytext.length`.

`**ytext.insert(index: number, content: string[, format: Object <string,any>])**` Insert content at a specified `index`. Optionally, you may specify formatting attributes that are applied to the inserted string. By default, the formatting attributes before the insert position will be used.

`**ytext.format(index: number, length: number, format: Object <string,any>)**` Assign formatting attributes to a range of text.

`**ytext.applyDelta(delta: Delta)**` Apply a Text-Delta to the Y.Text instance.

`**ytext.delete(index: number, length: number)**` Delete `length` characters starting from `index`.

`**ytext.toString(): string**` Retrieve the string-representation (without formatting attributes) from the Y.Text instance.

`**ytext.toDelta(): Delta**` Retrieve the Text-Delta-representation of the Y.Text instance. The Text-Delta is equivalent to [Quills' Delta format](https://quilljs.com/docs/delta/).

`**ytext.toJSON(): string**` Retrieves the string representation of the Y.Text instance.

`**ytext.clone(): Y.Text**` Clone this type into a fresh Y.Text instance. The returned type can be included into the Yjs document.

`**ytext.observe(function(YTextEvent, Transaction))**` Registers a change observer that will be called synchronously every time this shared type is modified. In the case this type is modified in the observer call, the event listener will be called again after the current event listener returns.

`**ytext.unobserve(function)**` Unregisters a change observer that has been registered with `ytext.observe`.

`**ytext.observeDeep(function(Array <Y.Event>, Transaction))**` Registers a change observer that will be called synchronously every time this type or any of its children is modified. In the case this type is modified in the event listener, the event listener will be called again after the current event listener returns. The event listener receives all Events created by itself or any of its children.

`**ytext.unobserveDeep(function)**` Unregisters a change observer that has been registered with `ytext.observeDeep`.

## 

[](#delta-format)

Delta Format

[todo]

[formatting attributes]

## 

[](#observing-changes-y.textevent)

Observing changes: Y.TextEvent

[todo]

Copy

### 

[](#y.textevent-api)

Y.TextEvent API

See [Y.Event](/api/y.event) API. The API is inherited from Y.Event.I'm still in the process of moving the documentation to this place. For now, you can find the API docs in the README:

[PreviousY.Array](/api/shared-types/y.array)[NextY.XmlFragment](/api/shared-types/y.xmlfragment)

Last updated 2 years ago

Was this helpful?

Source: https://docs.yjs.dev/api/shared-types/y.text
