import { NextRequest, NextResponse } from "next/server";
import { allRoles, featuresMap, Role } from "@/lib/rbacStore";

// POST /api/roles → Create a new role
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, name } = body;

  if (!id || !name) {
    return NextResponse.json({ error: "Missing role id or name" }, { status: 400 });
  }

  if (allRoles.some(role => role.id === id)) {
    return NextResponse.json({ error: "Role with this id already exists" }, { status: 400 });
  }

  const newRole: Role = { id, name };
  allRoles.push(newRole);

  if (!featuresMap[id]) {
    featuresMap[id] = [];
  }

  return NextResponse.json({ success: true, role: newRole });
}

// ✅ GET /api/roles → Fetch all roles
export async function GET() {
  return NextResponse.json({ roles: allRoles });
}

export async function DELETE(req: NextRequest) {
    const body = await req.json();
    const { id } = body;
  
    if (!id || !allRoles.some(role => role.id === id)) {
      return NextResponse.json({ error: "Invalid or missing role id" }, { status: 400 });
    }
  
    const roleIndex = allRoles.findIndex(role => role.id === id);
    allRoles.splice(roleIndex, 1);
    delete featuresMap[id];
  
    return NextResponse.json({ success: true, message: `Role with id '${id}' deleted.` });
  }