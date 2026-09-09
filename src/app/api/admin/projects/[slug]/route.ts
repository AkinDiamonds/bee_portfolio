import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: RouteContext<"/api/admin/projects/[slug]">) {
  const { slug } = await params;
  const data = await request.json() as Record<string, unknown>;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: "Use a lowercase kebab-case project slug." }, { status: 400 });
  }

  await getAdminDb().collection("projects").doc(slug).set({ ...data, slug, updatedAt: new Date().toISOString() }, { merge: true });
  return NextResponse.json({ slug });
}
