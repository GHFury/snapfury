import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim());

// POST /api/sotw/winner — admin picks the winner
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Simple admin gate — add your email to ADMIN_EMAILS in .env
  if (!ADMIN_EMAILS.includes(session.user.email ?? ""))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { clipId, weekStart } = await req.json();

  const winner = await db.snapOfTheWeek.upsert({
    where:  { clipId },
    update: { weekStart: new Date(weekStart) },
    create: { clipId, weekStart: new Date(weekStart) },
    include: {
      clip: {
        include: {
          user: { select: { username: true, email: true } },
        },
      },
    },
  });

  // TODO: send winner notification email
  // TODO: trigger YouTube upload via YouTube Data API

  return NextResponse.json({ success: true, winner });
}
