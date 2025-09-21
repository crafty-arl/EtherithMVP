---
title: Y.XmlText
source: https://docs.yjs.dev/api/shared-types/y.xmltext
scraped_at: 2025-09-20 19:51:03
---

# Y.XmlText

[Edit](https://github.com/yjs/docs/blob/main/api/shared-types/y.xmltext.md)

1. [🔧API](/api)
2. [Shared Types](/api/shared-types)

# Y.XmlText

Extends Y.Text to represent a Y.Xml node.

Copy

```javascript
import * as Y from 'yjs'

const ydoc = new Y.Doc()

// You can define a Y.XmlText as a top-level type or a nested type

// Method 1: Define a top-level type
const yxmlText = ydoc.get('my xmltext type', Y.XmlText) 
// Method 2: Define Y.XmlText that can be included into the Yjs document
const yxmltextNested = new Y.XmlText()

// Nested types can be included as content into any other shared type
yxmlText.set('my nested text', ytextNested)

// Common methods (also available in Y.Text)
yxmlText.insert(0, 'abc') // insert three elements
yxmlText.format(1, 2, { bold: true }) // delete second element 
yxmlText.toDelta() // => [{ insert: 'a' }, { insert: 'bc', attributes: { bold: true }}]

// Methods specific to Y.XmlText
yxmlText.prevSibling
yxmlText.nextSibling
yxmlText.toString() // => "a<bold>bc</bold>"
```

## API

> Inherits from [Y.Text](/api/shared-types/y.text).

`const yxmlText = Y.XmlText()`

`yxmlText.prevSibling: Y.XmlElement | Y.XmlText | null`
The previous sibling of this type. Is null if this is the first child of its parent.

`yxmlText.nextSibling: Y.XmlElement | Y.XmlText | null`
The next sibling of this type. Is null if this is the last child of its parent.

`yxmlText.toString(): string`
Returns the XML-String representation of this element. Formatting attributes are transformed to XML-tags. If the formatting attribute contains an object, the key-value pairs will be used as attributes. E.g.

Copy

```javascript
ymxlText.insert(0, "my link", { a: { href: 'https://..' } })
ymxlText.toString() // => <a href="https://..">my link</a>
```

[PreviousY.XmlElement](/api/shared-types/y.xmlelement)[NextY.UndoManager](/api/undo-manager)

Last updated 3 years ago

Was this helpful?