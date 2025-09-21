# Delta Format

[Edit](https://github.com/yjs/docs/blob/main/api/delta-format.md)

# Delta Format

The [Delta Format](https://quilljs.com/docs/delta/) was originally described by the Quill rich text editor. We adapted the approach to describe changes on sequence-like data (e.g. Y.Text, Y.Array, Y.XmlFragment).

A Delta is a format to describe changes on a sequence-like data structure like Y.Array, Y.XmlFragment, or Y.Text. But it can also be used to describe the current state of a sequence-like data structure, as you can see in the following example:

Copy

In many cases, you can even use the delta format to apply changes on a document. In Y.Text the delta format is very handy to express complex operations:

Copy

### 

[](#delta-description)

Delta Description

#### 

[](#delete)

Delete

Copy

Expresses the intention to delete the first 3 characters.

#### 

[](#retain)

Retain

Copy

Expresses the intention to retain one item, and then delete three. E.g.

Copy

#### 

[](#insert-on-y.text)

Insert (on Y.Text)

The `insert` delta is always a string in Y.Text. Furthermore, Y.Text also allows assigning formatting attributes to the inserted text.

Copy

Expresses the intention to insert `"abc"` at index-position 1 and make the insertion bold. Then we skip another character and insert `"xyz"` without formatting attributes. E.g.

Copy

#### 

[](#retain-on-y.text)

Retain (on Y.Text)

In Y.Text the `retain` delta may also contain formatting attributes that are applied on the retained text.

Copy

Expresses the intention to format the first five characters italic.

#### 

[](#insert-on-y.array-and-y.xmlfragment)

Insert (on Y.Array & Y.XmlFragment)

The `insert` delta is always an Array of inserted content in Y.Array & Y.XmlFragment.

Copy

The delta format is very powerful to express changes that are performed in a Transaction. As explained in the [shared types section](/getting-started/working-with-shared-types#transactions), events are fired after transactions. With the delta format we can express multiple changes in a single event. E.g.

Copy

[PreviousY.Event](/api/y.event)[NextDocument Updates](/api/document-updates)

Last updated 2 years ago

Was this helpful?

Source: https://docs.yjs.dev/api/delta-format
