# Introduction

[Edit](https://github.com/yjs/docs/blob/main/README.md)

# Introduction

Modular building blocks for building collaborative applications like Google Docs and Figma.

Yjs is a high-performance [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) for building collaborative applications that sync automatically.

It exposes its internal CRDT model as _shared data types_ that can be manipulated concurrently. Shared types are similar to common data types like `Map` and `Array`. They can be manipulated, fire events when changes happen, and automatically merge without merge conflicts.

## 

[](#quick-start)

Quick Start

This is a working example of how shared types automatically sync. We also have a [getting-started guide](/getting-started/a-collaborative-editor), API documentation, and lots of [live demos with source code](https://github.com/yjs/yjs-demos).

Copy

## 

[](#editor-support)

Editor Support

Yjs supports several popular text and rich-text editors. We are working with different projects to enable collaboration-support through Yjs.

[ProseMirror](/ecosystem/editor-bindings/prosemirror)[TipTap](/ecosystem/editor-bindings/tiptap2)[Monaco](/ecosystem/editor-bindings/monaco)[Quill](/ecosystem/editor-bindings/quill)[CodeMirror](/ecosystem/editor-bindings/codemirror)[Remirror](/ecosystem/editor-bindings/remirror)

## 

[](#network-agnostic)

Network Agnostic 📡

Yjs doesn't make any assumptions about the network technology you are using. As long as all changes eventually arrive, the documents will sync. The order in which document updates are applied doesn't matter.

You can [integrate Yjs into your existing communication infrastructure](/tutorials/creating-a-custom-provider) or use one of the [several existing network providers](/ecosystem/connection-provider) that allow you to jump-start your application backend.

Scaling shared editing backends is not trivial. Most shared editing solutions depend on a single source of truth - a central server - to perform conflict resolution. Yjs doesn't need a central source of truth. This enables you to design the backend using ideas from distributed system architecture. In fact, Yjs can be scaled indefinitely, as it is shown in the [y-redis section](/tutorials/untitled-3).

If you don't want to maintain your own backend, a number of providers offer Yjs as a service, including [Liveblocks](https://liveblocks.io/yjs), [Y-Sweet](https://jamsocket.com/y-sweet), and [Tiptap](https://tiptap.dev/product/collaboration).

Yjs is truly network agnostic and can be used as a data model for decentralized and [Local-First software](https://www.inkandswitch.com/local-first.html).

Just start somewhere. Since the "network provider" is clearly separated from Yjs and the various integrations, it is pretty easy to switch to different providers.

## 

[](#rich-ecosystem)

Rich Ecosystem 🔥

Yjs is a modular approach that allows the community to make any editor collaborative using any network technology. It has thought-through solutions for almost all shared-editing related problems.

We built a rich ecosystem of extensions around Yjs. There are ready-to-use editor integrations for many popular (rich-)text editors, adapters to different network technologies (like WebRTC, WebSocket, or Hyper), and persistence providers that store document updates in a database.

## 

[](#unmatched-performance)

Unmatched Performance🚀

Yjs is the fastest CRDT implementation by far.

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fgithub.com%2Ffluidicon.png&width=20&dpr=4&quality=100&sign=46771325&sv=2)GitHub - dmonad/crdt-benchmarks: A collection of CRDT benchmarksGitHub](https://github.com/dmonad/crdt-benchmarks)

[NextYjs in the Wild](/yjs-in-the-wild)

Last updated 10 months ago

Was this helpful?

Source: https://docs.yjs.dev/
