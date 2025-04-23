// app/api/vips/[id]/route.ts
import {
  handleGetVipById,
  handleUpdateVip,
  handleDeleteVip,
} from '@/server/controllers/vip.controller';

// Next.js 15+ dynamic‐route context
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleGetVipById(id);
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleUpdateVip(request, id);
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleDeleteVip(id);
}
