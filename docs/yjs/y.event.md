---
title: Y.Event
source: https://docs.yjs.dev/api/y.event
scraped_at: 2025-09-20 19:51:00
---

# Y.Event

[Edit](https://github.com/yjs/docs/blob/main/api/y.event.md)

1. [🔧API](/api)

# Y.Event

### Y.Event API

`yevent.target: Y.AbstractType` The shared type that this event was created on. This event describes the changes on `target`.

`yevent.currentTarget: Y.AbstractType` The current target of the event as the event traverses through the (deep)observer callbacks. It refers to the type on which the event handler (observe/observeDeep) has been attached. Similar to [Event.currentTarget](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget).

`yevent.transaction: Y.Transaction` The transaction in which this event was created on.

`yevent.path: Array<String|number>` Computes the path from the Y.Doc to the changed type. You can traverse to the changed type by calling `ydoc.get(path[0]).get(path[1]).get(path[2]).get( ..`.

`yevent.changes.delta: Delta` Computes the changes in the array-delta format. See more in the [Delta Format](/api/delta-format) section. The text delta is only available on Y.TextEvent (`ytextEvent.delta`)

`yevent.changes.keys: Map<string, { action: 'add' | 'update' | 'delete', oldValue: any }>` Computes changes on the attributes / key-value map of a shared type. In Y.Map it is used to represent changed keys. In Y.Xml it is used to describe changes on the XML-attributes.

[PreviousY.UndoManager](/api/undo-manager)[NextDelta Format](/api/delta-format)

Last updated 4 years ago

Was this helpful?