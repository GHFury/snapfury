import { createClient } from "@supabase/supabase-js";

const supabaseUrl      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use the service role key so we can write to storage from the server
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET = process.env.STORAGE_BUCKET_NAME ?? "snapfury-clips";

/** Generate a signed upload URL for direct browser → Supabase upload */
export async function getSupabaseUploadUrl(path: string) {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) throw new Error(error?.message ?? "Failed to create upload URL");
  return { signedUrl: data.signedUrl, token: data.token, path };
}

// Returns the public CDN URL for a file in storage
export function getPublicUrl(path: string) {
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Removes a file from storage
export async function deleteFile(path: string) {
  await supabaseAdmin.storage.from(BUCKET).remove([path]);
}

// Builds a unique storage path for a clip file
export function clipPath(userId: string, filename: string) {
  const ext  = filename.split(".").pop() ?? "mp4";
  const slug = Date.now().toString(36);
  return `clips/${userId}/${slug}.${ext}`;
}
