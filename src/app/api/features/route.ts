import { NextRequest, NextResponse } from "next/server";

interface Feature {
  id: string;
  name: string;
  category: string;
}

const featuresMap: { [key: string]: Feature[] } = {
  admin: [
    { id: "upload_contact_csv", name: "Upload Contacts CSV", category: "Contacts" },
    { id: "view_contacts", name: "View Contacts", category: "Contacts" },
    { id: "edit_contacts", name: "Edit Contacts", category: "Contacts" },
  ],
  sales_rep: [{ id: "view_contacts", name: "View Contacts", category: "Contacts" }],
};

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role");

  if (!role) {
    return NextResponse.json({ error: "Missing role parameter" }, { status: 400 });
  }

  const features = featuresMap[role] || [];

  return NextResponse.json(features);
}
