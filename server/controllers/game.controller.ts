import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from '../services/game.service';
import { CreateGameDto, UpdateGameDto } from '../dtos/game.dto';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

// Ensure Cloudinary is configured.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper: Upload a file (from form-data) to Cloudinary using a stream.
 * Saves images to the "games" folder.
 */
function uploadFileToCloudinary(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'games' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const nodeStream = Readable.fromWeb(file.stream() as any) as unknown as NodeJS.ReadableStream;
    nodeStream.pipe(uploadStream).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * GET all simple games.
 */
export async function handleGetAllSimpleGames() {
  try {
    const games = await getAllGames();
    const simpleGames = games.map((game) => ({
      id: game.id,
      title: game.title,
      category: game.category,
      imageUrl: game.image,
      description: game.description,
      popular: game.popular,
    }));
    return new Response(JSON.stringify(simpleGames), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in handleGetAllSimpleGames:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch games' }), { status: 500 });
  }
}

/**
 * GET game by ID.
 */
export async function handleGetGameById(id: string) {
  try {
    const game = await getGameById(id);
    if (!game)
      return new Response(JSON.stringify({ error: 'Game not found' }), { status: 404 });
    return new Response(JSON.stringify(game), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in handleGetGameById:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch game' }), { status: 500 });
  }
}

/**
 * CREATE game handler.
 * Expects form-data with keys: title, category, description, longDescription,
 * videoUrl, popular, and image (as File).
 */
export async function handleCreateGame(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const longDescription = formData.get("longDescription")?.toString() || "";
    const videoUrl = formData.get("videoUrl")?.toString() || null;
    const popular = formData.get("popular")?.toString() === "true";

    // Process primary image (as File).
    let imageUrl = "";
    const imageField = formData.get("image");
    if (!imageField || !(imageField instanceof File)) {
      return new Response(JSON.stringify({ error: 'Primary image must be a valid file' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const primaryUploadResult = await uploadFileToCloudinary(imageField);
    imageUrl = primaryUploadResult.secure_url;

    const data: CreateGameDto = {
      title,
      category,
      description,
      longDescription,
      videoUrl,
      popular,
      image: imageUrl, // Cloudinary URL for the primary image.
    };

    const newGame = await createGame(data);
    return new Response(JSON.stringify(newGame), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in handleCreateGame:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create game' }), { status: 500 });
  }
}

/**
 * UPDATE game handler.
 * Expects form-data with only the fields to update.
 * If "image" is provided as a file, it is uploaded to Cloudinary.
 */
export async function handleUpdateGame(req: Request, id: string) {
  try {
    const formData = await req.formData();
    const updateData: UpdateGameDto = {};

    if (formData.has("title")) updateData.title = formData.get("title")?.toString();
    if (formData.has("category")) updateData.category = formData.get("category")?.toString();
    if (formData.has("description")) updateData.description = formData.get("description")?.toString();
    if (formData.has("longDescription")) updateData.longDescription = formData.get("longDescription")?.toString();
    if (formData.has("videoUrl")) updateData.videoUrl = formData.get("videoUrl")?.toString();
    if (formData.has("popular")) updateData.popular = formData.get("popular")?.toString() === "true";

    // Process primary image update if provided.
    if (formData.has("image")) {
      const imageField = formData.get("image");
      if (imageField instanceof File) {
        const uploadResult = await uploadFileToCloudinary(imageField);
        updateData.image = uploadResult.secure_url;
      } else if (typeof imageField === "string") {
        updateData.image = imageField;
      }
    }

    const updatedGame = await updateGame(id, updateData);
    return new Response(JSON.stringify(updatedGame), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in handleUpdateGame:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to update game' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * DELETE game handler.
 */
export async function handleDeleteGame(id: string) {
  try {
    await deleteGame(id);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("Error in handleDeleteGame:", error);
    return new Response(JSON.stringify({ error: 'Failed to delete game' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
