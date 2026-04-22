import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscores only"),
  email:    z.string().email(),
  password: z.string().min(8),
});

// POST /api/users — register
export async function POST(req: NextRequest) {
  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { username, email, password } = parsed.data;

  const exists = await db.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (exists) {
    const field = exists.email === email ? "email" : "username";
    return NextResponse.json({ error: `${field} already taken` }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user   = await db.user.create({
    data: { username, email, password: hashed },
    select: { id: true, username: true, email: true },
  });

  return NextResponse.json(user, { status: 201 });
}
