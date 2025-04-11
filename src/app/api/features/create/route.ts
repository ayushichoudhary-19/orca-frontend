import { NextRequest, NextResponse } from "next/server";
import { featuresMap } from "@/lib/rbacStore";

export async function POST(req: NextRequest) {
  const { role, feature } = await req.json();

  if (!role || !feature || !feature.id || !feature.name) {
    return NextResponse.json({ error: "Missing role or feature data" }, { status: 400 });
  }

  if (!featuresMap[role]) {
    featuresMap[role] = [];
  }

  const exists = featuresMap[role].some((f) => f.id === feature.id);
  if (!exists) {
    featuresMap[role].push(feature);
  }

  return NextResponse.json({ success: true, feature });
}
