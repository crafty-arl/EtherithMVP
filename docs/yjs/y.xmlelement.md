# Y.XmlElement

[Edit](https://github.com/yjs/docs/blob/main/api/shared-types/y.xmlelement.md)

# Y.XmlElement

A shared type that represents an XML node

Copy

## 

[](#api)

API

> Inherits from [Y.XmlFragment](/api/shared-types/y.xmlfragment).

`**const yxmlElement = Y.XmlElement(nodeName: string)**`

`**yxmlElement.nodeName: string**` The name of this Y.XmlElement as a String.

`**yxmlElement.prevSibling: Y.XmlElement | Y.XmlText | null**` The previous sibling of this type. Is null if this is the first child of its parent.

`**yxmlElement.nextSibling: Y.XmlElement | Y.XmlText | null**` The next sibling of this type. Is null if this is the last child of its parent.

`**yxmlElement.toString(): string**` Returns the XML-String representation of this element. E.g. `"<div height="30px"></div>"`

`**yxmlElement.setAttribute(name: string, value: string | Y.AbstractType)**` Set an XML attribute. Technically, the value can only be a string. But we also allow shared types. In this case, the XML type can't be properly converted to a string.

`**yxmlElement.removeAttribute(name: string)**` Remove an XML attribute.

`**yxmlElement.getAttribute(name: string): string | Y.AbstractType**` Retrieve an XML attribute.

`**yxmlElement.getAttributes(): Object <string, string | Y.AbstractType>**` Retrieve all XML attributes.

## 

[](#observing-changes-y.xmlevent)

Observing changes: Y.XmlEvent

The `yxmlElement.observe` callback fires `Y.XmlEvent` events that you can use to calculate the changes that happened during a transaction. We use an adaption of the [Quill delta format](https://quilljs.com/docs/delta/) to calculate insertions & deletions of child-elements. Changes on the xml-attributes are expressed using the same API from [Y.Map](/api/shared-types/y.map#observing-changes-y-mapevent).

Copy

### 

[](#y.xmlevent-api)

Y.XmlEvent API

[todo]

describe childListChanged and attributesChanged

See [Y.Event](/api/y.event) API. The API is inherited from Y.Event.I'm still in the process of moving the documentation to this place. For now, you can find the API docs in the README:

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fgithub.com%2Ffluidicon.png&width=20&dpr=4&quality=100&sign=46771325&sv=2)GitHub - yjs/yjs: Shared data types for building collaborative softwareGitHub](https://github.com/yjs/yjs#API)

API DOCS

[PreviousY.XmlFragment](/api/shared-types/y.xmlfragment)[NextY.XmlText](/api/shared-types/y.xmltext)

Last updated 2 years ago

Was this helpful?

Source: https://docs.yjs.dev/api/shared-types/y.xmlelement
