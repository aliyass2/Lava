// app/api/games/[id]/route.ts
import {
  handleGetGameById,
  handleUpdateGame,
  handleDeleteGame,
} from '@/server/controllers/game.controller';

// Reusable Next.js 15+ dynamic‐route context
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleGetGameById(id);
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleUpdateGame(request, id);
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleDeleteGame(id);
}
