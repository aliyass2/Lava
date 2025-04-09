// app/api/prices/[id]/route.ts
import { handleGetPriceById, handleUpdatePrice, handleDeletePrice } from '@/server/controllers/price.controller';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return await handleGetPriceById(params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return await handleUpdatePrice(request, params.id);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return await handleDeletePrice(params.id);
}
