---
title: Y.XmlElement
source: https://docs.yjs.dev/api/shared-types/y.xmlelement
scraped_at: 2025-09-20 19:51:18
---

# Y.XmlElement

[Edit](https://github.com/yjs/docs/blob/main/api/shared-types/y.xmlelement.md)

1. [🔧API](/api)
2. [Shared Types](/api/shared-types)

# Y.XmlElement

A shared type that represents an XML node

Copy

```javascript
import * as Y from 'yjs'

const ydoc = new Y.Doc()

// You can define a Y.XmlElement as a top-level type or a nested type

// Method 1: Define a top-level type
// Note that the nodeName is always "undefined"
// when defining an XmlElement as a top-level type.
const yxmlElement = ydoc.get('prop-name', Y.XmlElement)
// Method 2: Define Y.XmlFragment that can be included into the Yjs document
const yxmlNested = new Y.XmlElement('node-name')

// Common methods
const yxmlText = new Y.XmlText()
yxmlFragment.insert(0, [yxmlText])
yxmlFragment.firstChild === yxmlText
yxmlFragment.insertAfter(yxmlText, [new Y.XmlElement('node-name')])
yxmlFragment.get(0) === yxmlText // => true

//show result in dev console
console.log(yxmlFragment.toDOM())
```

## API

> Inherits from [Y.XmlFragment](/api/shared-types/y.xmlfragment).

`const yxmlElement = Y.XmlElement(nodeName: string)`

`yxmlElement.nodeName: string`
The name of this Y.XmlElement as a String.

`yxmlElement.prevSibling: Y.XmlElement | Y.XmlText | null`
The previous sibling of this type. Is null if this is the first child of its parent.

`yxmlElement.nextSibling: Y.XmlElement | Y.XmlText | null`
The next sibling of this type. Is null if this is the last child of its parent.

`yxmlElement.toString(): string`
Returns the XML-String representation of this element. E.g. `"<div height="30px"></div>"`

`yxmlElement.setAttribute(name: string, value: string | Y.AbstractType)`
Set an XML attribute. Technically, the value can only be a string. But we also allow shared types. In this case, the XML type can't be properly converted to a string.

`yxmlElement.removeAttribute(name: string)`
Remove an XML attribute.

`yxmlElement.getAttribute(name: string): string | Y.AbstractType`
Retrieve an XML attribute.

`yxmlElement.getAttributes(): Object<string, string | Y.AbstractType>`
Retrieve all XML attributes.

## Observing changes: Y.XmlEvent

The `yxmlElement.observe` callback fires `Y.XmlEvent` events that you can use to calculate the changes that happened during a transaction. We use an adaption of the [Quill delta format](https://quilljs.com/docs/delta/) to calculate insertions & deletions of child-elements. Changes on the xml-attributes are expressed using the same API from [Y.Map](/api/shared-types/y.map#observing-changes-y-mapevent).

Copy

```javascript
yxmlFragment.observe(yxmlEvent => {
  yxmlEvent.target === yarray // => true

  // Observe when child-elements are added or deleted. 
  // Log the Xml-Delta Format to calculate the difference to the last observe-event
  console.log(yxmlEvent.changes.delta)

  // Observe attribute changes.  
  // Option 1: A set of keys that changed
  yxmlEvent.keysChanged // => Set<strings>
  // Option 2: Compute the differences
  yxmlEvent.changes.keys // => Map<string, { action: 'add'|'update'|'delete', oldValue: any}>

  // The change format is equivalent to the Y.MapEvent change format.
  yxmlEvent.changes.keys.forEach((change, key) => {
    if (change.action === 'add') {
      console.log(`Attribute "${key}" was added. Initial value: "${ymap.get(key)}".`)
    } else if (change.action === 'update') {
      console.log(`Attribute "${key}" was updated. New value: "${ymap.get(key)}". Previous value: "${change.oldValue}".`)
    } else if (change.action === 'delete') {
      console.log(`Attribute "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`)
    }
  })
})

yxmlElement.insert(0, [new Y.XmlText()]) // => [{ insert: [yxmlText] }]
yxmlElement.delete(0, 1) // [{ delete: 1 }]

yxmlElement.setAttribute('key', 'value') // Attribute "key" was added. Initial value: "undefined".
yxmlElement.setAttribute('key', 'new value') // Attribute "key" was updated. New value: "new value". Previous value: "value"
yxmlElement.deleteAttribute('key') // Attribute "key" was deleted. New value: undefined. Previous value: "new value"
```

### Y.XmlEvent API

[todo]

describe childListChanged and attributesChanged

See [Y.Event](/api/y.event) API. The API is inherited from Y.Event.I'm still in the process of moving the documentation to this place. For now, you can find the API docs in the README:

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fgithub.com%2Ffluidicon.png&width=20&dpr=4&quality=100&sign=46771325&sv=2)GitHub - yjs/yjs: Shared data types for building collaborative softwareGitHub](https://github.com/yjs/yjs#API)

API DOCS

[PreviousY.XmlFragment](/api/shared-types/y.xmlfragment)[NextY.XmlText](/api/shared-types/y.xmltext)

Last updated 2 years ago

Was this helpful?