# Awareness & Presence

[Edit](https://github.com/yjs/docs/blob/main/getting-started/adding-awareness.md)

# Awareness & Presence

Propagating awareness information such as presence & cursor locations.

Awareness features are an integral part of collaborative applications. In the last chapter, we made an editor collaborative by syncing content among all users. But we can communicate more information to help our users work together. By sharing cursor locations and presence information, we help our users to actively work together. Most applications also assign a unique name and color to each user. This kind of information can be generally classified as "Awareness" information. It gives you hints about what other users are currently doing.

We could share even more awareness information like the mouse position of each user, or a live video recording of each user. But when we share too much information, we distract our users from the task at hand. So it is important to find the right balance, that makes sense for your application.

Awareness information isn't stored in the Yjs document, as it doesn't need to be persisted across sessions. Instead, we use a tiny state-based Awareness CRDT that propagates JSON objects to all users. When you go offline, your own awareness state is automatically deleted and all users are notified that you went offline. While this feature is optional, it is recommended that network providers implement the awareness protocol to make it easier to switch providers. All our network providers implement the Awareness CRDT.

In this part of the tutorial we use the Awareness CRDT to render remote cursor locations in the Quill editor. Furthermore, we implement a basic interface to render a list of remote users and assign them a user-name that can be updated in real-time.

## 

[](#quick-start-awareness-crdt)

Quick start: Awareness CRDT

The following example shows how you retrieve the Awareness CRDT from the network provider. Then we can set some properties that are propagated to all users. We define the`"user"` property to set the name and preferred color for the current user.

Copy

The fields of the Awareness CRDT are not standardized. You can set any JSON-encodable value. The editor bindings commonly use the `"cursor"` field to communicate cursor locations. They use the `"user"` field to render the cursor object in a unique color, with the user name above the cursor location.

![](https://docs.yjs.dev/~gitbook/image?url=https%3A%2F%2F3672631625-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fassets%252F-MAkuXEU862fGj2p9idv%252F-MLmo5nKNvSBLCGhJOHd%252F-MLmyFupwLK0HAlEAz7U%252FAwareness%2520cursors-small.png%3Falt%3Dmedia%26token%3Db290ecd9-6bed-4b07-9f19-d28bd54542b1&width=768&dpr=4&quality=100&sign=549bcf20&sv=2)

Example of y-quill using different colors.

All editor bindings that support rendering cursor information accept an awareness instance to render cursor information. If the `"user"` awareness field is unspecified, then the editor binding will render the cursor in a default color using a random user name.

Copy

For now, we have covered everything we need to know to continue with our tutorial. The complete API documentation for the Awareness CRDT is available in a separate section:

[Awareness](/api/about-awareness)

## 

[](#adding-common-awareness-features-to-our-collaborative-editor)

Adding common awareness features to our collaborative editor

In the below live-code example, I added common awareness features to our editor project. It assigns a random color and a random user-name to each user using the [`do_username`](https://www.npmjs.com/package/do_username) npm package. Furthermore, it renders all present users in a list in their respective colors.

[PreviousA Collaborative Editor](/getting-started/a-collaborative-editor)[NextOffline Support](/getting-started/allowing-offline-editing)

Last updated 4 years ago

Was this helpful?

Source: https://docs.yjs.dev/getting-started/adding-awareness
