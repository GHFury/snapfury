import { NextRequest, NextResponse } from "next/server";

// Dev-mode endpoint that accepts any PUT (simulates storage upload)
// In production this route is never called — real presigned R2/S3 URLs are used instead
export async function PUT(_req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function POST(_req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}
