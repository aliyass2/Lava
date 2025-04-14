// server/controllers/tournament.controller.ts

import {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
} from '../services/tournament.service';
import { CreateTournamentDto, UpdateTournamentDto } from '../dtos/tournament.dto';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

export async function handleGetAllTournaments() {
  try {
    const tournaments = await getAllTournaments();
    return new Response(JSON.stringify(tournaments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error fetching tournaments:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tournaments' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Retrieves a tournament by its id.
 */
export async function handleGetTournamentById(id: string) {
  try {
    const tournament = await getTournamentById(id);
    if (!tournament) {
      return new Response(JSON.stringify({ error: 'Tournament not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(tournament), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error fetching tournament:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tournament' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Uploads a File (from form-data) directly to Cloudinary using a stream.
 */
function uploadFileToCloudinary(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    // Initialize the Cloudinary upload stream.
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'tournaments' }, // Adjust folder if needed.
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Convert the Web API File stream into a Node.js Readable stream.
    // Convert the Web API File stream into a Node.js Readable stream.
    const nodeStream = Readable.fromWeb(file.stream() as any); // Ensure compatibility with Node.js streams
    nodeStream.pipe(uploadStream).on('error', (err) => {
      reject(err); // Handle stream errors
    });
  });
}
export async function handleCreateTournament(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const startDate = formData.get("startDate")?.toString() || "";
    const endDate = formData.get("endDate")?.toString() || "";
    const prize = formData.get("prize")?.toString() || "";

    // Validate image field
    const imageField = formData.get("image");
    if (!(imageField instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'Image must be a valid file' }),
        { status: 400 }
      );
    }

    // Upload the file to Cloudinary
    const uploadResult = await uploadFileToCloudinary(imageField);
    const imageUrl = uploadResult.secure_url;

    const data: CreateTournamentDto = {
      title,
      description,
      startDate,
      endDate,
      prize,
      image: imageUrl,
    };

    const newTournament = await createTournament(data);
    return new Response(JSON.stringify(newTournament), { status: 201 });
  } catch (error: any) {
    console.error("Error creating tournament:", error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create tournament',
      }),
      { status: 500 }
    );
  }
}

async function uploadImageToCloudinary(base64Image: string): Promise<string> {
  const dataUri = `data:image/jpeg;base64,${base64Image}`;
  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: 'tournaments', // adjust folder name as needed
  });
  return uploadResult.secure_url;
}
export async function handleUpdateTournament(req: Request, id: string) {
  try {
    const formData = await req.formData();

    // Get text fields from the form-data.
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const startDate = formData.get("startDate")?.toString();
    const endDate = formData.get("endDate")?.toString();
    const prize = formData.get("prize")?.toString();

    let image: string | undefined = undefined;
    const imageField = formData.get("image");
    if (imageField) {
      if (imageField instanceof File) {
        // If a file is provided, stream it to Cloudinary.
        const uploadResult = await uploadFileToCloudinary(imageField);
        image = uploadResult.secure_url;
      } else if (typeof imageField === 'string') {
        // Otherwise, use the string directly (if needed).
        image = imageField;
      }
    }

    // Build the update data object.
    const updateData: UpdateTournamentDto = {};
    if (title !== undefined && title !== "") updateData.title = title;
    if (description !== undefined && description !== "") updateData.description = description;
    if (startDate !== undefined && startDate !== "") updateData.startDate = startDate;
    if (endDate !== undefined && endDate !== "") updateData.endDate = endDate;
    if (prize !== undefined && prize !== "") updateData.prize = prize;
    if (image !== undefined && image !== "") updateData.image = image;

    const updatedTournament = await updateTournament(id, updateData);
    return new Response(JSON.stringify(updatedTournament), { status: 200 });
  } catch (error: any) {
    console.error("Error updating tournament:", error);
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
