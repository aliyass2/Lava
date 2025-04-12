// server/controllers/game.controller.ts

import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from '../services/game.service';
import { CreateGameDto, UpdateGameDto } from '../dtos/game.dto';

export async function handleGetAllSimpleGames() {
  try {
    const games = await getAllGames();

    // Transform each game into a minimal DTO.
    // Adjust the imageUrl logic according to how you're serving images.
    const simpleGames = games.map((game) => ({
      id: game.id,
      title: game.title,
      category: game.category,  // assuming your model now includes a category
      // If your images are stored as binary, you might decide to construct a URL,
      // or, if using a static folder, simply return a path.
      // For instance, here we assume the slug helps generate the image path:
      imageUrl: `data:image/png;base64,${Buffer.from(game.image).toString('base64')}`,
      description: game.description,
      slug: game.slug,
      popular: game.popular,
    }));

    return new Response(JSON.stringify(simpleGames), { status: 200 });
  } catch (error) {
    console.error("Error in handleGetAllSimpleGames:", error);
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
