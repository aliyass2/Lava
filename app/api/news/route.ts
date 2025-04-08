// app/api/news/route.ts
import { handleGetAllNews, handleCreateNews } from '@/server/controllers/news.controller';

export async function GET() {
  return await handleGetAllNews();
}

export async function POST(req: Request) {
  return await handleCreateNews(req);
}
