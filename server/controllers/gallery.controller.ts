import {
  getAllGalleries,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
} from '../services/gallery.service';
import { CreateGalleryDto, UpdateGalleryDto } from '../dtos/gallery.dto';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper: Upload a file (from form-data) to Cloudinary using a stream.
 * Saves images to the "galleries" folder.
 */
function uploadFileToCloudinary(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'galleries' },
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
 * GET all galleries.
 */
export async function handleGetAllGalleries() {
  try {
    const galleries = await getAllGalleries();
    return new Response(JSON.stringify(galleries), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in handleGetAllGalleries:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch galleries' }), { status: 500 });
  }
}

/**
 * GET gallery by ID.
 */
export async function handleGetGalleryById(id: string) {
  try {
    const gallery = await getGalleryById(id);
    if (!gallery) {
      return new Response(JSON.stringify({ error: 'Gallery not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(gallery), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in handleGetGalleryById:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch gallery' }), { status: 500 });
  }
}

/**
 * CREATE gallery handler.
 * Expects form-data with keys: title, description, and image (as File).
 */
export async function handleCreateGallery(req: Request) {
  try {
    const contentType = req.headers.get("content-type");
    let title: string, description: string, imageUrl: string;
    let data: CreateGalleryDto;

    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      title = formData.get("title")?.toString() || "";
      description = formData.get("description")?.toString() || "";
      const imageField = formData.get("image");
      if (!imageField || !(imageField instanceof File)) {
        return new Response(JSON.stringify({ error: 'Image must be a valid file' }), {
          status: 400,
        });
      }
      const uploadResult = await uploadFileToCloudinary(imageField);
      imageUrl = uploadResult.secure_url;
    } else if (contentType?.includes("application/json")) {
      // If using JSON, you'll need to send an image URL or handle Base64 strings or similar.
      const body = await req.json();
      title = body.title;
      description = body.description;
      imageUrl = body.image; // This must be a URL already or process differently.
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported Content-Type' }), { status: 415 });
    }

    data = { title, description, image: imageUrl };
    const newGallery = await createGallery(data);
    return new Response(JSON.stringify(newGallery), { status: 201 });
  } catch (error: any) {
    console.error("Error in handleCreateGallery:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create gallery' }), { status: 500 });
  }
}


/**
 * UPDATE gallery handler.
 * Expects form-data for updates.
 * If "image" is provided as a file, it will be uploaded to Cloudinary.
 */
export async function handleUpdateGallery(req: Request, id: string) {
  try {
    const formData = await req.formData();
    const updateData: UpdateGalleryDto = {};

    if (formData.has("title")) {
      updateData.title = formData.get("title")?.toString();
    }
    if (formData.has("description")) {
      updateData.description = formData.get("description")?.toString();
    }
    if (formData.has("image")) {
      const imageField = formData.get("image");
      if (imageField instanceof File) {
        const uploadResult = await uploadFileToCloudinary(imageField);
        updateData.image = uploadResult.secure_url;
      } else if (typeof imageField === "string") {
        updateData.image = imageField;
      }
    }

    const updatedGallery = await updateGallery(id, updateData);
    return new Response(JSON.stringify(updatedGallery), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in handleUpdateGallery:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to update gallery' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * DELETE gallery handler.
 */
export async function handleDeleteGallery(id: string) {
  try {
    await deleteGallery(id);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("Error in handleDeleteGallery:", error);
    return new Response(JSON.stringify({ error: 'Failed to delete gallery' }), { status: 500 });
  }
}
