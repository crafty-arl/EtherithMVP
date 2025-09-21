# A Collaborative Editor

[Edit](https://github.com/yjs/docs/blob/main/getting-started/a-collaborative-editor.md)

# A Collaborative Editor

A five minute guide to make an editor collaborative

Yjs is a modular framework for syncing things in real-time - like editors!

This guide will walk you through the main concepts of Yjs. First, we are going to create a collaborative editor and sync it with clients. You will get introduced to Yjs documents and to providers, that allow you to sync through different network protocols. Next, we talk about [Awareness & Presence](/getting-started/adding-awareness) which are very important aspects of collaborative software. I created a separate section for [Offline Support](/getting-started/allowing-offline-editing) that shows you how to create offline-ready applications by just adding a few lines of code. The last section is an in-depth guide to [Shared Types](/getting-started/working-with-shared-types).

Let's get started by deciding on an editor to use. Yjs doesn't ship with a customized editor. There are already a lot of awesome open-source editors projects out there. Yjs supports many of them using extensions. Editor bindings are a concept in Yjs that allow us to bind the state of a third-party editor to a syncable Yjs document. This is a list of all known editor bindings:

[Editor Bindings](/ecosystem/editor-bindings)

For the purpose of this guide, we are going to use the [Quill](https://quilljs.com/) editor - a great rich-text editor that is easy to setup. For a complete reference on how to setup Quill I refer to [their documentation](https://quilljs.com/playground/). If you first require a basic introduction in npm and bundles, please refer to the [webpack getting started guide](https://webpack.js.org/guides/getting-started/) and additionally setting up a [development server](https://webpack.js.org/configuration/dev-server/).

JavaScript

[](#tab-javascript)

HTML

[](#tab-html)

Install

[](#tab-install)

Copy

Copy

Copy

Next, we are going to install Yjs and the [y-quill](/ecosystem/editor-bindings/quill) editor binding.

Copy

Copy

The `ytext` object is a shared data structure for representing text. It also supports formatting attributes (i.e. **bold** and _italic_). Yjs automatically resolves concurrent changes on shared data so we don't have to worry about conflict resolution anymore. Then we synchronize `ytext` with the `quill` editor and keep them in-sync using the `QuillBinding`. Almost all editor bindings work like this. You can simply exchange the editor binding if you switch to another editor.

But don't stop here, the editor doesn't sync to other clients yet! We need to choose a **provider** or [implement our own communication protocol](/tutorials/creating-a-custom-provider) to exchange document updates with other peers.

[Connection Provider](/ecosystem/connection-provider)

Each provider has pros and cons. The[ y-webrtc](/ecosystem/connection-provider/y-webrtc) provider connects clients directly with each other and is a perfect choice for demo applications because it doesn't require you to set up a server. But for a real-world application, you often want to sync the document to a server. In any case, we got you covered. It is easy to change the provider because they all implement the same interface.

y-webrtc

[](#tab-y-webrtc)

y-websocket.

[](#tab-y-websocket)

y-dat

[](#tab-y-dat)

Installation

[](#tab-installation)

Copy

Copy

Copy

Copy

Providers work similarly to editor bindings. They sync Yjs documents through a communication protocol or a database. Most providers have in common that they use the concept of room-names to connect Yjs documents. In the above example, all documents that specify `'quill-demo-room'` as the room-name will sync.

By combining Yjs with providers and editor bindings we created our first collaborative editor. In the following sections, we will explore more Yjs concepts like awareness, shared types, and offline editing.

But for now, let's enjoy what we built. I included the same fiddle twice so you can observe the editors sync in real-time. Aware, the editor content is synced with all users visiting this page!

[PreviousLicense ❤️](/license)[NextAwareness & Presence](/getting-started/adding-awareness)

Last updated 5 months ago

Was this helpful?

Source: https://docs.yjs.dev/getting-started/a-collaborative-editor
