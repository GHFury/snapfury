import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? "fallback-secret"
);

type AuthUser = {
  id:       string;
  username: string;
  email:    string;
};

/**
 * Gets the authenticated user from either:
 * 1. A NextAuth session cookie (web app)
 * 2. A Bearer JWT token (ClipFury companion app)
 *
 * Returns null if neither is present or valid.
 */
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  // First try NextAuth session (web app flow)
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return {
      id:       session.user.id,
      username: session.user.username,
      email:    session.user.email,
    };
  }

  // Fall back to Bearer token (companion app flow)
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const userId = payload.userId as string;
    if (!userId) return null;

    // Verify the user still exists in the database
    const user = await db.user.findUnique({
      where:  { id: userId },
      select: { id: true, username: true, email: true },
    });

    return user ?? null;
  } catch {
    return null;
  }
}
