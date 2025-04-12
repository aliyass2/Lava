// app/api/games/route.ts
import { handleGetAllSimpleGames , handleCreateGame } from '@/server/controllers/game.controller';

export async function GET() {
  return await handleGetAllSimpleGames();
}
export async function POST(req: Request) {
  return await handleCreateGame(req);
}
