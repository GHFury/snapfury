import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({ text: z.string().min(1).max(500) });

// Adds a comment to a clip
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const comment = await db.comment.create({
    data: { text: parsed.data.text, userId: session.user.id, clipId: id },
    include: { user: { select: { id: true, username: true, avatar: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
