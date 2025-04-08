// app/api/news/[id]/route.ts
import { handleGetNewsById, handleUpdateNews, handleDeleteNews } from '@/server/controllers/news.controller';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return await handleGetNewsById(params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return await handleUpdateNews(request, params.id);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return await handleDeleteNews(params.id);
}
