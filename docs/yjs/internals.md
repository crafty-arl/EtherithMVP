---
title: Internals
source: https://docs.yjs.dev/api/internals
scraped_at: 2025-09-20 19:51:12
---

# Internals

[Edit](https://github.com/yjs/docs/blob/main/api/internals.md)

1. [🔧API](/api)

# Internals

Implementation Details - The inner working of Yjs

### CRDT Paper

Yjs is a CRDT implementation. It implements an adaptation of the YATA CRDT with improved runtime performance.

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fwww.researchgate.net%2Ffavicon-96x96.png&width=20&dpr=4&quality=100&sign=dca3342f&sv=2)(PDF) Near Real-Time Peer-to-Peer Shared Editing on Extensible Data TypesResearchGate](https://www.researchgate.net/publication/310212186_Near_Real-Time_Peer-to-Peer_Shared_Editing_on_Extensible_Data_Types)

### Implementation Details

Choosing efficient data structures is critical when implementing a CRDT. The following document gives an overview of the data structures used in Yjs.

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fgithub.com%2Ffluidicon.png&width=20&dpr=4&quality=100&sign=46771325&sv=2)yjs/INTERNALS.md at main · yjs/yjsGitHub](https://github.com/yjs/yjs/blob/main/INTERNALS.md)

### Internals Visualization

Visualization of different CRDT algorithms (including Yjs/YATA and Automerge/RGA).

<https://text-crdt-compare.surge.sh/>

### Optimizations Overview

JavaScript manages memory automatically using a garbage collection approach. Yjs is a particularly efficient implementation of the YATA CRDT that works well in the browser and in NodeJS. This article analyzes the performance of Yjs in JavaScript.

[![Logo](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2Fblog.kevinjahns.de%2Ffavicon.ico&width=20&dpr=4&quality=100&sign=747c8ddc&sv=2)Are CRDTs suitable for shared editing?Kevin's Blog](https://blog.kevinjahns.de/are-crdts-suitable-for-shared-editing)

### Codebase Walkthrough

[PreviousSubdocuments](/api/subdocuments)[NextFAQ](/api/faq)

Last updated 4 years ago

Was this helpful?