# TERMINUS·7

Cyberpunk neural-core chat uplink. Built from the Claude Design schema as a **Next.js + React + Tailwind** app with **Vercel AI Gateway** streaming and **Neon Postgres** persistence.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- AI SDK (`streamText`) via Vercel AI Gateway
- Neon Serverless Postgres + Drizzle ORM
- PWA manifest + `/preview/ios` framed mobile showcase (`IOSDevice`)

## Setup

```bash
npm install
cp .env.example .env.local
# set DATABASE_URL and AI_GATEWAY_API_KEY (or use Vercel OIDC)
npm run db:push
npm run dev
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push Drizzle schema to Neon |

## UI

- Desktop: sidebar session log + top `CMD_INPUT` module + staggered feed
- Mobile (`<900px`): PWA layout with session slide-over + bottom input dock
- `/preview/ios`: design-schema phone frame preview
