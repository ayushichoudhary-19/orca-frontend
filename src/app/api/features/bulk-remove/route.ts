import { NextRequest, NextResponse } from "next/server";
import { featuresMap } from "@/lib/rbacStore";

export async function DELETE(req: NextRequest) {
  const { role, featureIds } = await req.json();
  featuresMap[role] = featuresMap[role]?.filter(f => !featureIds.includes(f.id)) || [];
  return NextResponse.json({ success: true });
}
