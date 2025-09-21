# Document Updates

[Edit](https://github.com/yjs/docs/blob/main/api/document-updates.md)

# Document Updates

How to sync documents with other peers.

Changes on the shared document are encoded into binary encoded (highly compressed) _document updates_. Document updates are _commutative, associative,_ and _idempotent_. This means that you can apply them in any order and multiple times. All clients will sync up when they received all document updates.

## 

[](#update-api)

Update API

`**Y.applyUpdate(Y.Doc, update:Uint8Array, [transactionOrigin:any])**` Apply a document update on the shared document. Optionally you can specify `transactionOrigin` that will be stored on `transaction.origin` and `ydoc.on('update', (update, origin) => ..)`.

`**Y.encodeStateAsUpdate(Y.Doc, [encodedTargetStateVector:Uint8Array]): Uint8Array**` Encode the document state as a single update message that can be applied on the remote document. Optionally, specify the target state vector to only write the missing differences to the update message.

`**Y.encodeStateVector(Y.Doc): Uint8Array**` Computes the state vector and encodes it into an Uint8Array. A state vector describes the state of the local client. The remote client can use this to exchange only the missing differences.

`**ydoc.on('update', eventHandler: function(update: Uint8Array, origin: any, doc: Y.Doc))**` Listen to incremental updates on the Yjs document. This is part of the [Y.Doc API](/api/y.doc#event-handler). Send the computed incremental update to all connected clients, or store it in a database.

`**Y.logUpdate(Uint8Array)**` (experimental) Log the contents of a document update to the console. This utility function is only meant for debugging and understanding the Yjs document format. It is marked as experimental because it might be changed or removed at any time.

## 

[](#alternative-update-api)

Alternative Update API

It is possible to sync clients and compute delta updates without loading the Yjs document to memory. Yjs exposes an API to compute the differences directly on the binary document updates. This allows you to sync efficiently while only maintaining the compressed binary-encoded document state in-memory. [(see example)](/api/document-updates#example-syncing-clients-without-loading-the-y.doc)

Note that this feature only merges document updates and doesn't garbage-collect deleted content. You still need to load the document to a Y.Doc to reduce the document size.

`**Y.mergeUpdates(Array <Uint8Array>): Uint8Array**` Merge several document updates into a single document update while removing duplicate information. The merged document update is always smaller than the separate updates because of the compressed encoding.

`**Y.encodeStateVectorFromUpdate(Uint8Array): Uint8Array**` Computes the state vector from a document update and encodes it into an Uint8Array.

`**Y.diffUpdate(update: Uint8Array, stateVector: Uint8Array): Uint8Array**` Encode the missing differences to another update message. This function works similarly to `Y.encodeStateAsUpdate(ydoc, stateVector)` but works on updates instead.

## 

[](#examples)

Examples

### 

[](#example-listen-to-update-events-and-apply-them-on-a-remote-client)

**Example: Listen to update events and apply them on a remote client**

Copy

You can also use a transaction to specify an origin. This may help to eliminate redundant packets from hitting the wire.

Copy

### 

[](#syncing-clients)

Syncing clients

Yjs internally maintains a [state vector](https://github.com/yjs/yjs#State-Vector) that denotes the next expected clock from each client. In a different interpretation, it holds the number of modifications created by each client. When two clients sync, you can either exchange the complete document structure or only the differences by sending the state vector to compute the differences.

#### 

[](#example-sync-two-clients-by-exchanging-the-complete-document-structure)

**Example: Sync two clients by exchanging the complete document structure**

Copy

#### 

[](#example-sync-two-clients-by-computing-the-differences)

**Example: Sync two clients by computing the differences**

This example shows how to sync two clients with a minimal amount of data exchanged by computing the differences using the state vector of the remote client. Syncing clients using the state vector requires another roundtrip but can save a lot of bandwidth.

Copy

#### 

[](#example-syncing-clients-without-loading-the-y.doc)

Example: Syncing clients without loading the Y.Doc

Copy

### 

[](#example-base64-encoding)

Example: Base64 encoding

We compress document updates to a highly compressed binary format. Therefore, document updates are represented as [Uint8Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array). An `Uint8Array` represents binary data similarly to a [NodeJS' Buffer](https://nodejs.org/api/buffer.html) . The difference is that `Uint8Array` is available in all JavaScript environments. The catch is that you can't [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)/[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) the data because there is no JSON representation for binary data. However, most communication protocols support binary data. If you still need to transform the data into a string, you can use [Base64 encoding](https://en.wikipedia.org/wiki/Base64). For example, by using the [`js-base64`](https://www.npmjs.com/package/js-base64) library:

JavaScript

[](#tab-javascript)

Install

[](#tab-install)

Copy

Copy

### 

[](#example-building-a-custom-provider)

Example: Building a custom provider

A "provider" is what connects a Yjs document to other clients (through a network) or that synchronizes a document with a database. The section [syncing clients](/api/document-updates#syncing-clients) explains several concepts to sync a Yjs document with another client or server. Once the initial states are synchronized, we want to synchronize incremental updates by listening to the update and forwarding them to the other clients. We can use the concept of _transaction origin_ to determine whether we need to forward a document update to the database/network. I recommend using the following template for custom provider implementation.

Copy

Note that this is not the only way to filter updates. You could also use a `isLocal` flag or use a [lib0/mutex](https://github.com/dmonad/lib0). However, it is recommended that all providers set the transaction origin which makes it easier for developers to debug where an update comes from.

[PreviousDelta Format](/api/delta-format)[NextY.RelativePosition](/api/relative-positions)

Last updated 3 years ago

Was this helpful?

Source: https://docs.yjs.dev/api/document-updates
