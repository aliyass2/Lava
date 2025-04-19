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

    // Basic fields
    const title           = formData.get("title")?.toString() || "";
    const category        = formData.get("category")?.toString() || "";
    const description     = formData.get("description")?.toString() || "";
    const longDescription = formData.get("longDescription")?.toString() || "";
    const videoUrl        = formData.get("videoUrl")?.toString() || null;
    const popular         = formData.get("popular")?.toString() === "true";

    // Primary image
    const imageField = formData.get("image");
    if (!(imageField instanceof File)) {
      return new Response(JSON.stringify({ error: 'Primary image is required' }), { status: 400 });
    }
    const primaryResult = await uploadFileToCloudinary(imageField);
    const imageUrl = primaryResult.secure_url;

    // New: systemSpecs & features (expect JSON-encoded strings)
    const systemSpecs: Record<string, string> = JSON.parse(
      formData.get("systemSpecs")?.toString() || "{}"
    );
    const features: string[] = JSON.parse(
      formData.get("features")?.toString() || "[]"
    );

    // New: screenshots (multiple files or URLs)
    const screenshots: string[] = [];
    for (const entry of formData.getAll("screenshots")) {
      if (entry instanceof File) {
        const r = await uploadFileToCloudinary(entry);
        screenshots.push(r.secure_url);
      } else {
        screenshots.push(entry.toString());
      }
    }

    const dto: CreateGameDto = {
      title,
      category,
      description,
      longDescription,
      videoUrl,
      popular,
      image: imageUrl,
      systemSpecs,
      features,
      screenshots,
    };

    const newGame = await createGame(dto);
    return new Response(JSON.stringify(newGame), { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
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
    const updateDto: UpdateGameDto = {};

    // Optional text fields
    if (formData.has("title"))           updateDto.title = formData.get("title")?.toString();
    if (formData.has("category"))        updateDto.category = formData.get("category")?.toString();
    if (formData.has("description"))     updateDto.description = formData.get("description")?.toString();
    if (formData.has("longDescription")) updateDto.longDescription = formData.get("longDescription")?.toString();
    if (formData.has("videoUrl"))        updateDto.videoUrl = formData.get("videoUrl")?.toString();
    if (formData.has("popular"))         updateDto.popular = formData.get("popular")?.toString() === "true";

    // Primary image update
    if (formData.has("image")) {
      const img = formData.get("image");
      if (img instanceof File) {
        const r = await uploadFileToCloudinary(img);
        updateDto.image = r.secure_url;
      } else {
        updateDto.image = img.toString();
      }
    }

    // New: systemSpecs & features
    if (formData.has("systemSpecs")) {
      updateDto.systemSpecs = JSON.parse(formData.get("systemSpecs")!.toString());
    }
    if (formData.has("features")) {
      updateDto.features = JSON.parse(formData.get("features")!.toString());
    }

    // New: screenshots
    if (formData.has("screenshots")) {
      const arr: string[] = [];
      for (const entry of formData.getAll("screenshots")) {
        if (entry instanceof File) {
          const r = await uploadFileToCloudinary(entry);
          arr.push(r.secure_url);
        } else {
          arr.push(entry.toString());
        }
      }
      updateDto.screenshots = arr;
    }

    const updated = await updateGame(id, updateDto);
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
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
