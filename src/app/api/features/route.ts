import { NextRequest, NextResponse } from "next/server";
import { featuresMap } from "@/lib/rbacStore";

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role");

  if (!role) {
    return NextResponse.json({ error: "Missing role parameter" }, { status: 400 });
  }

  const features = featuresMap[role] || [];
  return NextResponse.json(features);
}
