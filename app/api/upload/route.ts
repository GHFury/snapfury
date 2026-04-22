import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUploadUrl, clipKey, thumbKey } from "@/lib/s3";

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];
const MAX_SIZE = Number(process.env.MAX_UPLOAD_SIZE ?? 524_288_000); // 500MB

// POST /api/upload — get presigned URL for direct upload
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { filename, contentType, size, type } = await req.json();

  if (type === "video") {
    if (!ALLOWED_VIDEO_TYPES.includes(contentType))
      return NextResponse.json({ error: "Unsupported video format" }, { status: 400 });
    if (size > MAX_SIZE)
      return NextResponse.json({ error: "File too large (max 500MB)" }, { status: 400 });

    const key = clipKey(session.user.id, filename);
    const { url } = await getUploadUrl(key, contentType, size);
    return NextResponse.json({ url, key });
  }

  if (type === "thumbnail") {
    const key = thumbKey(session.user.id);
    const { url } = await getUploadUrl(key, "image/jpeg", 5_000_000);
    return NextResponse.json({ url, key });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
