import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const users = await db.user.findMany({
    where: { clips: { some: { visibility: "public" } } },
    select: {
      id: true, username: true, avatar: true,
      _count: { select: { clips: true, followers: true } },
      clips: {
        where: { visibility: "public" },
        select: { _count: { select: { likes: true } }, views: true },
      },
    },
    take: 20,
  });

  const ranked = users.map(u => ({
    id:          u.id,
    username:    u.username,
    avatar:      u.avatar,
    _count:      u._count,
    totalLikes:  u.clips.reduce((acc, c) => acc + c._count.likes, 0),
    totalViews:  u.clips.reduce((acc, c) => acc + c.views, 0),
  })).sort((a, b) => b.totalLikes - a.totalLikes).slice(0, 10);

  return NextResponse.json({ users: ranked });
}
