// server/controllers/news.controller.ts

import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from '../services/news.service';
import { CreateNewsDto, UpdateNewsDto } from '../dtos/news.dto';

export async function handleGetAllNews() {
  try {
    const news = await getAllNews();
    return new Response(JSON.stringify(news), { status: 200 });
  } catch (error) {
    console.error("Error in handleGetAllNews:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch news' }), { status: 500 });
  }
}

export async function handleGetNewsById(id: string) {
  try {
    const newsItem = await getNewsById(id);
    if (!newsItem) return new Response('News not found', { status: 404 });
    return new Response(JSON.stringify(newsItem), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch news' }), { status: 500 });
  }
}

export async function handleCreateNews(req: Request) {
  try {
    const body: CreateNewsDto = await req.json();
    const newNews = await createNews(body);
    return new Response(JSON.stringify(newNews), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to create news' }), { status: 500 });
  }
}

export async function handleUpdateNews(req: Request, id: string) {
  try {
    const body: UpdateNewsDto = await req.json();
    const updatedNews = await updateNews(id, body);
    return new Response(JSON.stringify(updatedNews), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to update news' }), { status: 500 });
  }
}

export async function handleDeleteNews(id: string) {
  try {
    await deleteNews(id);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Failed to delete news' }), { status: 500 });
  }
}
