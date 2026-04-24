import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { SignJWT } from "jose";

// This endpoint exists specifically for the ClipFury companion app.
// The web app uses NextAuth sessions, but the desktop app needs
// a simple long-lived token it can store and reuse.

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? "fallback-secret"
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.password)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    // Issue a long-lived JWT for the companion app — 90 days
    const token = await new SignJWT({ userId: user.id, username: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("90d")
      .sign(SECRET);

    return NextResponse.json({
      token,
      username: user.username,
      userId:   user.id,
    });
  } catch (err) {
    console.error("App token error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
