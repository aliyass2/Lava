// app/api/news/[id]/route.ts
import {
  handleGetNewsById,
  handleUpdateNews,
  handleDeleteNews,
} from '@/server/controllers/news.controller';

// Next.js 15+ dynamic‐route context
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleGetNewsById(id);
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleUpdateNews(request, id);
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleDeleteNews(id);
}
