# Y.XmlFragment

[Edit](https://github.com/yjs/docs/blob/main/api/shared-types/y.xmlfragment.md)

# Y.XmlFragment

A shared type to manage a collection of Y.Xml* Nodes

Copy

## 

[](#api)

API

`**yxmlFragment.doc: Y.Doc | null**` (readonly) The Yjs document that this type is bound to. Is `null` when it is not bound yet.

`**yxmlFragment.parent: Y.AbstractType | null**` The parent that holds this type. Is `null` if this `yxmlFragment` is a top-level type.

`**yxmlFragment.firstChild: Y.XmlElement | Y.XmlText | null**` The first child that holds this type holds. Is `null` if this type doesn't hold any children.

`**yxmlFragment.length: number**` The number of child-elements that this Y.XmlFragment holds.

`**yxmlFragment.insert(index: number, content: Array <Y.XmlElement | Y.XmlText>)**` Insert content at a specified `index`. Note that - for performance reasons - content is always an array of elements. I.e. `yxmlFragment.insert(0, [new Y.XmlElement()])` inserts a single element at position 0.

`**yxmlFragment.insertAfter(ref: Y.XmlElement | Y.XmlText | null, content: Array <Y.XmlElement | Y.XmlText>)**` Insert content after a reference element. If the reference element `ref` is null, then the content is inserted at the beginning.

`**yxmlFragment.delete(index: number, length: number)**` Delete `length` elements starting from `index`.

`**yxmlFragment.push(content: Array <Y.XmlElement | Y.XmlText>)**` Append content at the end of the Y.XmlElement. Equivalent to `yxmlFragment.insert(yxmlFragment.length, content)`.

`**yxmlFragment.unshift(content: Array <Y.XmlElement | Y.XmlText>)**` Prepend content to the beginning of the Y.Array. Same as `yxmlFragment.insert(0, content)`.

`**yxmlFragment.get(index: number): Y.XmlElement | Y.XmlText**` Retrieve the n-th element.

`**yxmlFragment.slice([start: number [, end: number]]): Array <Y.XmlElement | Y.XmlText>**` Retrieve a range of content starting from index `start` (inclusive) to index `end` (exclusive). Negative indexes can be used to indicate offsets from the end of the Y.XmlFragment. I.e. `yxmlFragment.slice(-1)` returns the last element. `yxmlFragment.slice(0, -1)` returns all but the last element. Works similarly to the [Array.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) method.

`**yxmlFragment.toJSON(): String**` Retrieve the JSON representation of this type. The result is a concatenated string of XML elements.

Example:

Copy

If the fragment contains more than one XML element, the output will not be a valid XML; It will need to be placed inside a container element to be valid and parsable. Example:

Copy

`**yxmlFragment.createTreeWalker(filter: function(yxml: Y.XmlElement | Y.XmlText): boolean): Iterable**` Create an [Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) that walks through all children of this type (not only direct children). The returned iterable returns every element that the filter accepts. I.e. the following code iterates through all `Y.XmlElements` that have the node-name `'p'`.

Copy

`**yxmlFragment.clone(): Y.XmlFragment**` Clone all values into a fresh Y.XmlFragment instance. The returned type can be included into the Yjs document.

**toDOM():DocumentFragment** Transforms this type and all children to new DOM elements.

`**yxmlFragment.observe(function(Y.XmlEvent, Transaction))**` Registers a change observer that will be called synchronously every time this shared type is modified. In the case this type is modified in the observer call, the event listener will be called again after the current event listener returns.

`**yxmlFragment.unobserve(function)**` Unregisters a change observer that has been registered with `yxmlFragment.observe`.

`**yxmlFragment.observeDeep(function(Array <Y.Event>, Transaction))**` Registers a change observer that will be called synchronously every time this type or any of its children is modified. In the case this type is modified in the event listener, the event listener will be called again after the current event listener returns. The event listener receives all Events created by itself and any of its children.

`**yxmlFragment.unobserveDeep(function)**` Unregisters a change observer that has been registered with `yxmlFragment.observeDeep`.

## 

[](#observing-changes-y.xmlevent)

Observing changes: Y.XmlEvent

The `yxmlFragment.observe` callback fires `Y.XmlEvent` events that you can use to calculate the changes that happened during a transaction. We use an adaption of the [Quill delta format](https://quilljs.com/docs/delta/) to calculate insertions & deletions of child-elements. You can find more examples and information about the delta format in our [Y.Event API](/api/y.event#delta-format).

Copy

### 

[](#y.xmlevent-api)

Y.XmlEvent API

[todo]

See [Y.Event](/api/y.event) API. The API is inherited from Y.Event.I'm still in the process of moving the documentation to this place. For now, you can find the API docs in the README:

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fgithub.com%2Ffluidicon.png&width=20&dpr=4&quality=100&sign=46771325&sv=2)GitHub - yjs/yjs: Shared data types for building collaborative softwareGitHub](https://github.com/yjs/yjs#API)

API DOCS

[PreviousY.Text](/api/shared-types/y.text)[NextY.XmlElement](/api/shared-types/y.xmlelement)

Last updated 2 years ago

Was this helpful?

Source: https://docs.yjs.dev/api/shared-types/y.xmlfragment
