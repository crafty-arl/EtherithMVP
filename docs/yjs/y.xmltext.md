# Y.XmlText

[Edit](https://github.com/yjs/docs/blob/main/api/shared-types/y.xmltext.md)

# Y.XmlText

Extends Y.Text to represent a Y.Xml node.

Copy

## 

[](#api)

API

> Inherits from [Y.Text](/api/shared-types/y.text).

`**const yxmlText = Y.XmlText()**`

`**yxmlText.prevSibling: Y.XmlElement | Y.XmlText | null**` The previous sibling of this type. Is null if this is the first child of its parent.

`**yxmlText.nextSibling: Y.XmlElement | Y.XmlText | null**` The next sibling of this type. Is null if this is the last child of its parent.

`**yxmlText.toString(): string**` Returns the XML-String representation of this element. Formatting attributes are transformed to XML-tags. If the formatting attribute contains an object, the key-value pairs will be used as attributes. E.g.

Copy

[PreviousY.XmlElement](/api/shared-types/y.xmlelement)[NextY.UndoManager](/api/undo-manager)

Last updated 3 years ago

Was this helpful?

Source: https://docs.yjs.dev/api/shared-types/y.xmltext
