// app/api/gallery/[id]/route.ts
import { handleGetGalleryById, handleUpdateGallery, handleDeleteGallery } from '@/server/controllers/gallery.controller';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return await handleGetGalleryById(params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return await handleUpdateGallery(request, params.id);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return await handleDeleteGallery(params.id);
}
