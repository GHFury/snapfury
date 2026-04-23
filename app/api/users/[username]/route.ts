import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Returns a user's public profile with their recent clips
export async function GET(_req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true, username: true, avatar: true, displayName: true, bio: true, snapId: true, twitter: true, discord: true, twitch: true, youtube: true, createdAt: true,
      _count: { select: { clips: true, followers: true, following: true } },
      clips: {
        where:   { visibility: "public" },
        orderBy: { createdAt: "desc" },
        take:    12,
        include: { tags: { select: { tag: true } }, _count: { select: { likes: true } } },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

// Toggles a follow relationship between the current user and the target
export async function POST(_req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const target = await db.user.findUnique({ where: { username } });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (target.id === session.user.id) return NextResponse.json({ error: "Can't follow yourself" }, { status: 400 });

  const existing = await db.follow.findUnique({
    where: { followerId_followingId: { followerId: session.user.id, followingId: target.id } },
  });

  if (existing) {
    await db.follow.delete({ where: { id: existing.id } });
    return NextResponse.json({ following: false });
  } else {
    await db.follow.create({ data: { followerId: session.user.id, followingId: target.id } });
    return NextResponse.json({ following: true });
  }
}
