// app/api/gallery/route.ts
import { handleGetAllGalleries, handleCreateGallery } from '@/server/controllers/gallery.controller';

export async function GET() {
  return await handleGetAllGalleries();
}

export async function POST(req: Request) {
  return await handleCreateGallery(req);
}
