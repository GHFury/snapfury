import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  displayName: z.string().max(50).nullish(),
  bio:         z.string().max(300).nullish(),
  snapId:      z.string().max(50).nullish(),
  twitter:     z.string().max(50).nullish(),
  discord:     z.string().max(50).nullish(),
  twitch:      z.string().max(50).nullish(),
  youtube:     z.string().max(100).nullish(),
});

// Updates the current user's profile fields
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body   = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // Remove leading @ if the user typed it — we store handles without it
  const clean = (val?: string) => val?.replace(/^@/, "").trim() || null;

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: {
      displayName: parsed.data.displayName?.trim() || null,
      bio:         parsed.data.bio?.trim()         || null,
      snapId:      parsed.data.snapId?.trim()      || null,
      twitter:     clean(parsed.data.twitter),
      discord:     clean(parsed.data.discord),
      twitch:      clean(parsed.data.twitch),
      youtube:     clean(parsed.data.youtube),
    },
    select: {
      id: true, username: true, displayName: true, bio: true,
      snapId: true, twitter: true, discord: true, twitch: true, youtube: true,
    },
  });

  return NextResponse.json(updated);
}

// Returns the current user's full profile including private fields like email
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, username: true, email: true, displayName: true,
      bio: true, snapId: true, twitter: true, discord: true,
      twitch: true, youtube: true, avatar: true,
    },
  });

  return NextResponse.json(user);
}
