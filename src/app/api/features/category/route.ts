import { NextRequest, NextResponse } from "next/server";
import { featuresMap } from "@/lib/rbacStore";

// Flatten all features from all roles into a unique list
const getAllFeatures = () => {
  const all: Record<string, boolean> = {};
  const flattened: { id: string; name: string; category: string }[] = [];

  for (const role in featuresMap) {
    for (const feature of featuresMap[role]) {
      if (!all[feature.id]) {
        all[feature.id] = true;
        flattened.push(feature);
      }
    }
  }

  return flattened;
};

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("name");

  if (!category) {
    return NextResponse.json({ error: "Missing category" }, { status: 400 });
  }

  const allFeatures = getAllFeatures();
  const filtered = allFeatures.filter((f) => f.category === category);

  return NextResponse.json(filtered);
}
