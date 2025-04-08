// app/api/tournaments/route.ts
import { handleGetAllTournaments, handleCreateTournament } from '@/server/controllers/tournament.controller';

export async function GET() {
  return await handleGetAllTournaments();
}

export async function POST(req: Request) {
  return await handleCreateTournament(req);
}
