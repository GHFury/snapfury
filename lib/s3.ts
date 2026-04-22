import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const storage = new S3Client({
  region: process.env.STORAGE_REGION ?? "auto",
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.STORAGE_BUCKET_NAME!;

/** Generate a presigned URL for direct browser → storage upload */
export async function getUploadUrl(key: string, contentType: string, maxBytes = 524_288_000) {
  const cmd = new PutObjectCommand({
    Bucket:        BUCKET,
    Key:           key,
    ContentType:   contentType,
    ContentLength: maxBytes,
  });
  const url = await getSignedUrl(storage, cmd, { expiresIn: 3600 });
  return { url, key };
}

/** Public CDN URL for a stored object */
export function getPublicUrl(key: string) {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/${key}`;
}

/** Delete an object from storage */
export async function deleteObject(key: string) {
  await storage.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/** Generate a storage key for a clip */
export function clipKey(userId: string, filename: string) {
  const ext  = filename.split(".").pop() ?? "mp4";
  const slug = Date.now().toString(36);
  return `clips/${userId}/${slug}.${ext}`;
}

/** Generate a storage key for a thumbnail */
export function thumbKey(userId: string) {
  return `thumbnails/${userId}/${Date.now().toString(36)}.jpg`;
}
