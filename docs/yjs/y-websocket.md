---
title: y-websocket
source: https://docs.yjs.dev/ecosystem/connection-provider/y-websocket
scraped_at: 2025-09-20 19:50:48
---

# y-websocket

[Edit](https://github.com/yjs/docs/blob/main/ecosystem/connection-provider/y-websocket.md)

1. [🔥Ecosystem](/ecosystem)
2. [Connection Provider](/ecosystem/connection-provider)

# y-websocket

WebSocket Provider for Yjs that ships with a extendable server implementation

The Websocket Provider implements a conventional client-server model. Clients connect to a single endpoint over Websocket. The server distributes document updates and awareness information among clients. You can configure providers on the server as well, which allow you to persist document updates or scale your infrastructure.

The Websocket Provider is a solid choice if you want a central source that handles authentication and authorization. Websockets also send header information and cookies, so you can use existing authentication mechanisms with this server.

- Supports cross-tab communication. When you open the same document in the same browser, changes on the document are exchanged via cross-tab communication ([Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) and [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) as fallback).
- Supports the exchange of awareness information (e.g. cursors).

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fgithub.com%2Ffluidicon.png&width=20&dpr=4&quality=100&sign=46771325&sv=2)GitHub - yjs/y-websocket: Websocket Connector for YjsGitHub](https://github.com/yjs/y-websocket)

## Getting Started

JavaScript

Install

Copy

```javascript
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const doc = new Y.Doc()
const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', doc)

wsProvider.on('status', event => {
  console.log(event.status) // logs "connected" or "disconnected"
})
```

Copy

```javascript
npm i y-websocket
```

### Special case: Using y-websocket in NodeJS

The WebSocket provider requires a [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) object to create a connection to a server. You can polyfill WebSocket support in Node.js using the [`ws` package](https://www.npmjs.com/package/ws).

JavaScript

Install

Copy

```javascript
const ws = require('ws')

const wsProvider = new WebsocketProvider(
  'ws://localhost:1234', 'my-roomname',
  doc,
  { WebSocketPolyfill: ws }
)
```

Copy

```javascript
npm i ws
```

## API

Copy

```javascript
import { WebsocketProvider } from 'y-websocket'
```

`wsProvider = new WebsocketProvider(serverUrl: string, room: string, ydoc: Y.Doc [, wsOpts: WsOpts])`
\*\*\*\* Create a new websocket-provider instance. As long as this provider, or the connected `ydoc`, is not destroyed, the changes will be synced to other clients via the connected server. Optionally, you may specify a configuration object. The following default values of `wsOpts` can be overwritten.

Copy

```javascript
wsOpts = {
  // Set this to `false` if you want to connect manually using wsProvider.connect()
  connect: true,
  // Specify a query-string that will be url-encoded and attached to the `serverUrl`
  // I.e. params = { auth: "bearer" } will be transformed to "?auth=bearer"
  params: {}, // Object<string,string>
  // You may polyill the Websocket object (https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).
  // E.g. In nodejs, you could specify WebsocketPolyfill = require('ws')
  WebsocketPolyfill: Websocket,
  // Specify an existing Awareness instance - see https://github.com/yjs/y-protocols
  awareness: new awarenessProtocol.Awareness(ydoc)
}
```

`wsProvider.wsconnected: boolean`
\*\*\*\* True if this instance is currently connected to the server.

`wsProvider.wsconnecting: boolean`
\*\*\*\* True if this instance is currently connecting to the server.

`wsProvider.shouldConnect: boolean`
\*\*\*\* If false, the client will not try to reconnect.

`wsProvider.bcconnected: boolean`
\*\*\*\* True if this instance is currently communicating to other browser-windows via [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel).

`wsProvider.synced: boolean`
\*\*\*\* True if this instance is currently connected and synced with the server.

`wsProvider.disconnect()`
\*\*\*\* Disconnect from the server and don't try to reconnect.

\*\*`wsProvider.connect()` \*\*
\*\*\*\* Establish a websocket connection to the websocket-server. Call this if you recently disconnected or if you set `wsOpts.connect = false`.

`wsProvider.destroy()`
\*\*\*\* Destroy this `wsProvider` instance. Disconnects from the server and removes all event handlers.

`wsProvider.on('sync', function(isSynced: boolean))`
\*\*\*\* Add an event listener for the `sync` event that is fired when the client received content from the server.

## Websocket Server:

Start a y-websocket server:

Copy

```javascript
HOST=localhost PORT=1234 npx y-websocket
```

Since npm symlinks the `y-websocket-server` executable from your local `./node_modules/.bin` folder, you can simply run npx. The `PORT` environment variable defaults to 1234.

### Websocket Server with Persistence

Persist document updates in a LevelDB database. See [LevelDB Persistence](/ecosystem/database-provider/y-leveldb) for more information.

Copy

```javascript
PORT=1234 YPERSISTENCE=./dbDir node ./node_modules/y-websocket/bin/server.js
```

### Websocket Server with HTTP callback

Send a debounced callback to an HTTP server (`POST`) on document update.

Can take the following environment variables:

- `CALLBACK_URL` : Callback server URL
- `CALLBACK_DEBOUNCE_WAIT` : Debounce time between callbacks (in ms). Defaults to 2000 ms
- `CALLBACK_DEBOUNCE_MAXWAIT` : Maximum time to wait before the callback. Defaults to 10 seconds
- `CALLBACK_TIMEOUT` : Timeout for the HTTP call. Defaults to 5 seconds
- `CALLBACK_OBJECTS` : JSON of shared objects to get data (`'{"SHARED_OBJECT_NAME":"SHARED_OBJECT_TYPE}'`)

Copy

```javascript
CALLBACK_URL=http://localhost:3000/ CALLBACK_OBJECTS='{"prosemirror":"XmlFragment"}' npm start
```

This sends a debounced callback to `localhost:3000` 2 seconds after receiving an update (default `DEBOUNCE_WAIT`) with the data of an XmlFragment named `"prosemirror"` in the body.

### Scaling

These are mere suggestions on how you could scale your server environment. You can use the y-websocket server implementation as a baseline to implement your own scaling approach.

**Option 1:** Websocket servers communicate with each other via a PubSub server. A room is represented by a PubSub channel. The downside of this approach is that the same shared document may be handled by many servers. But the upside is that this approach is fault-tolerant, does not have a single point of failure, and is fit for route balancing.

**Option 2:** Sharding with *consistent hashing*. Each document is handled by a unique server. This pattern requires an entity, like etcd, that performs regular health checks and manages servers. Based on the list of available servers (which is managed by etcd) a proxy calculates which server is responsible for each requested document. The disadvantage of this approach is that load distribution may not be fair. Still, this approach may be the preferred solution if you want to store the shared document in a database - e.g. for indexing.

[y-redis](/ecosystem/database-provider/y-redis)

[PreviousConnection Provider](/ecosystem/connection-provider)[Nexty-webrtc](/ecosystem/connection-provider/y-webrtc)

Last updated 11 months ago

Was this helpful?