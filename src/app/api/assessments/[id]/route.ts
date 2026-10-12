import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDb } from "@/lib/db";
import { Assessment } from "@/models/Assessment";
import { jsonError, requireApiSession } from "@/lib/api";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession();
  if ("response" in auth) return auth.response;

  const { id } = await params;
  if (!isValidObjectId(id)) return jsonError("Asesmen tidak ditemukan.", 404);

  await connectDb();
  // Filter userId memastikan pengguna hanya bisa membaca asesmennya sendiri.
  const doc = await Assessment.findOne({ _id: id, userId: auth.session.sub }).lean();
  if (!doc) return jsonError("Asesmen tidak ditemukan.", 404);

  return NextResponse.json({ item: doc });
}
