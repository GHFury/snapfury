# Snap Fury

A community platform for Marvel Snap players to share and discover gameplay clips. Upload your best snaps, build a following, and compete for Snap of the Week.

Built with Next.js 15, PostgreSQL (Neon), Supabase Storage, and NextAuth.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database (free tier works fine)
- A [Supabase](https://supabase.com) project for video storage (free tier)
- OAuth apps for whichever providers you want (Google, Discord, Twitch)

### Setup

```bash
git clone https://github.com/YOUR_USERNAME/snapfury.git
cd snapfury
npm install
```

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

The only required variable to get started is `DATABASE_URL`. Everything else can be added as you go.

Push the schema to your database:

```bash
npm run db:generate
npm run db:push
```

Optionally seed some sample data:

```bash
npm run db:seed
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

See `.env.example` for the full list with descriptions. The key ones:

| Variable | What it's for |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for session encryption |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (for video storage) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `GOOGLE/DISCORD/TWITCH_CLIENT_ID/SECRET` | OAuth provider credentials |

To generate a `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Project Structure

```
app/
  (auth)/signin|signup    Sign in and registration pages
  api/                    API routes
    auth/[...nextauth]    NextAuth handler
    clips/                Clip CRUD, likes, comments
    users/                User profiles and follows
    upload/               Presigned upload URL generation
    sotw/                 Snap of the Week entries and winner
    leaderboard/          Leaderboard data
    profile/              Authenticated user profile updates
  clips/[id]              Clip detail page
  clips/                  Browse and search page
  leaderboard/            Leaderboard page
  upload/                 Upload flow
  profile/[username]      Public profile page
  profile/edit            Edit your own profile

components/
  layout/Navbar.tsx       Shared navigation component

lib/
  db.ts                   Prisma client singleton
  auth.ts                 NextAuth configuration
  supabase-storage.ts     Supabase Storage helpers

prisma/
  schema.prisma           Database schema
  seed.ts                 Sample data for development
```

---

## Deploying

The easiest path is Vercel. Install the CLI and run:

```bash
npx vercel
```

Set all your environment variables in the Vercel dashboard under Project Settings. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain. Update your OAuth redirect URIs in each provider's dashboard to point to your production URL as well.

---

## Notes

- Video uploads go directly to Supabase Storage via presigned URLs — the Next.js server never handles the file bytes
- The database (Neon) and file storage (Supabase) are intentionally separate services
- OAuth works for Google, Discord, and Twitch in addition to email/password
- Snap of the Week winners are picked manually via an admin-only API endpoint

---

Not affiliated with Marvel Entertainment or Second Dinner.
