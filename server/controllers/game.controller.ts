// server/controllers/game.controller.ts

import {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
  } from '../services/game.service';
  import { CreateGameDto, UpdateGameDto } from '../dtos/game.dto';
  
  export async function handleGetAllGames() {
    try {
      const games = await getAllGames();
      return new Response(JSON.stringify(games), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch games' }), { status: 500 });
    }
  }
  
  export async function handleGetGameById(id: string) {
    try {
      const game = await getGameById(id);
      if (!game) return new Response('Game not found', { status: 404 });
      return new Response(JSON.stringify(game), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch game' }), { status: 500 });
    }
  }
  
  export async function handleCreateGame(req: Request) {
    try {
      const body: CreateGameDto = await req.json();
      const newGame = await createGame(body);
      return new Response(JSON.stringify(newGame), { status: 201 });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message || 'Failed to create game' }), { status: 500 });
    }
  }
  
  export async function handleUpdateGame(req: Request, id: string) {
    try {
      const body: UpdateGameDto = await req.json();
      const updatedGame = await updateGame(id, body);
      return new Response(JSON.stringify(updatedGame), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message || 'Failed to update game' }), { status: 500 });
    }
  }
  
  export async function handleDeleteGame(id: string) {
    try {
      await deleteGame(id);
      return new Response(null, { status: 204 });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: 'Failed to delete game' }), { status: 500 });
    }
  }
  