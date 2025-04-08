// app/api/tournaments/[id]/route.ts
import { handleGetTournamentById, handleUpdateTournament, handleDeleteTournament } from '@/server/controllers/tournament.controller';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return await handleGetTournamentById(params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return await handleUpdateTournament(request, params.id);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return await handleDeleteTournament(params.id);
}
