1. Login with Discord

Feature:

Users authenticate with Discord OAuth (no wallets, no passwords).

Pulls id, username, and optional avatar.

Tech Stack:

Discord OAuth2 for authentication.

Profile stored in Y.Doc ({id, username, avatarCID, contactLink}).

Avatar uploaded to IPFS via Helia → pinned with Pinata.

Persistence:

Profile mirrored in IndexedDB (offline persistence).

Public profiles added to shared archive Y.Doc for attribution.

2. Upload Content (Text, Docs, Audio, Images, Video)

Feature:

Users upload files as memories.

Each requires a Memory Note (2–3 lines).

Tech Stack:

File → Helia (helia.add(file)) → CID generated.

CID pinned with Pinata (pinning API).

Metadata stored in Y.Doc:

{ cid, note, type, visibility, timestamp, userId }


Persistence:

File pinned in IPFS.

Metadata persisted locally in IndexedDB.

Memory state mirrored in Y.Doc.

3. Memory Note (Required Context)

Feature:

Every upload must include a short note explaining its importance.

Tech Stack:

Stored as Y.Text inside the memory object.

Bound to React form inputs with y-react.

Persistence:

Saved immediately to Y.Doc → mirrored in IndexedDB.

Included in IPFS snapshot when archived.

4. Visibility (Public or Private)

Feature:

Public → visible in shared archive.

Private → only user can access.

Tech Stack:

Visibility flag ("public" | "private") inside Y.Doc.

Private → file encrypted before Helia upload.

Public → moderated by Cloudflare AI before joining archive.

Persistence:

Public memories → shared archive Y.Doc → pinned.

Private memories → encrypted file pinned → metadata only in user’s Y.Doc.

5. Safe Keeping Vault

Feature:

Dedicated vault view showing all user’s memories.

Displays status: Local, Uploaded, Pinned, Moderated.

Tech Stack:

Files uploaded via Helia → pinned with Pinata.

Proof JSON created:

{
  "cid": "bafy…",
  "timestamp": "2025-09-20T22:11Z",
  "pinned": true,
  "pinService": "Pinata"
}


Vault UI = React + Y.Doc binding.

Persistence:

Vault metadata stored in Y.Doc.

Mirrored in IndexedDB.

Proof receipts exportable and optionally archived on IPFS.

6. Proof of Preservation

Feature:

Every upload generates a verifiable receipt (CID + timestamp + pin status).

Tech Stack:

CID from Helia.

Pin status verified via Pinata API.

Proof object stored in Y.Doc and downloadable.

Persistence:

Receipts mirrored in IndexedDB.

Optionally included in IPFS snapshot.

7. Searchable Archive (Public Memories)

Feature:

Anyone can browse/search public submissions.

Each entry attributed to user’s Discord profile.

Tech Stack:

Shared Y.Doc archive (synced via y-webrtc/libp2p).

Indexed search across metadata (note, type, user).

Archive snapshots periodically pinned to IPFS.

Persistence:

Archive state = Y.Doc → IPFS.

Reloadable from IPFS, resyncs with peers.

8. Content Moderation (Cloudflare Workers AI)

Feature:

Public memories are screened before publishing.

AI checks Memory Note text + file hash/thumbnail.

Blocks NSFW, hate speech, violence, spam.

Tech Stack:

Cloudflare Workers AI (e.g., @cf/openai-moderation).

Worker returns { status, categories, confidence }.

Results stored in memory metadata inside Y.Doc.

Persistence:

Approved → added to archive Y.Doc + pinned.

Rejected → kept private in user’s Y.Doc only.

Proof includes moderation result.

9. Lightweight Profiles

Feature:

Profiles tied to Discord login.

Include username, avatar, optional contact.

Tech Stack:

Profile = Y.Doc object.

Avatar → IPFS via Helia → pinned with Pinata.

Persistence:

Profile mirrored locally in IndexedDB.

Public profiles added to archive Y.Doc.

10. Offline Mode

Feature:

Etherith runs offline-first.

Users can upload and annotate memories without internet.

Tech Stack:

Service Worker caches app shell (React + Vite PWA).

y-indexeddb mirrors all Y.Doc changes locally.

Persistence:

When back online, Helia + Pinata uploads resume.

Archive sync continues P2P via y-webrtc/libp2p.

🔁 Unified Persistence Cycle

User Action → Y.Doc updated.

Local First → mirrored in IndexedDB.

File Upload → Helia → Pinata pin.

Proof → stored in Y.Doc, optionally archived in IPFS.

Visibility:

Public → AI Worker moderation → if passed, added to shared archive Y.Doc + pinned.

Private → encrypted, pinned, stays in personal Y.Doc.

Archive → browsable, searchable, safe, with Discord attribution.

⚡ This outline makes Etherith a trustworthy memory vault:

Local-first & P2P (Yjs + IndexedDB + y-webrtc/libp2p).

Decentralized permanence (Helia + Pinata).

Safe public sharing (Cloudflare AI moderation).

Frictionless login & attribution (Discord).