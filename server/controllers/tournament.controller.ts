// server/controllers/tournament.controller.ts

import {
    getAllTournaments,
    getTournamentById,
    createTournament,
    updateTournament,
    deleteTournament,
  } from '../services/tournament.service';
  import { CreateTournamentDto, UpdateTournamentDto } from '../dtos/tournament.dto';
  
  export async function handleGetAllTournaments() {
    try {
      const tournaments = await getAllTournaments();
      return new Response(JSON.stringify(tournaments), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch tournaments' }),
        { status: 500 }
      );
    }
  }
  
  export async function handleGetTournamentById(id: string) {
    try {
      const tournament = await getTournamentById(id);
      if (!tournament) return new Response('Tournament not found', { status: 404 });
      return new Response(JSON.stringify(tournament), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch tournament' }),
        { status: 500 }
      );
    }
  }
  
  export async function handleCreateTournament(req: Request) {
    try {
      const body: CreateTournamentDto = await req.json();
      const newTournament = await createTournament(body);
      return new Response(JSON.stringify(newTournament), { status: 201 });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: error.message || 'Failed to create tournament' }),
        { status: 500 }
      );
    }
  }
  
  export async function handleUpdateTournament(req: Request, id: string) {
    try {
      const body: UpdateTournamentDto = await req.json();
      const updatedTournament = await updateTournament(id, body);
      return new Response(JSON.stringify(updatedTournament), { status: 200 });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: error.message || 'Failed to update tournament' }),
        { status: 500 }
      );
    }
  }
  
  export async function handleDeleteTournament(id: string) {
    try {
      await deleteTournament(id);
      return new Response(null, { status: 204 });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: 'Failed to delete tournament' }),
        { status: 500 }
      );
    }
  }
  