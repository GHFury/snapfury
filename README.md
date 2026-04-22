# ⚡ SNAP FURY

> **Marvel Snap's #1 Clip Community** — Share your greatest snaps, build your reputation, feel the fury.

![Snap Fury](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Snap Fury](https://img.shields.io/badge/PostgreSQL-Prisma-blue?style=for-the-badge&logo=postgresql)
![Snap Fury](https://img.shields.io/badge/Storage-Cloudflare_R2-orange?style=for-the-badge&logo=cloudflare)
![Snap Fury](https://img.shields.io/badge/Auth-NextAuth.js-green?style=for-the-badge)

---

## 🗺️ What Is This?

Snap Fury is a community platform for Marvel Snap players to upload, share, and discover the best gameplay clips. Think Medal.tv meets the Daily Bugle — built with a full comic book newspaper aesthetic.

**Companion app** (coming soon) automatically detects snaps via audio cue recognition and triggers OBS to record + upload directly to the platform.

---

## 🧱 Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Framework   | [Next.js 14](https://nextjs.org) (App Router)   |
| Database    | PostgreSQL via [Prisma ORM](https://prisma.io)  |
| Auth        | [NextAuth.js](https://next-auth.js.org) — Google, Discord, Twitch, Email |
| Storage     | [Cloudflare R2](https://cloudflare.com/r2) (S3-compatible, no egress fees) |
| Styling     | Tailwind CSS + custom comic book CSS             |
| Language    | TypeScript                                       |
| Hosting     | [Vercel](https://vercel.com) (recommended)       |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/snapfury.git
cd snapfury
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env` with your credentials. See [Environment Variables](#-environment-variables) below.

### 3. Set up the database

You need a PostgreSQL database. Easiest free options:
- **[Supabase](https://supabase.com)** — free tier, generous limits
- **[Railway](https://railway.app)** — $5 credit free
- **[Neon](https://neon.tech)** — serverless PostgreSQL, free tier

```bash
# Push schema to your database
npm run db:push

# Generate Prisma client
npm run db:generate

# (Optional) Seed with sample data
npm run db:seed
```

### 4. Set up storage

Snap Fury uses **Cloudflare R2** for video storage (no egress fees = cheaper than S3).

1. Create a [Cloudflare account](https://dash.cloudflare.com)
2. Go to **R2 → Create bucket** → name it `snapfury-clips`
3. Create an **API token** with R2 read/write permissions
4. Add a **custom domain** to your bucket (e.g. `clips.snapfury.com`)
5. Fill in the R2 credentials in `.env`

> **Alternative:** Any S3-compatible storage works (AWS S3, Backblaze B2, etc.) — just update `STORAGE_ENDPOINT`.

### 5. Set up OAuth providers

#### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs
4. Copy Client ID and Secret to `.env`

#### Discord
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application → **OAuth2**
3. Add `http://localhost:3000/api/auth/callback/discord` as redirect URI
4. Copy Client ID and Secret to `.env`

#### Twitch
1. Go to [Twitch Dev Console](https://dev.twitch.tv/console/apps)
2. Register a new app → set OAuth Redirect to `http://localhost:3000/api/auth/callback/twitch`
3. Copy Client ID and Secret to `.env`

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
snapfury/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── clips/                # GET list, POST create
│   │   │   └── [id]/
│   │   │       ├── route.ts      # GET, PATCH, DELETE clip
│   │   │       └── like/         # POST toggle like
│   │   ├── upload/               # POST presigned URL
│   │   └── users/
│   │       ├── route.ts          # POST register
│   │       └── [username]/       # GET profile, POST follow
│   ├── (auth)/
│   │   ├── signin/               # Sign in page
│   │   └── signup/               # Sign up page
│   ├── clips/[id]/               # Clip detail page
│   ├── upload/                   # Upload flow page
│   ├── profile/[username]/       # User profile page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/                   # Navbar, Footer, Masthead
│   ├── clips/                    # ClipCard, ClipGrid, Player
│   └── ui/                       # Buttons, Inputs, Badges
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── auth.ts                   # NextAuth config
│   └── s3.ts                     # Storage helpers
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Sample data
├── types/
│   └── next-auth.d.ts            # Session type augmentation
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔌 API Reference

| Method | Endpoint                     | Auth | Description              |
|--------|------------------------------|------|--------------------------|
| GET    | `/api/clips`                 | —    | List clips (paginated)   |
| POST   | `/api/clips`                 | ✅   | Create a clip            |
| GET    | `/api/clips/:id`             | —    | Get clip + increment view|
| PATCH  | `/api/clips/:id`             | ✅   | Update clip (owner only) |
| DELETE | `/api/clips/:id`             | ✅   | Delete clip (owner only) |
| POST   | `/api/clips/:id/like`        | ✅   | Toggle like              |
| GET    | `/api/sotw`                  | —    | Current winner + entries |
| POST   | `/api/sotw`                  | ✅   | Enter clip this week     |
| POST   | `/api/sotw/winner`           | 🔐   | Admin: pick winner       |
| POST   | `/api/upload`                | ✅   | Get presigned upload URL |
| POST   | `/api/users`                 | —    | Register new user        |
| GET    | `/api/users/:username`       | —    | Get user profile + clips |
| POST   | `/api/users/:username`       | ✅   | Toggle follow            |

### Query params for `GET /api/clips`

| Param    | Values                      | Default   |
|----------|-----------------------------|-----------|
| `sort`   | `latest`, `trending`, `top` | `latest`  |
| `tag`    | Any clip tag string         | —         |
| `userId` | User ID to filter by        | —         |
| `page`   | Page number                 | `1`       |
| `limit`  | Results per page (max 50)   | `12`      |

---

## 🗄️ Database Schema

```
User ──< Clip ──< ClipTag
     ──< Like >── Clip
     ──< Comment >── Clip
     ──< Save >── Clip
     ──< Follow >── User (self-referential)
     ──< Account (OAuth)
     ──< Session
```

---

## 🌍 Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# → Settings → Environment Variables → paste from .env
```

After deploying, update your OAuth redirect URIs from `localhost:3000` to your production URL.

---

## 🔮 Roadmap

### Phase 1 — Web Platform ✅ (in progress)
- [x] Homepage — comic newspaper style
- [x] Auth — Sign up / Sign in (Google, Discord, Twitch, Email)
- [x] Upload flow — drag & drop, tags, visibility
- [x] Clip detail — player, comments, likes, share
- [ ] User profile page
- [ ] Browse / search / filter page

### Phase 2 — Companion App (Windows)
- [ ] System tray app (Electron/Tauri)
- [ ] Real-time audio monitoring
- [ ] Snap cue detection ("Snap", "Oh Snap", "Opponent Snapped")
- [ ] OBS WebSocket integration → auto record clip
- [ ] "Upload to SnapFury" / "Save Locally" dialog

### Phase 3 — Community
- [ ] Notifications
- [ ] Following feed
- [x] Snap of the Week — weekly featured clip + YouTube upload
- [ ] Weekly leaderboard
- [ ] Discord bot integration
- [ ] YouTube Shorts auto-format export

---

## 🤝 Contributing

PRs welcome! Open an issue first for major changes.

---

## ⚖️ Legal

Snap Fury is a fan community project. Not affiliated with Marvel Entertainment, LLC or Second Dinner Studios, Inc. Marvel Snap™ is a trademark of Marvel.

---

*"All The Snaps Fit To Print"* ⚡
