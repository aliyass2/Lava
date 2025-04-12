// app/api/games/[id]/route.ts
import { handleGetGameById, handleUpdateGame, handleDeleteGame } from '@/server/controllers/game.controller';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return await handleGetGameById(params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return await handleUpdateGame(request, params.id);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return await handleDeleteGame(params.id);
}
