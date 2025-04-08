// app/api/games/route.ts
import { handleGetAllGames, handleCreateGame } from '@/server/controllers/game.controller';

export async function GET() {
  return await handleGetAllGames();
}

export async function POST(req: Request) {
  return await handleCreateGame(req);
}
