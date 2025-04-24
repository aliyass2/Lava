// app/api/admin/[id]/route.ts
import {
  handleGetAdminById,
  handleUpdateAdmin,
  handleDeleteAdmin,
} from '@/server/controllers/admin.controller';

// Helper type for Next.js 15 route context
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return handleGetAdminById(id);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return handleUpdateAdmin(request, id);
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return handleDeleteAdmin(id);
}
