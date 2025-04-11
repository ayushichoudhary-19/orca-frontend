import { NextRequest, NextResponse } from "next/server";
import { featuresMap } from "@/lib/rbacStore";

export async function POST(req: NextRequest) {
  const { role, featureIds } = await req.json();

  if (!featuresMap[role]) featuresMap[role] = [];
  featureIds.forEach((id: string) => {
    if (!featuresMap[role].some((f) => f.id === id)) {
      featuresMap[role].push({ id, name: id, category: "Unknown" });
    }
  });

  return NextResponse.json({ success: true });
}
