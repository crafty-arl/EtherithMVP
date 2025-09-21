---
title: ProseMirror
source: https://docs.yjs.dev/ecosystem/editor-bindings/prosemirror
scraped_at: 2025-09-20 19:51:01
---

# ProseMirror

[Edit](https://github.com/yjs/docs/blob/main/ecosystem/editor-bindings/prosemirror.md)

1. [🔥Ecosystem](/ecosystem)
2. [Editor Bindings](/ecosystem/editor-bindings)

# ProseMirror

Shared Editing with the ProseMirror Editor

[ProseMirror](https://prosemirror.net/) is a fantastic toolkit to build your own richtext editor. TipTap, [Remirror](/ecosystem/editor-bindings/remirror), and [Atlaskit](https://atlaskit.atlassian.com/packages/editor/editor-core/example/full-page) are all based on ProseMirror. The [y-prosemirror](https://github.com/yjs/y-prosemirror/) module exports ProseMirror plugins that make any ProseMirror-based editor collaborative. The module even ensures that the document still conforms to the specified schema. The following demo shows how shared editing, cursors, shared undo/redo, and versions can be implemented using the ProseMirror editor toolkit.

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fgithub.com%2Ffluidicon.png&width=20&dpr=4&quality=100&sign=46771325&sv=2)GitHub - yjs/y-prosemirror: ProseMirror editor binding for YjsGitHub](https://github.com/yjs/y-prosemirror/)

### Live Demo

## yjs-demos

The yjs-demos repository contains multiple demos for the ProseMirror editor. Just clone the directory you are interested in and run `npm install && npm start`.

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fgithub.com%2Ffluidicon.png&width=20&dpr=4&quality=100&sign=46771325&sv=2)GitHub - yjs/yjs-demos: A collection of demos for YjsGitHub](https://github.com/yjs/yjs-demos)

## Caveats

Index positions don't work as expected in ProseMirror if you use this module. Instead of indexes, you should use [relative positions](/api/relative-positions) that are based on the Yjs document. Relative positions always point to the place where you originally put them (relatively speaking). In peer-to-peer editing, it is impossible to transform index positions so that everyone ends up with the same positions.

Features such as comments should either be implemented as document state or using relative positions.

A relevant discussion to this topic is found in the ProseMirror discussion board:

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fdiscuss.prosemirror.net%2Fuploads%2Fsecondsite%2Foptimized%2F1X%2Fb34ccac8d89d8750984fb892df700a0bc60d0893_2_32x32.ico&width=20&dpr=4&quality=100&sign=605176af&sv=2)Offline, Peer-to-Peer, Collaborative Editing using Yjsdiscuss.ProseMirror](https://discuss.prosemirror.net/t/offline-peer-to-peer-collaborative-editing-using-yjs/2488)

## Versions and showing the differences

This is still a bit experimental, but you can create versions (snapshots of the current state of the document) and show the differences between versions. When we allow offline editing, it is important to show to the user the changes that happened while he was away (a diff of changes). The user can then resolve any potential conflicts. A basic example of how versions can be implemented is shown in the [demos repository](https://github.com/yjs/yjs-demos/tree/master/prosemirror-versions).

[Yjs Prosemirror Versions Example](https://demos.yjs.dev/prosemirror-versions/prosemirror-versions.html)

Source code: https://github.com/yjs/yjs-demos/tree/master/prosemirror-versions

In the basic versions example, we disable garbage collection of deleted content because we want to preserve the deleted strings. This is a problem that is mostly overcome, and you can play with the approach that I implemented on yjs.dev.

In peer-to-peer shared editing, there is no linear history of edits. I suggest that every user preserves its own history of versions. For example, the user could create a version before it receives changes. Another approach is to create versions regularly or let the user handle them. You can share the versions using Yjs types, but this would enforce every user to preserve the complete editing history, although these users might not be interested in all versions.

The yjs.dev website has a ProseMirror example that shows that versions work even with a lot of collaborators. The document has been online since February 2020 and still doesn't slow down. Only content that is relevant to the local version history is preserved.

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fyjs.dev%2Fimages%2Flogo%2Fyjs-120x120.png&width=20&dpr=4&quality=100&sign=4e3410eb&sv=2)Yjs Shared Editing](https://yjs.dev/)

[PreviousEditor Bindings](/ecosystem/editor-bindings)[NextTipTap](/ecosystem/editor-bindings/tiptap2)

Last updated 4 years ago

Was this helpful?