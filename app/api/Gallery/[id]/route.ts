// app/api/gallery/[id]/route.ts
import {
  handleGetGalleryById,
  handleUpdateGallery,
  handleDeleteGallery,
} from '@/server/controllers/gallery.controller';

// Reusable type for Next.js 15+ dynamic routes
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleGetGalleryById(id);
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleUpdateGallery(request, id);
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleDeleteGallery(id);
}
