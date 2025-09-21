# Shared Types

[Edit](https://github.com/yjs/docs/blob/main/getting-started/working-with-shared-types.md)

# Shared Types

By now, we have learned how to make an editor collaborative and sync document updates using different providers. But we haven't covered the most unique feature of Yjs yet: Shared Types.

Shared types are similar to common data types like [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), or [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). The only difference is that they automatically sync & persist their state (using the providers) and that you can observe them.

We already learned about the Y.Text type that we "bound" to an editor instance to sync a rich-text editor automatically. Yjs supports many other shared types like Y.Array, Y.Map, and Y.Xml. A complete list, including documentation for each type, can be found in the [shared types section](/api/shared-types).

Shared type instances must be connected to a Yjs document that syncs them to other peers. First, we define a shared type on a Yjs document. Then, we can manipulate it and observe changes.

Copy

The other data types work similarly to Y.Array. The complete documentation is available in the shared types section, which covers each type and the event format in detail.

[Shared Types](/api/shared-types)

## 

[](#caveats)

Caveats

There are a couple of caveats that you need to look out for.

  * A shared type can't be moved to a different position. Once it is "integrated" (inserted as part of the document), you can't integrate it again. Instead, you should create a copy if you need to.

  * You can modify a type before integrating it into a Yjs document, but you can't read it. I.e. `new Y.Array([1,2,3]).length === 0` \- the type will appear empty until you integrate it into the document.

  * You shouldn't modify JSON that you inserted or retrieved from a shared type. Yjs doesn't clone the inserted objects to improve performance. So when you modify a JSON object, you will actually change the internal representation of Yjs without notifying other peers of that change.

Copy

## 

[](#transactions)

Transactions

All changes must happen in a transaction. When you mutate a shared type without creating a transaction (e.g. `yarray.insert(..)`), Yjs will automatically create a transaction before manipulating the shared object. You can create transactions explicitly like this:

Copy

Event handlers and observers are called after each transaction. If possible, you should bundle as many changes in a single transaction as possible. The advantage is that you reduce expensive observer calls and create fewer updates that are sent to other peers.

Yjs fires events in the following order:

  * `ydoc.on('beforeTransaction', event => { .. })` \- Called before any transaction, allowing you to store relevant information before changes happen.

  * Now the transaction function is executed.

  * `ydoc.on('beforeObserverCalls', event => {})`

  * `ytype.observe(event => { .. })` \- Observers are called.

  * `ytype.observeDeep(event => { .. })` \- Deep observers are called.

  * `ydoc.on('afterTransaction', event => {})` \- Called after each transaction.

  * `ydoc.on('update', update => { .. })` \- This update message is propagated by the providers.

Especially when manipulating many objects, it makes sense to reduce the creation of update messages. So use transactions whenever possible.

## 

[](#managing-multiple-collaborative-documents-in-a-shared-type)

Managing multiple collaborative documents in a shared type

We often want to manage multiple collaborative documents in a single Yjs document. You can manage multiple documents using shared types. In the following demo project, I implemented functionality to add & delete documents. The list of all documents is updated in real time as well.

You could extend the above demo project to ..

  * .. be able to delete specific documents

  * .. have a collaborative document-name. You could introduce a Y.Map that holds the document-name, the document-content, and the creation-date.

  * .. extend the document list to a fully-fledged file system based on shared types.

## 

[](#conclusion)

Conclusion

Shared types are not just great for collaborative editing. They are a unique kind of data structure that can be used to sync any state across servers, browsers, and [native applications](https://github.com/yjs/yrs). Yjs is well suited for creating collaborative applications and gives you all the tools you need to create complex applications that can compete with Google Workspace. We imagine that the concept of shared types could also be exploited in high-performance computing for sharing state across threads or in gaming for syncing data to remote clients directly without a roundtrip to a server. Since Yjs & shared types don't depend on a central server, these data structures are the ideal building blocks for decentralized, privacy-focused applications.

I hope that this section gave you some inspiration for using shared types.

[PreviousOffline Support](/getting-started/allowing-offline-editing)[NextEditor Bindings](/ecosystem/editor-bindings)

Last updated 1 month ago

Was this helpful?

Source: https://docs.yjs.dev/getting-started/working-with-shared-types
