---
name: vercel-react-best-practices
description: >-
  React and Next.js 15 App Router performance optimization guidelines:
  RSC boundaries, streaming, parallel data fetching, bundle efficiency.
---

# Vercel React Best Practices

Derived from `vercel-labs/agent-skills/vercel-react-best-practices` on skills.sh:
1. **Server vs Client Components**: Keep data fetching on the server using Server Components. Mark only interactive nodes (like React Flow canvas or toggles) with `'use client'`.
2. **Parallel Fetching**: Avoid waterfalls. Fetch subjects and topics concurrently with `Promise.all` where applicable.
3. **Serialization**: Pass minimal serializable props across the client-server boundary.
4. **Optimistic Updates**: For learner progress actions, update the UI state immediately before awaiting the network roundtrip.
