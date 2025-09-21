# Subdocuments

[Edit](https://github.com/yjs/docs/blob/main/api/subdocuments.md)

# Subdocuments

Embedding Yjs documents into Yjs documents

Yjs documents can be embedded into shared types. This allows you to manage vast amounts of Yjs documents as part of a root document.

Copy

An obvious use-case is to manage documents in a folder structure. Each document (potentially containing large amounts of rich-text content) could be represented as a subdocument that is lazily loaded to memory when needed. By default, subdocuments are empty until they are explicitly loaded.

Copy

Subdocuments are lazily loaded after they have been explicitly loaded to memory. A subdocument can be destroyed `doc.destroy()` to free all used memory and destroy existing data bindings. The document can be accessed again to force the provider to load the content again.

Copy

It is up to the providers to sync subdocuments. It is possible to create a very efficient sync mechanism using sub-documents. The providers can sync collections of documents in one flush instead of having multiple requests. It is also possible to handle authorization over the folder structure. But all official Yjs providers currently think of sub-documents as separate entities. A new feature that was introduced in [[email protected]](/cdn-cgi/l/email-protection) is that all documents are given a GUID. The documents are identified with GUIDs and used as a room-name to sync documents. This allows you to duplicate data in the document structure.

Copy

By default, all subdocuments must be explicitly loaded before they are filled with content. It is possible to define `Y.Doc({ autoLoad: true })` to specify that all peers should automatically load the document.

Providers listen to `subdocs` events to get notified when subdocuments are added, removed, or loaded.

Copy

Providers (e.g. y-websocket, y-indexeddb) are responsible for syncing subdocuments. Not all providers support subdocuments yet. A simple method to implement lazy-loading documents is to create a provider instance to the `doc.guid`-room once a document is loaded:

Copy

\

[PreviousAwareness](/api/about-awareness)[NextInternals](/api/internals)

Last updated 1 year ago

Was this helpful?

Source: https://docs.yjs.dev/api/subdocuments
