# Snap Fury — Design Document

This document covers the architecture decisions, feature breakdown, and roadmap for Snap Fury. The README covers setup — this covers the why.

---

## What It Is

Snap Fury is a clip-sharing community for Marvel Snap players. The core idea is simple: Marvel Snap has no built-in clip sharing. Players record their best moments manually and post them to YouTube or Discord. Snap Fury gives those moments a proper home — a dedicated platform where clips are searchable, reactionable, and can earn recognition through the community.

The companion app (planned, not yet built) closes the loop by automating the capture side. It listens for the game's audio cues ("Snap", "Oh Snap", "Opponent Snapped"), triggers OBS to save a clip, and gives the player an immediate choice to upload or save locally.

---

## Tech Stack Decisions

**Next.js 15 (App Router)**
The app router made sense here because most pages need a mix of server and client rendering. Clip lists are fetched server-side for SEO. The player, comments, and like button need client interactivity. Next.js handles both cleanly.

**Neon (PostgreSQL)**
Chose Neon over Supabase for the database because Neon's serverless driver handles cold starts better in a Vercel edge environment. The schema is straightforward relational data — users, clips, likes, comments, follows — PostgreSQL is the right tool.

**Supabase Storage**
Video files never touch the Next.js server. The upload flow gets a presigned URL from Supabase, the browser uploads directly to storage, then the API saves the resulting public URL to the database. This keeps the server lightweight and means we're not paying for egress on every video view.

**NextAuth**
Handles Google, Discord, and Twitch OAuth plus email/password. The Prisma adapter syncs OAuth accounts to our user table automatically. JWT sessions keep things stateless.

---

## Database Schema

The core of the data model is straightforward. A User has many Clips. Clips can have Likes, Comments, and Saves. Users can follow other Users. The ClipTag table handles the tagging system (currently: 4 Cubes, 8 Cubes, Snap & Retreat).

The Snap of the Week feature has two tables: SotwEntry (users submit their clip for the week) and SnapOfTheWeek (the picked winner). One entry per user per week. Winners are picked via an admin-only API endpoint.

---

## Pages

| Route | What it does |
|---|---|
| `/` | Homepage — newspaper/comic collage layout, live clips, Snap of the Week panel |
| `/clips` | Browse and search — filter by tag, sort by latest/trending/top, pagination |
| `/clips/[id]` | Clip detail — video player, likes, comments, creator card, related clips |
| `/upload` | Three-step upload flow — drop file, add details, publish |
| `/leaderboard` | Top snappers by total likes, top clips by total likes |
| `/profile/[username]` | Public profile — avatar, bio, Snap ID, socials, clips grid |
| `/profile/edit` | Edit your own profile fields |
| `/signin` | Sign in with email or OAuth |
| `/signup` | Create account — username, email, password |

---

## Upload Flow

1. User drops a video file on the dropzone
2. Client requests a presigned upload URL from `/api/upload`
3. Server validates file type and size, returns a Supabase signed URL
4. Client PUT-uploads directly to Supabase Storage (progress tracked via XHR)
5. Client calls `/api/clips` to create the clip record in the database
6. If "Snap of the Week" was checked, client calls `/api/sotw` to enter the clip
7. Success state shows "View My Clip" linking to the new clip page

---

## Snap of the Week

Users can opt-in their clip when uploading by checking the SOTW checkbox. This grants Snap Fury a license to feature the clip on the official YouTube channel.

Rules enforced by the API:
- One entry per user per week
- Clip must be public visibility
- Winner is picked manually by an admin (ADMIN_EMAILS env variable)

The homepage features the current winner in a dedicated panel with stats and a YouTube badge. Past winners are shown in a strip below.

---

## Companion App (Planned)

The Windows companion app is the long-term differentiator. The plan:

1. System tray application built with Electron or Tauri
2. Continuous audio monitoring of game output
3. Trigger phrases: "Snap", "Oh Snap", "Opponent Snapped"
4. On trigger: OBS WebSocket API call to save a clip buffer (last 30-60 seconds)
5. Dialog appears: Upload to Snap Fury / Save Locally / Dismiss
6. If upload: authenticate via saved token, call the same upload API

Audio detection will use either Whisper (offline speech recognition) or audio fingerprinting against known sound clips from the game.

---

## Roadmap

**Phase 1 — Web Platform (current)**
- Homepage, auth, upload, clip detail, browse, leaderboard, profiles
- Snap of the Week feature
- Google, Discord, Twitch OAuth

**Phase 2 — Community**
- Notifications (likes, comments, follows)
- Following feed on homepage
- Saved clips tab on profiles
- Discord bot integration

**Phase 3 — Companion App**
- Windows desktop app
- Audio cue detection
- OBS integration
- Direct upload to Snap Fury

**Phase 4 — Growth**
- YouTube Shorts auto-format export
- Mobile-responsive polish
- Analytics dashboard for creators

---

Not affiliated with Marvel Entertainment or Second Dinner.
