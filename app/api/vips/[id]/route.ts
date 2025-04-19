// app/api/vips/[id]/route.ts
import { handleGetVipById, handleUpdateVip, handleDeleteVip } from '@/server/controllers/vip.controller';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return await handleGetVipById(params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return await handleUpdateVip(request, params.id);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return await handleDeleteVip(params.id);
}