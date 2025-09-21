---
title: Delta Format
source: https://docs.yjs.dev/api/delta-format
scraped_at: 2025-09-20 19:51:34
---

# Delta Format

[Edit](https://github.com/yjs/docs/blob/main/api/delta-format.md)

1. [🔧API](/api)

# Delta Format

The [Delta Format](https://quilljs.com/docs/delta/) was originally described by the Quill rich text editor. We adapted the approach to describe changes on sequence-like data (e.g. Y.Text, Y.Array, Y.XmlFragment).

A Delta is a format to describe changes on a sequence-like data structure like Y.Array, Y.XmlFragment, or Y.Text. But it can also be used to describe the current state of a sequence-like data structure, as you can see in the following example:

Copy

```javascript
const ytext = ydoc.getText()

ytext.toDelta() // => []
ytext.insert(0, 'World', { bold: true })
ytext.insert(0, 'Hello ')
ytext.toDelta() // => [{ insert: 'Hello ' }, { insert: 'World', attributes: { bold: true } }]
```

In many cases, you can even use the delta format to apply changes on a document. In Y.Text the delta format is very handy to express complex operations:

Copy

```javascript
ytext.insert(0, 'Hello ')
ytext.insert(6, 'World', { bold: true })
// is equivalent to 
ytext.applyDelta([{ insert: 'Hello ' }, { insert: 'World', attributes: { bold: true } }])
```

### Delta Description

#### Delete

Copy

```javascript
delta = [{
  delete: 3
}]
```

Expresses the intention to delete the first 3 characters.

#### Retain

Copy

```javascript
delta = [{
  retain: 1
}, {
  delete: 3
}]
```

Expresses the intention to retain one item, and then delete three. E.g.

Copy

```javascript
ytext.insert(0, '12345')
ytext.applyDelta(delta)
ytext.toDelta() // => { insert: '15' }
```

#### Insert (on Y.Text)

The `insert` delta is always a string in Y.Text. Furthermore, Y.Text also allows assigning formatting attributes to the inserted text.

Copy

```javascript
delta = [{
  retain: 1
}, {
  insert: 'abc', attributes: { bold: true }
}, {
  retain: 1
}, {
  insert: 'xyz'
}]
```

Expresses the intention to insert `"abc"` at index-position 1 and make the insertion bold. Then we skip another character and insert `"xyz"` without formatting attributes. E.g.

Copy

```javascript
ytext.insert(0, '123')
ytext.applyDelta(delta)
ytext.toDelta() // => [{ insert: '1' },
                //     { insert: 'abc', attributes: { bold: true } },
                //     { insert: '2xyz3' }]
```

#### Retain (on Y.Text)

In Y.Text the `retain` delta may also contain formatting attributes that are applied on the retained text.

Copy

```javascript
delta = [{
  retain: 5, attributes: { italic: true }
}]
```

Expresses the intention to format the first five characters italic.

#### Insert (on Y.Array & Y.XmlFragment)

The `insert` delta is always an Array of inserted content in Y.Array & Y.XmlFragment.

Copy

```javascript
yarray.observe(event => { console.log(event.changes.delta) })

yarray.insert(0, [1, 2, 3]) // => [{ insert: [1, 2, 3] }]
yarray.insert(2, ["abc"]) // => [{ retain: 2 }, { insert: ["abc"] }]
yarray.delete(0, 1) // => [{ delete: 1 }]
```

The delta format is very powerful to express changes that are performed in a Transaction. As explained in the [shared types section](/getting-started/working-with-shared-types#transactions), events are fired after transactions. With the delta format we can express multiple changes in a single event. E.g.

Copy

```javascript
yarray.observe(event => { console.log(event.changes.delta) })

ydoc.transact(() => {
  // perform all changes in a single transaction
  yarray.insert(0, [1, 2, 3]) // => [{ insert: [1, 2, 3] }]
  yarray.insert(2, ["abc"]) // => [{ retain: 2 }, { insert: ["abc"] }]
  yarray.delete(0, 1) // => [{ delete: 1 }]
}) // => [{ insert: [2, "abc", 3] }]

ydoc.transact(() => {
  yarray.insert(0, ['x'])
  yarray.insert(2, ['y'])
}) // => [{ insert: ['x'] }, { retain: 1 }, { insert: ['y'] }]
```

[PreviousY.Event](/api/y.event)[NextDocument Updates](/api/document-updates)

Last updated 2 years ago

Was this helpful?