import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";

const ALLOWED_VIDEO_TYPES = [
  "video/mp4", "video/quicktime", "video/x-msvideo",
  "video/webm", "video/x-matroska", "video/avi",
];
const MAX_SIZE = Number(process.env.MAX_UPLOAD_SIZE ?? 524_288_000);

const supabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  process.env.STORAGE_BUCKET_NAME
);

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { filename, contentType, size, type } = await req.json();

  if (type === "video") {
    if (!ALLOWED_VIDEO_TYPES.includes(contentType))
      return NextResponse.json(
        { error: `Unsupported format: ${contentType}. Use MP4, MOV, AVI, or WebM.` },
        { status: 400 }
      );
    if (size > MAX_SIZE)
      return NextResponse.json({ error: "File too large (max 500MB)" }, { status: 400 });

    // DEV MODE — no storage configured
    if (!supabaseConfigured) {
      const slug = Date.now().toString(36);
      const ext  = (filename as string).split(".").pop() ?? "mp4";
      const path = `clips/${user.id}/${slug}.${ext}`;
      const devUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/upload/dev-accept`;
      return NextResponse.json({ url: devUrl, path, publicUrl: `https://placeholder.snapfury.com/${path}`, dev: true });
    }

    // PRODUCTION — Supabase Storage signed upload URL
    const { getSupabaseUploadUrl, getPublicUrl, clipPath } = await import("@/lib/supabase-storage");
    const path = clipPath(user.id, filename as string);
    const { signedUrl } = await getSupabaseUploadUrl(path);
    const publicUrl = getPublicUrl(path);
    return NextResponse.json({ url: signedUrl, path, publicUrl, dev: false });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
