// app/api/tournaments/[id]/route.ts
import {
  handleGetTournamentById,
  handleUpdateTournament,
  handleDeleteTournament,
} from '@/server/controllers/tournament.controller';

// Next.js 15+ dynamic‐route context
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleGetTournamentById(id);
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleUpdateTournament(request, id);
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  return handleDeleteTournament(id);
}
