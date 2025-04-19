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
import { TournamentStatus } from '@prisma/client';

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
  return new Promise(async (resolve, reject) => {
    try {
      // For debugging purposes
      console.log("Starting Cloudinary upload, file size:", file.size);
      
      // Set a timeout to catch hanging uploads
      const timeoutId = setTimeout(() => {
        reject(new Error("Cloudinary upload timed out after 30 seconds"));
      }, 30000);
      
      // Initialize the Cloudinary upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'tournaments',
          resource_type: 'auto' // Let Cloudinary determine the resource type
        },
        (error, result) => {
          clearTimeout(timeoutId); // Clear the timeout
          
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          console.log("Cloudinary upload successful");
          resolve(result);
        }
      );
      
      // Convert the Web API File to ArrayBuffer then to Buffer for more reliable handling
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Use a simpler method to upload
      uploadStream.end(buffer);
      
    } catch (err) {
      console.error("Error in uploadFileToCloudinary:", err);
      reject(err);
    }
  });
}
export async function handleCreateTournament(req: Request) {
  try {
    console.log("Starting tournament creation process");
    const formData = await req.formData();
    
    // Basic validation
    const title = formData.get('title')?.toString();
    if (!title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
    }
    
    // Extract other fields
    const description = formData.get('description')?.toString() || '';
    const status = formData.get('status')?.toString() as TournamentStatus;
    const startDate = formData.get('startDate')?.toString() || '';
    const endDate = formData.get('endDate')?.toString() || '';
    const prize = formData.get('prize')?.toString() || '';
    
    // Process arrays and JSON
    const rules = formData.getAll('rules').map(r => r.toString());
    
    // Safely parse JSON with error handling
    let times, administrators, prizes;
    try {
      times = JSON.parse(formData.get('times')?.toString() || '{}');
      administrators = JSON.parse(formData.get('administrators')?.toString() || '[]');
      prizes = JSON.parse(formData.get('prizes')?.toString() || '[]');
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return new Response(JSON.stringify({ error: 'Invalid JSON format in form data' }), { status: 400 });
    }
    
    // Image handling with more validation
    const imageField = formData.get('image');
    console.log("Image field type:", imageField ? typeof imageField : 'missing');
    
    if (!imageField) {
      return new Response(JSON.stringify({ error: 'Image is required' }), { status: 400 });
    }
    
    if (!(imageField instanceof File)) {
      return new Response(JSON.stringify({ error: 'Image must be a valid file' }), { status: 400 });
    }
    
    console.log(`Processing image: ${imageField.name}, size: ${imageField.size}, type: ${imageField.type}`);
    
    // Handle image upload with explicit error handling
    let imageUrl;
    try {
      console.log("Starting image upload...");
      const uploadResult = await uploadFileToCloudinary(imageField);
      imageUrl = uploadResult.secure_url;
      console.log("Image uploaded successfully:", imageUrl);
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to upload image', 
          details: uploadError.message 
        }), 
        { status: 500 }
      );
    }
    
    // Create tournament data object
    const data: CreateTournamentDto = {
      title,
      description,
      status,
      startDate,
      endDate,
      rules,
      times,
      administrators,
      prize,
      prizes,
      image: imageUrl,
    };
    
    console.log("Creating tournament with data:", JSON.stringify(data, null, 2));
    
    // Create the tournament
    const newTournament = await createTournament(data);
    console.log("Tournament created successfully with ID:", newTournament.id);
    
    return new Response(JSON.stringify(newTournament), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating tournament:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create tournament', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }), 
      { status: 500 }
    );
  }
}
export async function handleUpdateTournament(req: Request, id: string) {
  try {
    const formData = await req.formData();
    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const status = formData.get('status')?.toString() as TournamentStatus;
    const startDate = formData.get('startDate')?.toString();
    const endDate = formData.get('endDate')?.toString();
    const prize = formData.get('prize')?.toString();

    // Optional fields
    let rules: string[] | undefined;
    if (formData.has('rules')) rules = formData.getAll('rules').map(r => r.toString());
    let times: any | undefined;
    if (formData.get('times')) times = JSON.parse(formData.get('times')?.toString() || '{}');
    let administrators: any | undefined;
    if (formData.get('administrators')) administrators = JSON.parse(formData.get('administrators')?.toString() || '[]');
    let prizes: any | undefined;
    if (formData.get('prizes')) prizes = JSON.parse(formData.get('prizes')?.toString() || '[]');

    let image: string | undefined;
    const imageField = formData.get('image');
    if (imageField instanceof File) {
      const uploadResult = await uploadFileToCloudinary(imageField);
      image = uploadResult.secure_url;
    } else if (typeof imageField === 'string') {
      image = imageField;
    }

    const updateData: UpdateTournamentDto = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (prize) updateData.prize = prize;
    if (rules) updateData.rules = rules;
    if (times) updateData.times = times;
    if (administrators) updateData.administrators = administrators;
    if (prizes) updateData.prizes = prizes;
    if (image) updateData.image = image;

    const updatedTournament = await updateTournament(id, updateData);
    return new Response(JSON.stringify(updatedTournament), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error updating tournament:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to update tournament' }), { status: 500 });
  }
}

export async function handleDeleteTournament(id: string) {
  try {
    await deleteTournament(id);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Failed to delete tournament' }), { status: 500 });
  }
}
