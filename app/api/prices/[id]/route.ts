// app/api/prices/[id]/route.ts
import {
  handleGetPriceById,
  handleUpdatePrice,
  handleDeletePrice,
} from '@/server/controllers/price.controller';

// Next.js 15+ dynamic‐route context
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleGetPriceById(id);
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleUpdatePrice(request, id);
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleDeletePrice(id);
}
