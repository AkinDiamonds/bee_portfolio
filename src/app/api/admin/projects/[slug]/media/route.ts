import { NextResponse } from "next/server";
import { getAdminBucket } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const acceptedTypes = new Set(["video/mp4", "video/webm"]);
const maxBytes = 50 * 1024 * 1024;

export async function POST(request: Request, { params }: RouteContext<"/api/admin/projects/[slug]/media">) {
  const { slug } = await params;
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || !acceptedTypes.has(file.type) || file.size > maxBytes) {
    return NextResponse.json({ error: "Upload an MP4 or WebM smaller than 50 MB." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const object = getAdminBucket().file(`project-media/${slug}/${Date.now()}-${safeName}`);
  await object.save(Buffer.from(await file.arrayBuffer()), { contentType: file.type, resumable: false });
  await object.makePublic();
  return NextResponse.json({ demoVideo: object.publicUrl() });
}
