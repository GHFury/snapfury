import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/clips/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const clip = await db.clip.findUnique({
    where: { id: params.id },
    include: {
      user:     { select: { id: true, username: true, avatar: true, bio: true, _count: { select: { followers: true, clips: true } } } },
      tags:     { select: { tag: true } },
      comments: { include: { user: { select: { id: true, username: true, avatar: true } } }, orderBy: { createdAt: "desc" }, take: 50 },
      _count:   { select: { likes: true, comments: true, saves: true } },
    },
  });

  if (!clip) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (clip.visibility !== "public") {
    const session = await getServerSession(authOptions);
    if (session?.user?.id !== clip.userId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Increment views (fire and forget)
  db.clip.update({ where: { id: params.id }, data: { views: { increment: 1 } } }).catch(() => {});

  return NextResponse.json(clip);
}

// PATCH /api/clips/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clip = await db.clip.findUnique({ where: { id: params.id } });
  if (!clip || clip.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated = await db.clip.update({
    where: { id: params.id },
    data: {
      ...(body.title       ? { title: body.title }             : {}),
      ...(body.description ? { description: body.description } : {}),
      ...(body.visibility  ? { visibility: body.visibility }   : {}),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/clips/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clip = await db.clip.findUnique({ where: { id: params.id } });
  if (!clip || clip.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.clip.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
