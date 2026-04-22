import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/users/[username]
export async function GET(_req: NextRequest, { params }: { params: { username: string } }) {
  const user = await db.user.findUnique({
    where: { username: params.username },
    select: {
      id: true, username: true, avatar: true, bio: true, createdAt: true,
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

// POST /api/users/[username]/follow — toggle follow
export async function POST(_req: NextRequest, { params }: { params: { username: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const target = await db.user.findUnique({ where: { username: params.username } });
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
