import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/** Get the start of the current week (Monday 00:00 UTC) */
function currentWeekStart() {
  const now  = new Date();
  const day  = now.getUTCDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  const mon  = new Date(now);
  mon.setUTCDate(now.getUTCDate() + diff);
  mon.setUTCHours(0, 0, 0, 0);
  return mon;
}

// Returns the current Snap of the Week winner and this week's entry list
export async function GET() {
  const weekStart = currentWeekStart();

  const [winner, entries, entryCount] = await Promise.all([
    // Latest winner (most recent week that has one)
    db.snapOfTheWeek.findFirst({
      orderBy: { weekStart: "desc" },
      include: {
        clip: {
          include: {
            user:   { select: { id: true, username: true, avatar: true } },
            tags:   { select: { tag: true } },
            _count: { select: { likes: true, comments: true } },
          },
        },
      },
    }),
    // This week's top entries (sorted by likes)
    db.sotwEntry.findMany({
      where: { weekStart },
      include: {
        clip: {
          include: {
            user:   { select: { id: true, username: true, avatar: true } },
            _count: { select: { likes: true } },
          },
        },
      },
      orderBy: { clip: { likes: { _count: "desc" } } },
      take: 10,
    }),
    db.sotwEntry.count({ where: { weekStart } }),
  ]);

  return NextResponse.json({ winner, entries, entryCount, weekStart });
}

// Enters a clip into this week's Snap of the Week contest
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clipId } = await req.json();
  if (!clipId) return NextResponse.json({ error: "clipId required" }, { status: 400 });

  // Verify clip belongs to user
  const clip = await db.clip.findUnique({ where: { id: clipId } });
  if (!clip) return NextResponse.json({ error: "Clip not found" }, { status: 404 });
  if (clip.userId !== session.user.id)
    return NextResponse.json({ error: "Not your clip" }, { status: 403 });
  if (clip.visibility !== "public")
    return NextResponse.json({ error: "Clip must be public to enter" }, { status: 400 });

  const weekStart = currentWeekStart();

  // One entry per user per week
  const existing = await db.sotwEntry.findUnique({
    where: { userId_weekStart: { userId: session.user.id, weekStart } },
  });
  if (existing)
    return NextResponse.json({ error: "Already entered this week. One entry per week!" }, { status: 409 });

  const entry = await db.sotwEntry.create({
    data: { clipId, userId: session.user.id, weekStart },
    include: { clip: { select: { title: true } } },
  });

  return NextResponse.json({ success: true, entry }, { status: 201 });
}
