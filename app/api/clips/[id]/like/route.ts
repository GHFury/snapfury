import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/clips/[id]/like — toggle like
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await db.like.findUnique({
    where: { userId_clipId: { userId: session.user.id, clipId: params.id } },
  });

  if (existing) {
    await db.like.delete({ where: { id: existing.id } });
    const count = await db.like.count({ where: { clipId: params.id } });
    return NextResponse.json({ liked: false, count });
  } else {
    await db.like.create({ data: { userId: session.user.id, clipId: params.id } });
    const count = await db.like.count({ where: { clipId: params.id } });
    return NextResponse.json({ liked: true, count });
  }
}
