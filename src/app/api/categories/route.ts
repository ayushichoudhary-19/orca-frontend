import { NextResponse } from "next/server";
import { featuresMap } from "@/lib/rbacStore";

const getAllCategories = () => {
  const categories: Set<string> = new Set();

  for (const role in featuresMap) {
    for (const feature of featuresMap[role]) {
      if (feature.category) {
        categories.add(feature.category);
      }
      console.log(feature.category)
    }
  }

  return Array.from(categories);
};

export async function GET() {
  const categories = getAllCategories();

  if (categories.length === 0) {
    return NextResponse.json({ error: "No categories found" }, { status: 404 });
  }

  return NextResponse.json(categories);
}
