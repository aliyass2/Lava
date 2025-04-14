// server/controllers/news.controller.ts

import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from '../services/news.service';
import { CreateNewsDto, UpdateNewsDto } from '../dtos/news.dto';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (ensure your env variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper: Upload a File (from form-data) directly to Cloudinary using a stream.
 */
function uploadFileToCloudinary(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'news' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    // Convert the Web API File stream into a Node.js Readable stream.
    // The cast ensures compatibility with NodeJS.ReadableStream.
    const nodeStream = Readable.fromWeb(file.stream() as any) as unknown as NodeJS.ReadableStream;
    nodeStream.pipe(uploadStream).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * GET all news items.
 */
export async function handleGetAllNews() {
  try {
    const newsItems = await getAllNews();
    return new Response(JSON.stringify(newsItems), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in handleGetAllNews:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch news' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET a single news item by id.
 */
export async function handleGetNewsById(id: string) {
  try {
    const newsItem = await getNewsById(id);
    if (!newsItem) {
      return new Response(JSON.stringify({ error: 'News not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(newsItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error fetching news item:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch news' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * CREATE news handler.
 * Expects form-data with keys: slug, title, description, category, date, content, and image (as File or string).
 */
export async function handleCreateNews(req: Request) {
  try {
    const formData = await req.formData();
    const slug = formData.get("slug")?.toString() || "";
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const dateStr = formData.get("date")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    
    // Process image field:
    let imageUrl = "";
    const imageField = formData.get("image");
    if (imageField) {
      if (imageField instanceof File) {
        const uploadResult = await uploadFileToCloudinary(imageField);
        imageUrl = uploadResult.secure_url;
      } else if (typeof imageField === "string") {
        imageUrl = imageField;
      }
    }
    
    const data: CreateNewsDto = {
      slug,
      title,
      description,
      category,
      date: dateStr,
      image: imageUrl,
      content,
    };

    const newNews = await createNews(data);
    return new Response(JSON.stringify(newNews), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error creating news:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create news' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * UPDATE news handler.
 * Expects form-data with only the fields to update.  
 * If "image" is provided as a file, it is uploaded to Cloudinary and the secure URL is stored.
 */
export async function handleUpdateNews(req: Request, id: string) {
  try {
    const formData = await req.formData();
    const updateData: UpdateNewsDto = {};
    if (formData.has("slug")) {
      updateData.slug = formData.get("slug")?.toString();
    }
    if (formData.has("title")) {
      updateData.title = formData.get("title")?.toString();
    }
    if (formData.has("description")) {
      updateData.description = formData.get("description")?.toString();
    }
    if (formData.has("category")) {
      updateData.category = formData.get("category")?.toString();
    }
    if (formData.has("date")) {
      updateData.date = formData.get("date")?.toString();
    }
    if (formData.has("content")) {
      updateData.content = formData.get("content")?.toString();
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
    
    const updatedNews = await updateNews(id, updateData);
    return new Response(JSON.stringify(updatedNews), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error updating news:", error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to update news' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * DELETE news handler.
 */
export async function handleDeleteNews(id: string) {
  try {
    await deleteNews(id);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting news:", error);
    return new Response(JSON.stringify({ error: 'Failed to delete news' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
