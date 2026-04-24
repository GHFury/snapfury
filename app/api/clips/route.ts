import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  title:       z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  videoUrl:    z.string().url(),
  thumbnailUrl:z.string().url().optional(),
  tags:        z.array(z.string()).max(8).default([]),
  visibility:  z.enum(["public", "unlisted"]).default("public"),
});

// Returns a paginated list of public clips with sorting and tag filtering
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page    = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit   = Math.min(50, Number(searchParams.get("limit") ?? 12));
  const sort    = searchParams.get("sort") ?? "latest"; // latest | trending | top
  const tag     = searchParams.get("tag");
  const userId  = searchParams.get("userId");

  const where = {
    visibility: "public" as const,
    ...(tag    ? { tags: { some: { tag } } } : {}),
    ...(userId ? { userId } : {}),
  };

  const orderBy =
    sort === "trending" ? { views: "desc" as const } :
    sort === "top"      ? { likes: { _count: "desc" as const } } :
                          { createdAt: "desc" as const };

  const [clips, total] = await Promise.all([
    db.clip.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user:     { select: { id: true, username: true, avatar: true } },
        tags:     { select: { tag: true } },
        _count:   { select: { likes: true, comments: true } },
      },
    }),
    db.clip.count({ where }),
  ]);

  return NextResponse.json({ clips, total, page, pages: Math.ceil(total / limit) });
}

// Creates a new clip record after the video has been uploaded to storage
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body   = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { title, description, videoUrl, thumbnailUrl, tags, visibility } = parsed.data;

  const clip = await db.clip.create({
    data: {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      visibility,
      userId: user.id,
      tags: { create: tags.map(tag => ({ tag })) },
    },
    include: {
      user: { select: { id: true, username: true, avatar: true } },
      tags: { select: { tag: true } },
    },
  });

  return NextResponse.json(clip, { status: 201 });
}
